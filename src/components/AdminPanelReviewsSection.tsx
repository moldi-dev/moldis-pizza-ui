import React, {useState} from 'react';
import ReviewModel from "../models/ReviewModel.tsx";
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

interface AdminPanelReviewsSectionProps {
    reviews: ReviewModel[],
    page: number,
    numberOfPages: number,
    updatePage: (page: number) => void;
}

const AdminPanelReviewsSection: React.FC<AdminPanelReviewsSectionProps> = ({ reviews, page, numberOfPages, updatePage }) => {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');

    const [editingReview, setEditingReview] = useState<ReviewModel | null>(null);
    const [deletingReview, setDeletingReview] = useState<ReviewModel | null>(null);

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const openUpdateDialog = (review: ReviewModel) => {
        setEditingReview(review);

        setRating(review.rating);
        setComment(review.comment);
    }

    const closeUpdateDialog = () => {
        setEditingReview(null);

        setRating(1);
        setComment('');
    }

    const openDeleteDialog = (review: ReviewModel) => {
        setDeletingReview(review);
    }

    const closeDeleteDialog = () => {
        setDeletingReview(null);
    }

    const handleUpdateReview = async (reviewId: number) => {
        if (!editingReview) return;

        const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

        try {
            const updatedReview = { ...editingReview, rating, comment };

            const response = await axios.patch(`http://localhost:8080/api/v1/reviews/admin/id=${reviewId}`, {
                rating,
                comment
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

    const handleDeleteReview = async (reviewId: number) => {
        if (!deletingReview) return;

        try {
            const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

            const response = await axios.delete(`http://localhost:8080/api/v1/reviews/id=${reviewId}`, {
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
                        <CardTitle>Reviews</CardTitle>
                        <CardDescription>Manage the reviews and their details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Review ID</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Pizza name</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Comment</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviews.length > 0 && reviews.map((review, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{review.reviewId}</TableCell>
                                        <TableCell>{review.userDTO.username}</TableCell>
                                        <TableCell>{review.pizza.name}</TableCell>
                                        <TableCell>{review.rating}</TableCell>
                                        <TableCell>{review.comment}</TableCell>
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
                                                        onClick={() => openUpdateDialog(review)}>Update</DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => openDeleteDialog(review)}>Delete</DropdownMenuItem>
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
            {editingReview && (
                <Dialog open={!!editingReview} onOpenChange={closeUpdateDialog}>
                    <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-scroll" aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle>Edit review details</DialogTitle>
                        </DialogHeader>
                        {validationErrors.length > 0 && validationErrors.map((error, index) => (
                            <AlertDestructive
                                key={index}
                                title="Error"
                                description={error}
                            />
                        ))}
                        {errorMessage && (
                            <AlertDestructive description={errorMessage} title="Error"/>
                        )}
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="rating" className="text-right">Rating</Label>
                                <Input id="rating" type="number" max={5} min={1} defaultValue={editingReview.rating}
                                       className="col-span-3" onChange={e => setRating(Number(e.target.value))}/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="comment" className="text-right">Comment</Label>
                                <Input id="comment" defaultValue={editingReview.comment}
                                       className="col-span-3" onChange={e => setComment(e.target.value)}/>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={() => handleUpdateReview(editingReview?.reviewId)}>Save
                                changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Dialog */}
            {deletingReview && (
                <Dialog open={!!deletingReview} onOpenChange={closeDeleteDialog}>
                    <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-scroll" aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle>Delete review</DialogTitle>
                            <DialogDescription>Are you sure that you want to delete the review
                                '{deletingReview.reviewId}'?</DialogDescription>
                        </DialogHeader>
                        {errorMessage && (
                            <AlertDestructive description={errorMessage} title="Error"/>
                        )}
                        <DialogFooter>
                            <Button
                                onClick={() => handleDeleteReview(deletingReview?.reviewId)}>Delete
                                review</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default AdminPanelReviewsSection;