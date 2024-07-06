import React, {useEffect, useState} from 'react';
import ForgotPasswordForm from "../components/ForgotPasswordForm.tsx";
import UserModel from "../models/UserModel.tsx";
import {useNavigate} from "react-router-dom";
import UserAPI from "../apis/UserAPI.tsx";

const ForgotPasswordPage = () => {
    const [loggedInUser, setLoggedInUser] = useState<UserModel | undefined>(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchLoggedInUserData() {
            const user = await UserAPI.findLoggedInUser();

            if (user) {
                navigate("/pizzas");
            }

            setLoggedInUser(user);
        }

        fetchLoggedInUserData();
    }, []);

    return (
        <div>
            <div className="py-20">
                <ForgotPasswordForm/>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;