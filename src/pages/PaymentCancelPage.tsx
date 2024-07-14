import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {CircleXIcon} from "lucide-react";
import UserModel from "../models/UserModel.tsx";
import UserAPI from "../apis/UserAPI.tsx";

const PaymentCancelPage = () => {
    const navigate = useNavigate();

    const [loggedInUser, setLoggedInUser] = useState<UserModel | undefined>(undefined);

    useEffect(() => {
        async function fetchLoggedInUser() {
            try {
                const response = await UserAPI.findLoggedInUser();

                if (!response) {
                    navigate("/not-found");
                }

                setLoggedInUser(response);
            } catch (error) {
                console.log(error);

                if (error.response) {
                    navigate("/not-found");
                }
            }
        }

        fetchLoggedInUser();
    }, []);

    return (
        <>
            <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
                <div className="max-w-md w-full space-y-4 text-center">
                    <CircleXIcon className="mx-auto h-12 w-12 text-red-500"/>
                    <h1 className="text-2xl font-bold">Payment Unsuccessful</h1>
                    <p className="text-muted-foreground">
                        Your order has been saved and can still be paid. Please try again or contact support if you need
                        assistance.
                    </p>
                    <Link
                        to="/orders"
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        View Orders
                    </Link>
                </div>
            </main>
        </>
    );
};

export default PaymentCancelPage;