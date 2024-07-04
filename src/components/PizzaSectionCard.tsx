import {Button} from "./ui/button.tsx";
import React, {useEffect, useState} from "react";
import PizzaModel from "../models/PizzaModel.tsx";
import ImageAPI from "../apis/ImageAPI.tsx";
import UserModel from "../models/UserModel.tsx";
import BasketModel from "../models/BasketModel.tsx";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "./ui/dialog.tsx";
import {CircleAlertIcon, CircleCheckIcon} from "lucide-react";
import {useNavigate} from "react-router-dom";
import BasketAPI from "../apis/BasketAPI.tsx";
import StorageAPI from "../apis/StorageAPI.tsx";

interface PizzaSectionCardProps {
    pizza: PizzaModel;
    loggedInUser: UserModel | undefined;
    loggedInUserBasket: BasketModel | undefined;
    updateBasket: (newBasket: BasketModel) => void;
}

const PizzaSectionCard: React.FC<PizzaSectionCardProps> = ({ pizza, loggedInUser, loggedInUserBasket, updateBasket }) => {
    const [pizzaImage, setPizzaImage] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState(false);

    const handleAddToBasket = async (pizzaId: number) => {
        if (loggedInUser == undefined) {
            navigate("/sign-in");
        }

        else {
            const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

            if (accessToken != null) {
                try {
                    const response = await BasketAPI.addPizzaToUserBasket(loggedInUser.userId, pizzaId, accessToken);
                    updateBasket(response.data.basketDTO);
                }

                catch (error) {
                    console.log(error);
                    setError(true);
                }
            }
        }
    }

    useEffect(() => {
        async function fetchPizzaImage() {
            const response = await ImageAPI.findAllByPizzaId(pizza.pizzaId);

            const imageId = response.data.imagesDTOs[0].imageId;

            const firstImage = await ImageAPI.findById(imageId);

            setPizzaImage(firstImage.data.base64EncodedImage);
        }

        fetchPizzaImage();
    }, []);

    return (
        <>
            {error &&
                <>
                    <Dialog defaultOpen={true}>
                        <DialogTitle />
                        <DialogTrigger asChild>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
                            <div className="flex flex-col items-center justify-center gap-4 py-8">
                                <CircleAlertIcon className="size-12 text-red-500" />
                                <div className="grid gap-2 text-center">
                                    <h3 className="text-2xl font-bold">Error</h3>
                                    <p className="text-muted-foreground">An unexpected error has occurred, please try again later.</p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
            }

            <img
                src={`data:img/jpeg;base64,${pizzaImage}`}
                alt="delicious pizza"
                width={400}
                height={200}
                className="aspect-[3/2] w-full rounded-md object-cover"
            />
            <div className="grid gap-2">
                <h3 className="text-lg font-semibold">{pizza.name}</h3>
                <p className="text-muted-foreground">{pizza.ingredients}</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${pizza.price.toFixed(2)}</span>
                    <Dialog>
                        <DialogTitle />
                        <DialogTrigger asChild>
                            <Button size="sm" onClick={() => handleAddToBasket(pizza.pizzaId)}>Add to Basket</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
                            <div className="flex flex-col items-center justify-center gap-4 py-8">
                                <CircleCheckIcon className="size-12 text-green-500" />
                                <div className="grid gap-2 text-center">
                                    <h3 className="text-2xl font-bold">Pizza added</h3>
                                    <p className="text-muted-foreground">Your delicious pizza has been added to your basket!</p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    );
};

export default PizzaSectionCard;