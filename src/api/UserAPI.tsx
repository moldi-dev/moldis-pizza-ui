import axios from 'axios';
import {jwtDecode} from "jwt-decode";

async function findAll(page: number, size: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/users?page=${page}&size=${size}`;
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
        const url = `http://localhost:8080/api/v1/users/id=${id}`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function findByUsername(username: string, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/users/username=${username}`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${accessToken}`}
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function findByVerificationToken(token: string, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/users/token=${token}`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function setUserImage(userId: number, imageId: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/users/set-image/id=${userId}/image-id=${imageId}`;
        const response = await axios.patch(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    catch (error) {
        console.log(error);
    }
}

async function removeUserImage(id: number, accessToken: string) {
    try {
        const url = `http://localhost:8080/api/v1/users/remove-image/id=${id}`;
        const response = await axios.delete(url, {
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

async function findLoggedInUser() {
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
        const response = await findByUsername(decodedToken.sub, token);

        return response.data.userDTO;
    }

    return undefined;
}

export default { findAll, findById, findByUsername, setUserImage, removeUserImage, findByVerificationToken, findLoggedInUser, getTokensFromLocalStorage };
