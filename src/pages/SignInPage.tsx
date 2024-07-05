import SignInForm from "../components/SignInForm.tsx";
import {useEffect, useState} from "react";
import UserAPI from "../apis/UserAPI.tsx";
import UserModel from "../models/UserModel.tsx";
import {useNavigate} from "react-router-dom";

const SignInPage = () => {
    const [loggedInUser, setLoggedInUser] = useState<UserModel | undefined>(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchLoggedInUserData() {
            const user = await UserAPI.findLoggedInUser();

            if (user) {
                navigate("/pizzas")
            }

            setLoggedInUser(user);
        }

        fetchLoggedInUserData();
    }, []);

    return (
        <>
            <div className="py-20">
                <SignInForm />
            </div>
        </>
    );
};

export default SignInPage;
