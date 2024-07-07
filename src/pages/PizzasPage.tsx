import {useEffect, useState} from 'react';
import Navbar from '../components/Navbar.tsx';
import PizzaAPI from '../apis/PizzaAPI.tsx';
import PizzaModel from "../models/PizzaModel.tsx";
import UserModel from "../models/UserModel.tsx";
import UserAPI from "../apis/UserAPI.tsx";
import BasketModel from "../models/BasketModel.tsx";
import BasketAPI from "../apis/BasketAPI.tsx";
import ImageAPI from "../apis/ImageAPI.tsx";
import PizzaHeader from "../components/PizzaHeader.tsx"
import Footer from "../components/Footer.tsx";
import PizzasSection from "../components/PizzasSection.tsx";

const PizzasPage = () => {
    const [pizzas, setPizzas] = useState<PizzaModel[]>([]);
    const [page, setPage] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);

    const [loggedInUser, setLoggedInUser] = useState<UserModel | undefined>(undefined);
    const [loggedInUserBasket, setLoggedInUserBasket] = useState<BasketModel | undefined>(undefined);
    const [loggedInUserProfilePicture, setLoggedInUserProfilePicture] = useState('');

    const updatePage = (newPage: number) => {
        setPage(newPage);
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

    useEffect(() => {
        async function fetchPizzas() {
            const response = await PizzaAPI.findAll(page, 8);

            setNumberOfPages(response.data.pizzasDTOs.totalPages);
            setPizzas(response.data.pizzasDTOs.content);
        }

        fetchPizzas();
    }, [page]);

    return (
        <>
            <Navbar loggedInUser={loggedInUser} loggedInUserProfilePicture={loggedInUserProfilePicture} loggedInUserBasket={loggedInUserBasket} />
            <PizzaHeader />
            <PizzasSection numberOfPages={numberOfPages} updatePage={updatePage} pizzas={pizzas} page={page}/>
            <Footer />
        </>
    );
};

export default PizzasPage;
