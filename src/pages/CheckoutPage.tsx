import React, {useEffect, useState} from 'react';
import Navbar from "../components/Navbar.tsx";
import CheckoutSection from "../components/CheckoutSection.tsx";
import Footer from "../components/Footer.tsx";
import UserAPI from "../apis/UserAPI.tsx";
import ImageAPI from "../apis/ImageAPI.tsx";
import BasketAPI from "../apis/BasketAPI.tsx";
import UserModel from "../models/UserModel.tsx";
import BasketModel from "../models/BasketModel.tsx";
import {useNavigate} from "react-router-dom";

const CheckoutPage = () => {
    const navigate = useNavigate();

    const [loggedInUser, setLoggedInUser] = useState<UserModel | undefined>(undefined);
    const [loggedInUserBasket, setLoggedInUserBasket] = useState<BasketModel | undefined>(undefined);
    const [loggedInUserProfilePicture, setLoggedInUserProfilePicture] = useState('');

    useEffect(() => {
        async function fetchUser() {
            const userResponse = await UserAPI.findLoggedInUser();

            if (!userResponse) {
                navigate("/sign-in");
            }

            setLoggedInUser(userResponse);
        }

        async function fetchImage() {
            const imageResponse = await ImageAPI.findLoggedInUserProfilePicture();
            setLoggedInUserProfilePicture(imageResponse);
        }

        async function fetchBasket() {
            const basketResponse = await BasketAPI.findLoggedInUserBasket();

            if (basketResponse.pizzas.length == 0) {
                navigate("/pizzas");
            }

            setLoggedInUserBasket(basketResponse);
        }

        fetchUser();
        fetchImage();
        fetchBasket();
    }, []);

    return (
        <>
            <Navbar loggedInUser={loggedInUser} loggedInUserProfilePicture={loggedInUserProfilePicture}
                    loggedInUserBasket={loggedInUserBasket}/>
            <CheckoutSection loggedInUser={loggedInUser} loggedInUserBasket={loggedInUserBasket}/>
            <Footer/>
        </>
    );
};

export default CheckoutPage;