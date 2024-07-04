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
            try {
                const user = await UserAPI.findLoggedInUser();
                setLoggedInUser(user);
            }

            catch (error) {
                console.log(error);
            }
        }

        fetchLoggedInUserData();
    }, []);

    if (loggedInUser != undefined) {
        // TODO: uncomment the following line when the app is ready
        //  navigate("/pizzas");
    }

    return (
        <>
            <div className="py-10">
                <SignUpForm />
            </div>
        </>
    );
};

export default SignUpPage;