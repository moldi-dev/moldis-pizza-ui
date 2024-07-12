import React, {useEffect, useState} from 'react';
import {CircleCheckIcon} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "../components/ui/card.tsx";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import OrderModel from "../models/OrderModel.tsx";
import StorageAPI from "../apis/StorageAPI.tsx";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const PaymentSuccessPage = () => {
    const query = useQuery();
    const id = query.get('id');
    const navigate = useNavigate();

    const orderId = id ? id : undefined;

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

                console.log('ORDER RESPONSE: ' + JSON.stringify(orderResponse, null, '\t'));

                const orderResponse2 = await axios.patch(`http://localhost:8080/api/v1/orders/set-paid/id=${orderId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                })

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
            {order &&
                <div className="flex min-h-screen flex-col bg-background">
                    <main
                        className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-md space-y-6">
                            <div className="flex flex-col items-center justify-center">
                                <CircleCheckIcon className="h-16 w-16 text-green-500"/>
                                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Payment
                                    Successful</h1>
                                <p className="mt-2 text-lg text-muted-foreground">Thank you for your order!</p>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Details</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Order Date:</span>
                                        <span className="font-medium">{new Date(order.createdDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Total:</span>
                                        <span className="font-medium">${order.totalPrice.toFixed(2)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Link
                                to="/orders"
                                className="inline-flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                View Orders
                            </Link>
                        </div>
                    </main>
                </div>
            }
        </>
    );
};

export default PaymentSuccessPage;