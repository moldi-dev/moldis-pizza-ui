import React, {useEffect, useState} from 'react';
import PizzaModel from "../models/PizzaModel.tsx";
import {Carousel, CarouselContent, CarouselItem} from "./ui/carousel.tsx";
import {Card, CardContent, CardFooter} from "./ui/card.tsx";
import {Button} from "./ui/button.tsx";
import axios from "axios";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "./ui/dialog.tsx";
import {AlertDestructive} from "./ui/alert-destructive.tsx";
import StorageAPI from "../apis/StorageAPI.tsx";
import {XIcon} from "lucide-react";
import {Label} from "./ui/label.tsx";
import {Input} from "./ui/input.tsx";

interface PizzaInPanelCardProps {
    pizza: PizzaModel;
    index: number;
}

function convertBase64ToFile(base64String: string, filename: string): File {
    const byteString = atob(base64String.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
    }

    const newBlob = new Blob([ab], {
        type: 'image/jpeg',
    });

    return new File([newBlob], filename);
}

const PizzaInAdminPanelCard: React.FC<PizzaInPanelCardProps> = ({index, pizza}) => {
    const [initialPizzaImages, setInitialPizzaImages] = useState<string[]>([]);

    const [updatedPizzaImages, setUpdatedPizzaImages] = useState<string[]>([]);

    const [imagesNames, setImagesNames] = useState<string[]>([]);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const [name, setName] = useState<string>('');
    const [ingredients, setIngredients] = useState('');
    const [price, setPrice] = useState(1);

    const openUpdateDialog = () => {
        setIsUpdateDialogOpen(true);

        setName(pizza.name);
        setUpdatedPizzaImages(initialPizzaImages);
        setIngredients(pizza.ingredients);
        setPrice(pizza.price);
    }

    const closeUpdateDialog = () => {
        setIsUpdateDialogOpen(false);

        setName('');
        setUpdatedPizzaImages([]);
        setIngredients('');
        setPrice(1);
    }

    const handleDeletePizza = async () => {
        const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

        try {
            const response = await axios.delete(`http://localhost:8080/api/v1/pizzas/id=${pizza.pizzaId}`, {
                headers: {Authorization: `Bearer ${accessToken}`}
            })

            setIsDeleteDialogOpen(false);

            window.location.reload();
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            }

            setTimeout(() => {
                setErrorMessage('');
            }, 4000);

            setIsDeleteDialogOpen(false);
        }
    }

    const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const base64String = event.target?.result as string;
                setUpdatedPizzaImages(prevImages => [...prevImages, base64String]);
            };

            reader.readAsDataURL(file);

            setImagesNames(prevNames => [...prevNames, file.name]);
        });
    }

    const handleRemoveImage = (index: number) => {
        setUpdatedPizzaImages(prevImages => prevImages.filter((_, i) => i !== index));
    }

    const handleUpdatePizza = async () => {
        const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();
        const formData = new FormData();

        formData.append('name', name);

        updatedPizzaImages.forEach((image, index) => {
            try {
                const imageFile = convertBase64ToFile(image, imagesNames[index]);

                if (imageFile) {
                    formData.append(`images`, imageFile);
                }
            } catch (error) {
                setErrorMessage(error);

                setTimeout(() => {
                    setErrorMessage('');
                }, 4000);
            }
        });

        formData.append('ingredients', ingredients);
        formData.append('price', price.toString());

        try {
            const response = await axios.patch(`http://localhost:8080/api/v1/pizzas/admin/id=${pizza.pizzaId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`
                }
            });

            window.location.reload();
            closeUpdateDialog();
        } catch (error) {
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

    useEffect(() => {
        async function fetchPizzaImages() {
            const fetchedImages = new Array(pizza.images.length).fill('');
            const fetchedNames = new Array(pizza.images.length).fill('');

            for (let index = 0; index < pizza.images.length; index++) {
                const imageId = pizza.images[index].imageId;

                const imageDataResponse = await axios.get(`http://localhost:8080/api/v1/images/id=${imageId}`);

                fetchedNames[index] = pizza.images[index].url.split(' ')[1];
                fetchedImages[index] = 'data:image/jpeg;base64,' + imageDataResponse.data.data.base64EncodedImage;
            }

            setInitialPizzaImages(fetchedImages);
            setImagesNames(fetchedNames);
        }

        fetchPizzaImages();
    }, []);

    return (
        <>
            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={() => setIsDeleteDialogOpen(false)}>
                <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-scroll" aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle>Delete pizza</DialogTitle>
                        <DialogDescription>
                            Are you sure that you want to delete the pizza '{pizza.name}'? This operation will also
                            delete its
                            associated reviews, orders and images. This operation cannot be undone!
                        </DialogDescription>
                    </DialogHeader>
                    {errorMessage && (
                        <AlertDestructive description={errorMessage} title="Error"/>
                    )}
                    <DialogFooter>
                        <Button onClick={handleDeletePizza}>Delete pizza</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update dialog */}
            <Dialog open={isUpdateDialogOpen} onOpenChange={closeUpdateDialog}>
                <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-scroll" aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle>Edit pizza details</DialogTitle>
                    </DialogHeader>
                    {validationErrors.length > 0 && validationErrors.map((error, index) => (
                        <AlertDestructive
                            key={index}
                            title="Error"
                            description={error}
                        />
                    ))}
                    {errorMessage && (
                        <AlertDestructive description={errorMessage} title="Error"/>
                    )}
                    <div className="grid gap-8">
                        <div>
                            <Carousel className="w-full max-w-md">
                                <CarouselContent>
                                    {updatedPizzaImages.map((image, index) => (
                                        <CarouselItem key={index}>
                                            <img
                                                src={`${image}`}
                                                width={448}
                                                height={252}
                                                alt="Delicious pizza"
                                                className="aspect-video object-cover rounded-md"
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <Button onClick={() => handleRemoveImage(index)} variant="ghost"
                                                        size="icon" className="hover:bg-muted/50">
                                                    <XIcon className="w-4 h-4"/>
                                                </Button>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                        </div>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="images">Add images</Label>
                                <Input id="images" type="file" multiple onChange={handleAddImages}/>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" type="text" defaultValue={pizza.name}
                                       onChange={e => setName(e.target.value)}/>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ingredients">Ingredients</Label>
                                <Input id="ingredients" defaultValue={pizza.ingredients}
                                       onChange={e => setIngredients(e.target.value)}/>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" type="number" defaultValue={pizza.price}
                                       onChange={e => setPrice(Number(e.target.value))}/>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleUpdatePizza}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card className="relative">
                <Carousel opts={{align: "start", loop: true}} className="rounded-t-lg">
                    <CarouselContent>
                        {pizza.images.map((image, index) => (
                            <CarouselItem key={index}>
                                <img
                                    src={`${initialPizzaImages[index]}`}
                                    alt="delicious pizza"
                                    width={300}
                                    height={200}
                                    className="object-cover w-full h-full"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{pizza.name}</h3>
                        <div className="text-primary font-semibold">${pizza.price.toFixed(2)}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">{pizza.ingredients}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 p-4">
                    <Button size="sm" variant="outline" onClick={openUpdateDialog}>
                        Update
                    </Button>
                    <Button onClick={() => setIsDeleteDialogOpen(true)} size="sm">
                        Delete
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
};

export default PizzaInAdminPanelCard;