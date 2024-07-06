import axios from "axios";

async function findAll(page: number, size: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/reviews?page=${page}&size=${size}`;
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
        const url = `http://localhost:8080/api/v1/reviews/id=${id}`;
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
        const url = `http://localhost:8080/api/v1/reviews/user-id=${id}`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function findAllByPizzaId(id: number, page: number, size: number) {
    try {
        const url = `http://localhost:8080/api/v1/reviews/pizza-id=${id}?page=${page}&size=${size}`;
        const response = await axios.get(url);
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

export default { findAll, findById, findAllByUserId, findAllByPizzaId }