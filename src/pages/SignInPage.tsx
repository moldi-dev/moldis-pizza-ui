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

    console.log(loggedInUser);

    if (loggedInUser != undefined) {
        // TODO: uncomment the following line when the app is ready
        //  navigate("/pizzas");
    }

    return (
        <>
            <div className="py-20">
                <SignInForm />
            </div>
        </>
    );
};

export default SignInPage;
