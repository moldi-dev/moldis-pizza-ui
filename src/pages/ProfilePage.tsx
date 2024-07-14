import React, {useEffect, useState} from 'react';
import UpdateProfileForms from "../components/UpdateProfileForms.tsx";
import Footer from "../components/Footer.tsx";
import Navbar from "../components/Navbar.tsx";
import UserModel from "../models/UserModel.tsx";
import BasketModel from "../models/BasketModel.tsx";
import UserAPI from "../apis/UserAPI.tsx";
import ImageAPI from "../apis/ImageAPI.tsx";
import BasketAPI from "../apis/BasketAPI.tsx";
import {useNavigate} from "react-router-dom";

const ProfilePage = () => {
    const [loggedInUser, setLoggedInUser] = useState<UserModel | undefined>(undefined);
    const [loggedInUserBasket, setLoggedInUserBasket] = useState<BasketModel | undefined>(undefined);
    const [loggedInUserProfilePicture, setLoggedInUserProfilePicture] = useState<string>('');

    const navigate = useNavigate();

    const updateLoggedInUserData = (newUser: UserModel | undefined) => {
        setLoggedInUser(newUser);
    }

    const updateLoggedInUserProfilePicture = (newUserProfilePicture: string) => {
        setLoggedInUserProfilePicture(newUserProfilePicture);
    }

    useEffect(() => {
        async function fetchUser() {
            const userResponse = await UserAPI.findLoggedInUser();
            setLoggedInUser(userResponse);
        }

        async function fetchImage() {
            const imageResponse = await ImageAPI.findLoggedInUserProfilePicture();
            setLoggedInUserProfilePicture(imageResponse);
        }

        async function fetchBasket() {
            const basketResponse = await BasketAPI.findLoggedInUserBasket();
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
            <UpdateProfileForms updateLoggedInUserProfilePicture={updateLoggedInUserProfilePicture}
                                updateLoggedInUserData={updateLoggedInUserData} loggedInUser={loggedInUser}
                                loggedInUserProfilePicture={loggedInUserProfilePicture}/>
            <Footer/>
        </>
    );
};

export default ProfilePage;