import SignUpForm from "../components/SignUpForm.tsx";
import {useEffect, useState} from "react";
import UserModel from "../models/UserModel.tsx";
import UserAPI from "../apis/UserAPI.tsx";
import {useNavigate} from "react-router-dom";

const SignUpPage = () => {
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
        <>
            <div className="py-10">
                <SignUpForm/>
            </div>
        </>
    );
};

export default SignUpPage;