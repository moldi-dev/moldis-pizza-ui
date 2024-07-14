import React, {useState} from 'react';
import {Button} from "./ui/button.tsx";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "./ui/carousel.tsx";
import PizzaModel from "../models/PizzaModel.tsx";
import ReviewModel from "../models/ReviewModel.tsx";
import BasketModel from "../models/BasketModel.tsx";
import UserModel from "../models/UserModel.tsx";
import {useNavigate} from "react-router-dom";
import StorageAPI from "../apis/StorageAPI.tsx";
import BasketAPI from "../apis/BasketAPI.tsx";
import {Dialog, DialogContent, DialogTitle} from "./ui/dialog.tsx";
import {CircleAlertIcon, CircleCheckIcon} from "lucide-react";

interface PizzaComponentProps {
    pizza: PizzaModel | undefined,
    reviews: ReviewModel[],
    loggedInUser: UserModel | undefined,
    loggedInUserBasket: BasketModel | undefined;
    updateBasket: (basket: BasketModel | undefined) => void
    pizzaImages: string[]
}

const PizzaDetails: React.FC<PizzaComponentProps> = ({
                                                         loggedInUser,
                                                         pizzaImages,
                                                         pizza,
                                                         reviews,
                                                         updateBasket,
                                                         loggedInUserBasket
                                                     }) => {
    const navigate = useNavigate();

    const [isPizzaAddedToBasket, setIsPizzaAddedToBasket] = useState(false);
    const [error, setError] = useState(false);

    const handleAddToBasket = async (pizzaId: number | undefined) => {
        if (loggedInUser == undefined) {
            navigate("/sign-in");
        } else {
            const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

            if (accessToken != null) {
                try {
                    const response = await BasketAPI.addPizzaToUserBasket(loggedInUser.userId, pizzaId, accessToken);
                    updateBasket(response.data.basketDTO);
                    setIsPizzaAddedToBasket(true);
                } catch (error) {
                    console.log(error);
                    setError(true);
                    setIsPizzaAddedToBasket(false);
                }
            }
        }
    }

    return (
        <>
            {error &&
                <Dialog open={error} onOpenChange={() => setError(false)}>
                    <DialogTitle/>
                    <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
                        <div className="flex flex-col items-center justify-center gap-4 py-8">
                            <CircleAlertIcon className="size-12 text-red-500"/>
                            <div className="grid gap-2 text-center">
                                <h3 className="text-2xl font-bold">Error</h3>
                                <p className="text-muted-foreground">An unexpected error has occurred, please try again
                                    later.</p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            }

            {isPizzaAddedToBasket &&
                <Dialog open={isPizzaAddedToBasket} onOpenChange={() => setIsPizzaAddedToBasket(false)}>
                    <DialogTitle/>
                    <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
                        <div className="flex flex-col items-center justify-center gap-4 py-8">
                            <CircleCheckIcon className="size-12 text-green-500"/>
                            <div className="grid gap-2 text-center">
                                <h3 className="text-2xl font-bold">Pizza added</h3>
                                <p className="text-muted-foreground">Your delicious pizza has been added to your
                                    basket!</p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            }

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div>
                        <Carousel className="w-full max-w-md">
                            <CarouselContent>
                                {pizzaImages.length > 0 && pizzaImages.map((pizzaImage, index) => (
                                    <CarouselItem key={index}>
                                        <img
                                            src={`data:image/jpeg;base64,${pizzaImage}`}
                                            width={800}
                                            height={600}
                                            alt="delicious pizza"
                                            className="w-full h-auto object-cover"
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious/>
                            <CarouselNext/>
                        </Carousel>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold">{pizza?.name}</h1>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Ingredients</h2>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>{pizza?.ingredients}</li>
                            </ul>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">${pizza?.price.toFixed(2)}</div>
                            <Button size="lg" onClick={() => handleAddToBasket(pizza?.pizzaId)}>Add to Basket</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PizzaDetails;