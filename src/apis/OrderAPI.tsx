import axios from "axios";
import StorageAPI from "./StorageAPI.tsx";
import UserAPI from "./UserAPI.tsx";

async function findAll(page: number, size: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/orders?page=${page}&size=${size}`;
        const response = await axios.get(url, {
            headers: {Authorization: `Bearer ${accessToken}`}
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

async function findById(id: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/orders/id=${id}`;
        const response = await axios.get(url, {
            headers: {Authorization: `Bearer ${accessToken}`}
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

async function findAllByUserId(id: number, page: number, size: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/orders/user-id=${id}?page=${page}&size=${size}`;
        const response = await axios.get(url, {
            headers: {Authorization: `Bearer ${accessToken}`}
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

async function placeOrderByUsersBasket(id: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/orders/user-id=${id}`;
        const response = await axios.post(url, null, {
            headers: {Authorization: `Bearer ${accessToken}`}
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

async function findLoggedInUserOrders(page: number, size: number) {
    const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();
    const loggedInUser = await UserAPI.findLoggedInUser();

    try {
        const url = `http://localhost:8080/api/v1/orders/user-id=${loggedInUser.userId}?page=${page}&size=${size}`;
        const response = await axios.get(url, {
            headers: {Authorization: `Bearer ${accessToken}`}
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export default {findAll, findById, findAllByUserId, placeOrderByUsersBasket, findLoggedInUserOrders};