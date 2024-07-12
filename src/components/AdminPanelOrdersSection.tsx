import React, {useState} from 'react';
import OrderModel from "../models/OrderModel.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "./ui/card.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table.tsx";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "./ui/dropdown-menu.tsx";
import {Button} from "./ui/button.tsx";
import {MoveHorizontalIcon} from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "./ui/pagination.tsx";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "./ui/dialog.tsx";
import {AlertDestructive} from "./ui/alert-destructive.tsx";
import {Label} from "./ui/label.tsx";
import {Input} from "./ui/input.tsx";
import StorageAPI from "../apis/StorageAPI.tsx";
import axios from "axios";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "./ui/select.tsx";

interface AdminPanelOrdersSectionProps {
    orders: OrderModel[],
    page: number,
    numberOfPages: number,
    updatePage: (page: number) => void;
}

const AdminPanelOrdersSection: React.FC<AdminPanelOrdersSectionProps> = ({ orders, page, numberOfPages, updatePage }) => {
    const [editingOrder, setEditingOrder] = useState<OrderModel | null>(null);
    const [deletingOrder, setDeletingOrder] = useState<OrderModel | null>(null);

    const orderStatuses = ["PENDING", "PAID", "DELIVERED"];

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [status, setStatus] = useState<string>('');

    const openUpdateDialog = (order: OrderModel) => {
        setEditingOrder(order);

        setTotalPrice(order.totalPrice);
        setStatus(order.status);
    }

    const closeUpdateDialog = () => {
        setEditingOrder(null);

        setTotalPrice(0);
        setStatus('');
    }

    const openDeleteDialog = (order: OrderModel) => {
        setDeletingOrder(order);
    }

    const closeDeleteDialog = () => {
        setDeletingOrder(null);
    }

    const handleUpdateOrder = async (orderId: string) => {
        if (!editingOrder) return;

        const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

        try {
            const updatedOrder = { ...editingOrder, totalPrice, status };

            const response = await axios.patch(`http://localhost:8080/api/v1/orders/admin/id=${orderId}`, {
                totalPrice,
                status
            }, {
                headers: { Authorization: `Bearer ${accessToken}`}
            });

            window.location.reload();
            closeUpdateDialog();
        }

        catch (error) {
            console.log(error);

            if (error.response && error.response.status == 400) {
                setValidationErrors(error.response.data.data.validationErrors);
            }

            else if (error.response) {
                setErrorMessage(error.response.data.message);
            }

            setTimeout(() => {
                setErrorMessage('');
                setValidationErrors([]);
            }, 4000);
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!deletingOrder) return;

        try {
            const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

            const response = await axios.delete(`http://localhost:8080/api/v1/orders/id=${orderId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            window.location.reload();
            closeDeleteDialog();
        }

        catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            }

            setTimeout(() => {
                setErrorMessage('');
            }, 4000);
        }
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < numberOfPages) {
            updatePage(newPage);
        }
    };

    return (
        <>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Orders</CardTitle>
                        <CardDescription>Manage the orders and their details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Pizzas</TableHead>
                                    <TableHead>Total price</TableHead>
                                    <TableHead>Created date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.length > 0 && orders.map((order, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{order.orderId}</TableCell>
                                        <TableCell>{order.user.username}</TableCell>
                                        <TableCell>
                                            {order.pizzas.length > 0 && order.pizzas.map((pizza, index) => (
                                                <p key={index}>{pizza.name}</p>
                                            ))}
                                        </TableCell>
                                        <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                                        <TableCell>{new Date(order.createdDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoveHorizontalIcon className="w-4 h-4"/>
                                                        <span className="sr-only">Actions</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => openUpdateDialog(order)}>Update</DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => openDeleteDialog(order)}>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                        <Pagination>
                            <PaginationContent>
                                {page > 0 && (
                                    <PaginationItem>
                                        <PaginationPrevious onClick={() => handlePageChange(page - 1)}/>
                                    </PaginationItem>
                                )}
                                <PaginationItem>
                                    <PaginationLink isActive={true}>{page + 1}</PaginationLink>
                                </PaginationItem>
                                {page < numberOfPages - 1 && (
                                    <PaginationItem>
                                        <PaginationNext onClick={() => handlePageChange(page + 1)}/>
                                    </PaginationItem>
                                )}
                            </PaginationContent>
                        </Pagination>
                    </CardFooter>
                </Card>
            </main>

            {/* Update Dialog */}
            {editingOrder && (
                <Dialog open={!!editingOrder} onOpenChange={closeUpdateDialog}>
                    <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-scroll" aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle>Edit order details</DialogTitle>
                        </DialogHeader>
                        {validationErrors.length > 0 && validationErrors.map((error, index) => (
                            <AlertDestructive
                                key={index}
                                title="Error"
                                description={error}
                            />
                        ))}
                        {errorMessage && (
                            <AlertDestructive description={errorMessage} title="Error" />
                        )}
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="totalPrice" className="text-right">Total price</Label>
                                <Input id="totalPrice" type="number" defaultValue={editingOrder.totalPrice} className="col-span-3" onChange={e => setTotalPrice(Number(e.target.value))}/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <Select defaultValue={editingOrder.status} onValueChange={(value) => setStatus(value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {orderStatuses.map((orderStatus, index) => (
                                                <SelectItem key={index} value={orderStatus}>{orderStatus}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={() => handleUpdateOrder(editingOrder?.orderId)}>Save
                                changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Dialog */}
            {deletingOrder && (
                <Dialog open={!!deletingOrder} onOpenChange={closeDeleteDialog}>
                    <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-scroll" aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle>Delete order</DialogTitle>
                            <DialogDescription>Are you sure that you want to delete the order '{deletingOrder.orderId}'?</DialogDescription>
                        </DialogHeader>
                        {errorMessage && (
                            <AlertDestructive description={errorMessage} title="Error" />
                        )}
                        <DialogFooter>
                            <Button onClick={() => handleDeleteOrder(deletingOrder.orderId)}>Delete order</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default AdminPanelOrdersSection;