import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {CircleXIcon} from "lucide-react";
import OrderModel from "../models/OrderModel.tsx";
import StorageAPI from "../apis/StorageAPI.tsx";
import axios from "axios";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const PaymentCancelPage = () => {
    const query = useQuery();
    const id = query.get('id');
    const navigate = useNavigate();

    const orderId = id ? parseInt(id, 10) : undefined;

    const [order, setOrder] = useState<OrderModel | undefined>(undefined);

    useEffect(() => {
        async function fetchOrderData() {
            try {
                const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

                const orderResponse = await axios.get(`http://localhost:8080/api/v1/orders/id=${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });

                setOrder(orderResponse.data.data.orderDTO);
            }

            catch (error) {
                console.log(error);

                if (error.response && (error.response.status == 404 || error.response.status == 500 || error.response.status == 403 || error.response.status == 401)) {
                    navigate("/not-found");
                }
            }
        }

        fetchOrderData();
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