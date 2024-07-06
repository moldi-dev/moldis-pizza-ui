import React, {useEffect, useState} from 'react';
import PizzaModel from "../models/PizzaModel.tsx";
import UserModel from "../models/UserModel.tsx";
import BasketModel from "../models/BasketModel.tsx";
import UserAPI from "../apis/UserAPI.tsx";
import ImageAPI from "../apis/ImageAPI.tsx";
import BasketAPI from "../apis/BasketAPI.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import PizzaDetails from "../components/PizzaDetails.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import ReviewModel from "../models/ReviewModel.tsx";
import ReviewAPI from "../apis/ReviewAPI.tsx";
import ReviewsSection from "../components/ReviewsSection.tsx";
import {Separator} from "../components/ui/separator.tsx";
import StorageAPI from "../apis/StorageAPI.tsx";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const PizzaPage = () => {
    const [loggedInUser, setLoggedInUser] = useState<UserModel | undefined>(undefined);
    const [loggedInUserBasket, setLoggedInUserBasket] = useState<BasketModel | undefined>(undefined);
    const [loggedInUserProfilePicture, setLoggedInUserProfilePicture] = useState('');

    const [hasLoggedInUserBoughtThePizza, setHasLoggedInUserBoughtThePizza] = useState(false);
    const [hasLoggedInUserReviewedThePizza, setHasLoggedInUserReviewedThePizza] = useState(false);

    const [pizzaImages, setPizzaImages] = useState<string[]>([]);

    const [page, setPage] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);

    const query = useQuery();
    const id = query.get('id');

    const navigate = useNavigate();

    const pizzaId = id ? parseInt(id, 10) : undefined;
    const [pizza, setPizza] = useState<PizzaModel | undefined>(undefined);
    const [reviews, setReviews] = useState<ReviewModel[]>([]);

    const addReview = (review: ReviewModel) => {
        reviews.push(review);
    }

    const updateBasket = (newBasket: BasketModel | undefined) => {
        setLoggedInUserBasket(newBasket);
    }

    const updatePage = (newPage: number) => {
        setPage(newPage);
    }

    useEffect(() => {
        async function fetchUserData() {
            try {
                const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

                const userResponse = await UserAPI.findLoggedInUser();
                setLoggedInUser(userResponse);

                const imageResponse = await ImageAPI.findByUserId(userResponse.userId);
                setLoggedInUserProfilePicture(imageResponse.data.base64EncodedImage);

                const basketResponse = await BasketAPI.findLoggedInUserBasket();
                setLoggedInUserBasket(basketResponse);

                fetchAdditionalData(userResponse.userId, accessToken);
            }

            catch (error) {
                console.error(error);
            }
        }

        async function fetchAdditionalData(userId: number, accessToken: string | null) {
            try {
                const hasBoughtResponse = await axios.get(`http://localhost:8080/api/v1/orders/user-id=${userId}/pizza-id=${pizzaId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });

                setHasLoggedInUserBoughtThePizza(hasBoughtResponse.data.data.answer);

                const hasReviewedResponse = await axios.get(`http://localhost:8080/api/v1/reviews/user-id=${userId}/pizza-id=${pizzaId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                setHasLoggedInUserReviewedThePizza(hasReviewedResponse.data.data.answer);
            }

            catch (error) {
                console.error(error);
            }
        }

        fetchUserData();
    }, []);

    useEffect(() => {
        async function fetchPizzaData() {
            try {
                const pizzaResponse = await axios.get(`http://localhost:8080/api/v1/pizzas/id=${pizzaId}`);

                setPizza(pizzaResponse.data.data.pizzaDTO);

                const images = pizzaResponse.data.data.pizzaDTO.images;
                const fetchedImages: string[] = [];

                for (let index = 0; index < images.length; index++) {
                    const imageId = images[index].imageId;

                    const imageDataResponse = await axios.get(`http://localhost:8080/api/v1/images/id=${imageId}`);

                    fetchedImages.push(imageDataResponse.data.data.base64EncodedImage);
                }

                setPizzaImages(fetchedImages);
            }

            catch (error) {
                console.log(error);

                if (error.response && (error.response.status == 404 || error.response.status == 500)) {
                    navigate("/not-found");
                }
            }
        }

        fetchPizzaData();
    }, []);

    useEffect(() => {
        async function fetchReviewsData() {
            try {
                if (pizzaId != undefined) {
                    const reviewsResponse = await ReviewAPI.findAllByPizzaId(pizzaId, page, 3);
                    setReviews(reviewsResponse.data.reviewsDTOs.content);

                    setNumberOfPages(reviewsResponse.data.reviewsDTOs.totalPages);
                }
            }

            catch (error) {
                console.log(error);
            }
        }

        fetchReviewsData();
    }, []);

    console.log('HAS REVIEWED: ' + JSON.stringify(hasLoggedInUserReviewedThePizza, null, '\t'));
    console.log('HAS BOUGHT: ' + JSON.stringify(hasLoggedInUserBoughtThePizza, null, '\t'));

    return (
        <>
            <Navbar loggedInUser={loggedInUser} loggedInUserProfilePicture={loggedInUserProfilePicture} loggedInUserBasket={loggedInUserBasket} />
            <PizzaDetails loggedInUser={loggedInUser} pizzaImages={pizzaImages} pizza={pizza} reviews={reviews} loggedInUserBasket={loggedInUserBasket} updateBasket={updateBasket}/>
            <Separator className="mt-12"/>
            <ReviewsSection page={page} updatePage={updatePage} numberOfPages={numberOfPages} updateHasLoggedInUserReviewedThePizza={e => setHasLoggedInUserReviewedThePizza(e)} hasLoggedInUserBoughtThePizza={hasLoggedInUserBoughtThePizza} hasLoggedInUserReviewedThePizza={hasLoggedInUserReviewedThePizza} pizzaId={pizzaId} addReview={addReview} loggedInUser={loggedInUser} reviews={reviews} />
            <Footer />
        </>
    );
};

export default PizzaPage;