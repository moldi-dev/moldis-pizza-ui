import React, {useState} from 'react';
import PizzaModel from "../models/PizzaModel.tsx";
import {Button} from "./ui/button.tsx";
import {Carousel, CarouselContent, CarouselItem} from "./ui/carousel.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "./ui/pagination.tsx";
import PizzaInAdminPanelCard from "./PizzaInAdminPanelCard.tsx";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from './ui/dialog.tsx';
import {Label} from "./ui/label.tsx";
import {Input} from "./ui/input.tsx";
import {AlertDestructive} from "./ui/alert-destructive.tsx";
import StorageAPI from "../apis/StorageAPI.tsx";
import axios from "axios";
import {XIcon} from "lucide-react";

interface AdminPanelPizzasSectionProps {
    pizzas: PizzaModel[];
    page: number;
    numberOfPages: number;
    updatePage: (page: number) => void;
}

const AdminPanelPizzasSection: React.FC<AdminPanelPizzasSectionProps> = ({pizzas, page, numberOfPages, updatePage}) => {

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const [name, setName] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [ingredients, setIngredients] = useState('');
    const [price, setPrice] = useState(1);

    const openAddDialog = () => {
        setIsAddDialogOpen(true);

        setName('');
        setImages([]);
        setIngredients('');
        setPrice(1);
    }

    const closeAddDialog = () => {
        setIsAddDialogOpen(false);

        setName('');
        setImages([]);
        setIngredients('');
        setPrice(0);
    }

    const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages(prevImages => [...prevImages, ...files]);
    };

    const handleRemoveImage = (index: number) => {
        setImages(prevImages => prevImages.filter((file, i) => i !== index));
    }

    const handleAddPizza = async () => {
        const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();
        const formData = new FormData();

        formData.append('name', name);

        images.forEach((image, index) => {
            formData.append(`images`, image);
        });

        formData.append('ingredients', ingredients);
        formData.append('price', price.toString());

        try {
            const response = await axios.post('http://localhost:8080/api/v1/pizzas', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`
                }
            });

            window.location.reload();
            setIsAddDialogOpen(false);
        } catch (error) {
            console.log(error);

            if (error.response && error.response.status == 400) {
                setValidationErrors(error.response.data.data.validationErrors);
            } else if (error.response) {
                setErrorMessage(error.response.data.message);
            }

            setTimeout(() => {
                setErrorMessage('');
                setValidationErrors([]);
            }, 4000);
        }
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < numberOfPages) {
            updatePage(newPage);
        }
    };

    return (
        <>
            {isAddDialogOpen &&
                <Dialog open={isAddDialogOpen} onOpenChange={closeAddDialog}>
                    <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-scroll"
                                   aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle>Add Pizza</DialogTitle>
                        </DialogHeader>
                        {errorMessage && (
                            <AlertDestructive description={errorMessage} title="Error"/>
                        )}
                        {validationErrors.length > 0 && validationErrors.map((error, index) => (
                            <AlertDestructive
                                key={index}
                                title="Error"
                                description={error}
                            />
                        ))}
                        <div className="grid gap-8">
                            <div>
                                <Carousel className="w-full max-w-md">
                                    <CarouselContent>
                                        {images.map((image, index) => (
                                            <>
                                                <CarouselItem key={index}>
                                                    <img src={URL.createObjectURL(image as Blob)}
                                                         alt="image"
                                                         width={448}
                                                         height={252}
                                                         className="aspect-video object-cover rounded-md"
                                                    />
                                                    <div className="flex justify-end gap-2 mt-2">
                                                        <Button onClick={() => handleRemoveImage(index)} variant="ghost"
                                                                size="icon" className="hover:bg-muted/50">
                                                            <XIcon className="w-4 h-4"/>
                                                        </Button>
                                                    </div>
                                                </CarouselItem>
                                            </>
                                        ))}
                                    </CarouselContent>
                                </Carousel>
                            </div>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="image">Images</Label>
                                    <Input id="image" type="file" multiple onChange={handleAddImages}/>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Enter pizza name"
                                           onChange={e => setName(e.target.value)}/>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="ingredients">Ingredients</Label>
                                    <Input id="ingredients" placeholder="Enter ingredients (comma-separated)"
                                           onChange={e => setIngredients(e.target.value)}/>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input id="price" min={1} defaultValue={1} type="number" placeholder="Enter price"
                                           onChange={e => setPrice(Number(e.target.value))}/>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddPizza}>Add Pizza</Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>
            }

            <section className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Pizzas</h2>
                    <Button size="sm" onClick={openAddDialog}>Add Pizza</Button>
                </div>
                <div className="flex items-center justify-between mb-6">
                    <p className="text-muted-foreground">Manage the pizzas and their details</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pizzas.length > 0 && pizzas.map((pizza, index) => (
                        <div key={index}>
                            <PizzaInAdminPanelCard index={index} pizza={pizza}/>
                        </div>
                    ))}
                </div>
                <Pagination className="mt-5">
                    <PaginationContent>
                        {page > 0 && (
                            <PaginationItem>
                                <PaginationPrevious onClick={() => handlePageChange(page - 1)}/>
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationLink isActive={true}>{page + 1}</PaginationLink>
                        </PaginationItem>
                        {page < numberOfPages - 1 && (
                            <PaginationItem>
                                <PaginationNext onClick={() => handlePageChange(page + 1)}/>
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            </section>
        </>
    );
};

export default AdminPanelPizzasSection;