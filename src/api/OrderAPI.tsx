import axios from "axios";

async function findAll(page: number, size: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/orders?page=${page}&size=${size}`;
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
        const url = `http://localhost:8080/api/v1/orders/id=${id}`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function findAllByUserId(id: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/orders/user-id=${id}`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function placeOrderByUsersBasket(id: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/orders/user-id=${id}`;
        const response = await axios.post(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

export default { findAll, findById, findAllByUserId, placeOrderByUsersBasket };