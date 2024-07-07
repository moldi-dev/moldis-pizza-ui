import React from 'react';
import OrderModel from "../models/OrderModel.tsx";
import {Card, CardContent, CardFooter, CardHeader} from "./ui/card.tsx";
import {ShoppingCartIcon} from "lucide-react";
import {Link} from "react-router-dom";
import PizzaOrderItem from "./PizzaOrderItem.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "./ui/pagination.tsx";
import {Badge} from "./ui/badge.tsx";
import {Button} from "./ui/button.tsx";
import StorageAPI from "../apis/StorageAPI.tsx";
import axios from "axios";

interface OrdersTableProps {
    loggedInUserOrders: OrderModel[] | undefined;
    numberOfPages: number;
    updatePage: (setPage: number) => void;
    page: number;
}

const OrdersSection: React.FC<OrdersTableProps> = ({ loggedInUserOrders, numberOfPages, updatePage, page }) => {
    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < numberOfPages) {
            updatePage(newPage);
        }
    }

    const handlePayOrder = async (orderId: number) => {
        const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

        try {
            const response = await axios.post(`http://localhost:8080/api/v1/orders/pay-pending-order/id=${orderId}`, {}, {
                headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
            });

            if (response.data.developerMessage) {
                window.location.href = response.data.developerMessage;
            }
        }

        catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {/* Display the orders if any exists  */}
            {loggedInUserOrders != undefined &&
            <div className="container mx-auto py-8">
                <h1 className="text-3xl text-center font-bold mb-6">Your Orders</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loggedInUserOrders && loggedInUserOrders.map((order, index) => (
                        <Card key={index} className="shadow-lg">
                            <CardHeader className="bg-primary text-primary-foreground p-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Order #{index + 1}</span>
                                    <span className="text-sm">{new Date(order.createdDate).toLocaleDateString()}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="mb-4">
                                    {order.status == 'PENDING' ? <Badge className="font-semibold">{order.status}</Badge> : <Badge variant="outline" className="text-red-500">{order.status}</Badge>}
                                </div>
                                <div className="space-y-4">
                                    {order.pizzas.map((pizza, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <PizzaOrderItem pizza={pizza} />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted p-4">
                                <div className="flex justify-between items-end">
                                    {order.status === 'PENDING' && (
                                        <Button className="justify-between items-start" onClick={() => handlePayOrder(order.orderId)}>
                                            Pay ${order.totalPrice.toFixed(2)}
                                        </Button>
                                    )}

                                    {order.status !== 'PENDING' && (
                                        <div className="flex items-end">
                                            Total paid: ${order.totalPrice.toFixed(2)}
                                        </div>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <Pagination className="mt-5">
                    <PaginationContent>
                        {page > 0 && (
                            <PaginationItem>
                                <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationLink isActive={true}>{page + 1}</PaginationLink>
                        </PaginationItem>
                        {page < numberOfPages - 1 && (
                            <PaginationItem>
                                <PaginationNext onClick={() => handlePageChange(page + 1)} />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            </div>
            }

            { /* Display a message if there aren't any orders placed */}
            {loggedInUserOrders == undefined &&
                <section className="flex flex-col items-center justify-center gap-6 py-16 md:py-24">
                    <div className="flex max-w-md flex-col items-center justify-center gap-4 text-center">
                        <ShoppingCartIcon className="h-20 w-20 text-red-500"/>
                        <h1 className="text-2xl font-bold">No Orders Yet</h1>
                        <h2 className="text-muted-foreground">
                            It looks like you haven't placed any orders with us yet. Browse our pizzaas and add
                            something to your cart in order to
                            get started.
                        </h2>
                        <h2 className="text-muted-foreground">
                            We have a wide selection of delicious pizzas to choose from.
                            Whether you're craving a classic Margherita or something more adventurous, we've got you covered.
                        </h2>
                        <Link
                            to="/pizzas"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                            Shop Now
                        </Link>
                    </div>
                </section>
            }

        </>
    );
};

export default OrdersSection;