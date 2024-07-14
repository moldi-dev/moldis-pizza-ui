import React, {useEffect, useState} from 'react';
import CompleteRegistrationOAuth2UserForm from "../components/CompleteRegistrationOAuth2UserForm.tsx";
import UserAPI from "../apis/UserAPI.tsx";
import UserModel from "../models/UserModel.tsx";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";

const CompleteRegistrationOAuth2UserPage = () => {

    const urlParams = new URLSearchParams(location.search);
    const urlToken = urlParams.get('accessToken');
    const [accessToken, setAccessToken] = useState('');

    const [loggedInUser, setLoggedInUser] = useState<UserModel | undefined>(undefined);

    const navigate = useNavigate();

    useEffect(() => {
        const initialize = async () => {
            if (urlToken) {
                setAccessToken(urlToken);
                await fetchLoggedInUser(urlToken);
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                navigate("/not-found");
            }
        };

        initialize();

        async function fetchLoggedInUser(token: string) {
            try {
                let decodedToken = null;

                if (token) {
                    decodedToken = await jwtDecode(token);

                    const response = await UserAPI.findByUsername(decodedToken.sub, token);

                    setLoggedInUser(response.data.userDTO);
                    await fetchAdditionalData(response.data.userDTO.userId);
                }
            } catch (error) {
                navigate("/not-found");
            }
        }

        async function fetchAdditionalData(userId: number) {
            try {
                const response1 = await axios.get(`http://localhost:8080/api/v1/users/enabled/id=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                const response2 = await axios.get(`http://localhost:8080/api/v1/users/provider/id=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (response1.data.data.answer !== 'FALSE') {
                    navigate("/not-found");
                }

                if (response2.data.message !== 'GOOGLE') {
                    navigate("/not-found");
                }
            } catch (error) {
                console.log(error);
                //navigate("/not-found");
            }
        }
    }, []);

    return (
        <>
            <CompleteRegistrationOAuth2UserForm loggedInUser={loggedInUser} accessToken={accessToken}/>
        </>
    );
};

export default CompleteRegistrationOAuth2UserPage;