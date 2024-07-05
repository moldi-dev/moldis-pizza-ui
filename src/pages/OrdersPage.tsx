import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import UserModel from "../models/UserModel.tsx";
import OrderModel from "../models/OrderModel.tsx";
import BasketModel from "../models/BasketModel.tsx";
import UserAPI from "../apis/UserAPI.tsx";
import ImageAPI from "../apis/ImageAPI.tsx";
import BasketAPI from "../apis/BasketAPI.tsx";
import OrderAPI from "../apis/OrderAPI.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import OrdersSection from "../components/OrdersSection.tsx";

const OrdersPage = () => {
    const [loggedInUser, setLoggedInUser] = useState<UserModel | undefined>(undefined);
    const [loggedInUserBasket, setLoggedInUserBasket] = useState<BasketModel | undefined>(undefined);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [loggedInUserProfilePicture, setLoggedInUserProfilePicture] = useState('');
    const [loggedInUserOrders, setLoggedInUserOrders] = useState<OrderModel[] | undefined>(undefined);
    const navigate = useNavigate();
    const [page, setPage] = useState(0);

    const updatePage = (newPage: number) => {
        setPage(newPage);
    }

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userResponse = await UserAPI.findLoggedInUser();

                if (!userResponse) {
                    navigate("/sign-in");
                }

                setLoggedInUser(userResponse);

                // @ts-ignore
                const imageResponse = await ImageAPI.findByUserId(userResponse.userId);
                setLoggedInUserProfilePicture(imageResponse.data.base64EncodedImage);

                const basketResponse = await BasketAPI.findLoggedInUserBasket();
                setLoggedInUserBasket(basketResponse);
            }

            catch (error) {
                console.error(error);
            }
        }

        fetchUserData();
    }, []);

    useEffect(() => {
        async function fetchLoggedInUserOrders() {
            const response = await OrderAPI.findLoggedInUserOrders(page, 3);

            setNumberOfPages(response.data.ordersDTOs.totalPages);
            setLoggedInUserOrders(response.data.ordersDTOs.content);
        }

        fetchLoggedInUserOrders();
    }, [page]);

    return (
        <div>
            <Navbar loggedInUser={loggedInUser} loggedInUserProfilePicture={loggedInUserProfilePicture} loggedInUserBasket={loggedInUserBasket} />
            <OrdersSection numberOfPages={numberOfPages} updatePage={updatePage} page={page}  loggedInUserOrders={loggedInUserOrders}/>
            <Footer />
        </div>
    );
};

export default OrdersPage;