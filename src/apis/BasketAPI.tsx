import axios from "axios";
import {jwtDecode} from "jwt-decode";
import UserAPI from "./UserAPI.tsx";
import StorageAPI from "./StorageAPI.tsx";

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

async function addPizzaToUserBasket(userId: number, pizzaId: number | undefined, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/baskets/add-pizza/user-id=${userId}/pizza-id=${pizzaId}`;
        const response = await axios.patch(url, null, {
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
        const url = `http://localhost:8080/api/v1/baskets/remove-pizza/user-id=${userId}/pizza-id=${pizzaId}`;

        const response = await axios.patch(url, null, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function findLoggedInUserBasket() {
    const token = await StorageAPI.getAccessTokenFromLocalStorage();
    let decodedToken = null;

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

export default { findAll, findById, findByUserId, addPizzaToUserBasket, removePizzaFromUserBasket, findLoggedInUserBasket }