import axios from "axios";
import {jwtDecode} from "jwt-decode";
import UserAPI from "./UserAPI.tsx";

async function findAll(page: number, size: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/baskets?page=${page}&size=${size}`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function findById(id: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/baskets/id=${id}`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function findByUserId(id: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/baskets/user-id=${id}`;
        const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function addPizzaToUserBasket(userId: number, pizzaId: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/baskets/add-pizza/user-id=${userId}/pizza-id=${pizzaId}`;
        const response = await axios.patch(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function removePizzaFromUserBasket(userId: number, pizzaId: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/baskets/remove-pizza/user-id${userId}/pizza-id=${pizzaId}`;
        const response = await axios.patch(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function getTokensFromLocalStorage() {
    const accessToken = localStorage.getItem('accessToken') || null;
    const refreshToken = localStorage.getItem('refreshToken') || null;
    const rememberMeToken = localStorage.getItem('rememberMeToken') || null;

    return [accessToken, refreshToken, rememberMeToken];
}

async function findLoggedInUserBasket() {
    const [accessToken, refreshToken, rememberMeToken] = await getTokensFromLocalStorage();

    let token = null;
    let decodedToken = null;

    if (rememberMeToken != null) {
        token = rememberMeToken;
    }

    else if (refreshToken != null) {
        token = refreshToken;
    }

    else if (accessToken != null) {
        token = accessToken;
    }

    if (token != null) {
        decodedToken = jwtDecode(token);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const user = await UserAPI.findByUsername(decodedToken.sub, token);

        const response = await findByUserId(user.data.userDTO.userId, token);

        return response.data.basketDTO;
    }

    return undefined;
}

export default { findAll, findById, findByUserId, addPizzaToUserBasket, removePizzaFromUserBasket, getTokensFromLocalStorage, findLoggedInUserBasket }