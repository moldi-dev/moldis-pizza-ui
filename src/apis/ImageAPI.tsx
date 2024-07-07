import axios from "axios";
import StorageAPI from "./StorageAPI.tsx";
import {jwtDecode} from "jwt-decode";
import UserAPI from "./UserAPI.tsx";

async function findAll(page: number, size: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/images?page=${page}&size=${size}`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function findAllByType(type: string, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/images/type=${type}`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function findById(id: number) {
    try {
        const url = `http://localhost:8080/api/v1/images/id=${id}`;
        const response = await axios.get(url);
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function findByUrl(url: string, accessToken: string) {
    try {
        const requestUrl = `http://localhost:8080/api/v1/images/url=${url}`;
        const response = await axios.get(requestUrl, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function findByUserId(id: number) {
    try {
        const url = `http://localhost:8080/api/v1/images/user-id=${id}`;
        const response = await axios.get(url);
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function findAllByPizzaId(id: number) {
    try {
        const url = `http://localhost:8080/api/v1/images/pizza-id=${id}`;
        const response = await axios.get(url);
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function findLoggedInUserProfilePicture() {
    const token = await StorageAPI.getAccessTokenFromLocalStorage();
    let decodedToken = null;

    if (token != null) {
        decodedToken = jwtDecode(token);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const user = await UserAPI.findByUsername(decodedToken.sub, token);

        const response = await findById(user.data.userDTO.image.imageId);

        return response.data.base64EncodedImage;
    }

    return undefined;
}

export default { findAll, findAllByType, findById, findByUrl, findAllByPizzaId, findByUserId, findLoggedInUserProfilePicture };