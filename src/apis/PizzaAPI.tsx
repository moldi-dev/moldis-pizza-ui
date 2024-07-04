import axios from 'axios';

async function findAll(page: number, size: number) {
    try {
        const url = `http://localhost:8080/api/v1/pizzas?page=${page}&size=${size}`;
        const response = await axios.get(url);
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function findById(id: number) {
    try {
        const url = `http://localhost:8080/api/v1/pizzas/id=${id}`;
        const response = await axios.get(url);
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function findByName(name: string) {
    try {
        const url = `http://localhost:8080/api/v1/pizzas/name=${name}`;
        const response = await axios.get(url);
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

export default { findAll, findById, findByName };



