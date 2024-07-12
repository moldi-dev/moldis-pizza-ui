import React, {useEffect, useState} from 'react';
import UserModel from "../models/UserModel.tsx";
import UserAPI from "../apis/UserAPI.tsx";
import {useNavigate, useParams} from "react-router-dom";
import StorageAPI from "../apis/StorageAPI.tsx";
import axios from "axios";
import AdminPanelNavbar from "../components/AdminPanelNavbar.tsx";
import AdminPanelUsersSection from "../components/AdminPanelUsersSection.tsx";
import PizzaModel from "../models/PizzaModel.tsx";
import OrderModel from "../models/OrderModel.tsx";
import PizzaAPI from "../apis/PizzaAPI.tsx";
import OrderAPI from "../apis/OrderAPI.tsx";
import AdminPanelOrdersSection from "../components/AdminPanelOrdersSection.tsx";
import ReviewAPI from "../apis/ReviewAPI.tsx";
import ReviewModel from "../models/ReviewModel.tsx";
import AdminPanelReviewsSection from "../components/AdminPanelReviewsSection.tsx";
import AdminPanelPizzasSection from "../components/AdminPanelPizzasSection.tsx";

const AdminPanelPage = () => {
    const [loggedInUser, setLoggedInUser] = useState<UserModel | undefined>();
    const [isAdmin, setIsAdmin] = useState(false);

    const [users, setUsers] = useState<UserModel[]>([]);
    const [usersPage, setUsersPage] = useState(0);
    const [numberOfPagesUsers, setNumberOfPagesUsers] = useState(0);

    const [pizzas, setPizzas] = useState<PizzaModel[]>([]);
    const [pizzasPage, setPizzasPage] = useState(0);
    const [numberOfPagesPizzas, setNumberOfPagesPizzas] = useState(0);

    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [ordersPage, setOrdersPage] = useState(0);
    const [numberOfPagesOrders, setNumberOfPagesOrders] = useState(0);

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [reviewsPage, setReviewsPage] = useState(0);
    const [numberOfPagesReviews, setNumberOfPagesReviews] = useState(0);

    const navigate = useNavigate();

    const { panel } = useParams();

    useEffect(() => {
        async function fetchAndTestUser() {
            try {
                const userResponse = await UserAPI.findLoggedInUser();

                if (!userResponse) {
                    navigate("/sign-in");
                }

                setLoggedInUser(userResponse);

                const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

                const response2 = await axios.get(`http://localhost:8080/api/v1/users/admin/id=${userResponse.userId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                setIsAdmin(response2.data.data.answer);
            }

            catch (error) {
                console.log(error);
                navigate("/pizzas");
            }
        }

        fetchAndTestUser();
    }, []);

    useEffect(() => {
        async function fetchUsersData() {
            const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

            if (accessToken) {
                const response = await UserAPI.findAll(usersPage, 10, accessToken);

                //console.log('USERS RESPONSE: ' + JSON.stringify(response, null, '\t'));

                setUsers(response.data.usersDTOs.content);
                setNumberOfPagesUsers(response.data.usersDTOs.totalPages);
            }
        }

        fetchUsersData();
    }, [usersPage]);

    useEffect(() => {
        async function fetchPizzasData() {
            const response = await PizzaAPI.findAll(pizzasPage, 10);

            //console.log('PIZZAS RESPONSE: ' + JSON.stringify(response, null, '\t'));

            setPizzas(response.data.pizzasDTOs.content);
            setNumberOfPagesPizzas(response.data.pizzasDTOs.totalPages);
        }

        fetchPizzasData();
    }, [pizzasPage]);

    useEffect(() => {
        async function fetchOrdersData() {
            const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

            if (accessToken) {
                const response = await OrderAPI.findAll(ordersPage, 10, accessToken);

                //console.log('ORDERS RESPONSE: ' + JSON.stringify(response, null, '\t'));

                setOrders(response.data.ordersDTOs.content);
                setNumberOfPagesOrders(response.data.ordersDTOs.totalPages);
            }
        }

        fetchOrdersData();
    }, [ordersPage]);

    useEffect(() => {
        async function fetchReviewsData() {
            const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

            if (accessToken) {
                const response = await ReviewAPI.findAll(reviewsPage, 10, accessToken);

                setReviews(response.data.reviewsDTOs.content);
                setNumberOfPagesReviews(response.data.reviewsDTOs.totalPages);
            }
        }

        fetchReviewsData();
    }, [reviewsPage]);

    return (
        <>
            <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-[280px_1fr] overflow-hidden">
                <AdminPanelNavbar panel={panel}/>
                <div className="flex flex-col">
                    {panel === 'users' ? <AdminPanelUsersSection users={users} page={usersPage} numberOfPages={numberOfPagesUsers} updatePage={setUsersPage}/> : ''}
                    {panel === 'pizzas' ? <AdminPanelPizzasSection pizzas={pizzas} page={pizzasPage} numberOfPages={numberOfPagesPizzas} updatePage={setPizzasPage}/> : ''}
                    {panel === 'orders' ? <AdminPanelOrdersSection orders={orders} page={ordersPage} numberOfPages={numberOfPagesOrders} updatePage={setOrdersPage}/> : ''}
                    {panel === 'reviews' ? <AdminPanelReviewsSection reviews={reviews} page={reviewsPage} numberOfPages={numberOfPagesReviews} updatePage={setReviewsPage}/> : ''}
                </div>
            </div>
        </>
    );
};

export default AdminPanelPage;