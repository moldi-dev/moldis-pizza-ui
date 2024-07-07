import React, {useState} from 'react';
import {Button} from "./ui/button.tsx";
import {Separator} from "./ui/separator.tsx";
import BasketModel from "../models/BasketModel.tsx";
import PizzaCheckoutDetail from "./PizzaCheckoutDetail.tsx";
import StorageAPI from "../apis/StorageAPI.tsx";
import OrderAPI from "../apis/OrderAPI.tsx";
import {useNavigate} from "react-router-dom";
import UserModel from "../models/UserModel.tsx";
import PizzaModel from '../models/PizzaModel.tsx';

interface CheckoutSectionProps {
    loggedInUserBasket: BasketModel | undefined;
    loggedInUser: UserModel | undefined;
}

const CheckoutSection: React.FC<CheckoutSectionProps> = ({ loggedInUser, loggedInUserBasket }) => {
    const navigate = useNavigate();

    const [basket, setBasket] = useState<BasketModel | undefined>(loggedInUserBasket);

    const handleProceedToPayment = async () => {
        const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

        if (loggedInUser != undefined && accessToken != null) {
            try {
                const response = await OrderAPI.placeOrderByUsersBasket(loggedInUser.userId, accessToken);

                // @ts-ignore
                setBasket((prevBasket) => ({
                    ...prevBasket,
                    pizzas: [] as PizzaModel[],
                }));

                if (response.developerMessage) {
                    window.location.href = response.developerMessage;
                }
            }

            catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <>
            {loggedInUserBasket && loggedInUserBasket.pizzas.length > 0 && (
                <div className="flex flex-col items-center p-4 md:p-8">
                    <div className="w-full max-w-4xl">
                        <h1 className="text-3xl font-bold mb-4 text-center">Checkout</h1>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {loggedInUserBasket.pizzas.map((pizza, index) => (
                                <div key={index} className="bg-background rounded-lg overflow-hidden shadow-lg">
                                    <PizzaCheckoutDetail pizza={pizza}/>
                                </div>
                            ))}
                        </div>
                        <div className="bg-background rounded-lg p-6 shadow-2xl">
                            <h2 className="text-2xl font-bold mb-4 text-center">Order Summary</h2>
                            <div className="grid gap-4">
                                {loggedInUserBasket.pizzas.map((pizza, index) => (
                                    <div key={index} className="flex justify-between">
                                        <p>{pizza.name}</p>
                                        <p>${pizza.price.toFixed(2)}</p>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex justify-between font-bold">
                                    <p>Total</p>
                                    <p>${loggedInUserBasket.totalPrice.toFixed(2)}</p>
                                </div>
                            </div>
                            <Button size="lg" className="w-full mt-6" onClick={handleProceedToPayment}>
                                Proceed to Payment
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CheckoutSection;