async function getAccessTokenFromLocalStorage() {
    if (localStorage.getItem('rememberMeToken')) {
        return localStorage.getItem('rememberMeToken');
    }

    else if (localStorage.getItem('refreshToken')) {
        return localStorage.getItem('refreshToken');
    }

    else if (localStorage.getItem('accessToken')) {
        return localStorage.getItem('accessToken');
    }

    else {
        return null;
    }
}

export default { getAccessTokenFromLocalStorage }