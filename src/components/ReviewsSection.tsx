import React, {useState} from 'react';
import ReviewModel from "../models/ReviewModel.tsx";
import {AlertCircle, PizzaIcon, StarIcon} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from './ui/card.tsx';
import {Button} from "./ui/button.tsx";
import {Textarea} from "./ui/textarea.tsx";
import {Label} from './ui/label.tsx';
import UserModel from '../models/UserModel.tsx';
import ReviewCard from "./ReviewCard.tsx";
import axios from "axios";
import StorageAPI from "../apis/StorageAPI.tsx";
import {Alert, AlertDescription, AlertTitle} from "./ui/alert.tsx";
import {AlertDestructive} from "./ui/alert-destructive.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "./ui/pagination.tsx";

interface ReviewsComponentProps {
    reviews: ReviewModel[],
    addReview: (review: ReviewModel) => void,
    loggedInUser: UserModel | undefined;
    pizzaId: number | undefined;
    hasLoggedInUserBoughtThePizza: boolean;
    hasLoggedInUserReviewedThePizza: boolean;
    updateHasLoggedInUserReviewedThePizza: (updateHasLoggedInUserReviewedThePizza: boolean) => void;
    page: number,
    updatePage: (page: number) => void,
    numberOfPages: number;
}

const ReviewsSection: React.FC<ReviewsComponentProps> = ({
                                                             updatePage,
                                                             page,
                                                             numberOfPages,
                                                             updateHasLoggedInUserReviewedThePizza,
                                                             hasLoggedInUserBoughtThePizza,
                                                             hasLoggedInUserReviewedThePizza,
                                                             pizzaId,
                                                             addReview,
                                                             loggedInUser,
                                                             reviews
                                                         }) => {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < numberOfPages) {
            updatePage(newPage);
        }
    }

    const handleSubmitReview = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

            const response = await axios.post(`http://localhost:8080/api/v1/reviews/user-id=${loggedInUser?.userId}/pizza-id=${pizzaId}`, {
                rating,
                comment,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            console.log('RESPONSE: ' + JSON.stringify(response, null, '\t'));

            addReview(response.data.data.reviewDTO);
            setSuccessMessage(response.data.message);

            updateHasLoggedInUserReviewedThePizza(true);

            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (error) {
            console.log(error);

            if (error.response && error.response.status == 400) {
                setValidationErrors(error.response.data.data.validationErrors);
            } else if (error.response) {
                setErrorMessage(error.response.data.message);
            }

            setTimeout(() => {
                setErrorMessage('');
                setValidationErrors([]);
            }, 4000);
        }
    }

    return (
        <>
            {reviews.length > 0 &&
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-16 mt-5 mb-5">
                    <h2 className="text-2xl font-bold mb-6 text-center">Reviews</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review, index) => (
                            <ReviewCard review={review} key={index}/>
                        ))}
                    </div>
                    <Pagination className="mt-5">
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
                </div>
            }

            {reviews.length == 0 &&
                <div className="flex flex-col items-center justify-center bg-background p-8 rounded-lg">
                    <div className="bg-primary rounded-full p-4 mb-4">
                        <PizzaIcon className="w-8 h-8 text-primary-foreground"/>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No reviews yet for this pizza</h3>
                    <p className="text-muted-foreground text-center">You'll be the first one to know when a review
                        comes!</p>
                </div>
            }

            {loggedInUser != undefined && hasLoggedInUserBoughtThePizza && !hasLoggedInUserReviewedThePizza &&
                <Card className="w-full max-w-md mx-auto mt-10 mb-10">
                    <CardHeader>
                        <CardTitle>Review our pizza</CardTitle>
                        <CardDescription>Let us know what you think of our delicious pizza!</CardDescription>
                        {successMessage && (
                            <Alert variant="default">
                                <AlertCircle className="h-4 w-4"/>
                                <AlertTitle>Success</AlertTitle>
                                <AlertDescription>{successMessage}</AlertDescription>
                            </Alert>
                        )}
                        {errorMessage && (
                            <AlertDestructive description={errorMessage} title="Error"/>
                        )}
                        {validationErrors.length > 0 && validationErrors.map((error, index) => (
                            <AlertDestructive
                                key={index}
                                title="Error"
                                description={error}
                            />
                        ))}
                    </CardHeader>
                    <CardContent>
                        <form className="grid gap-4">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="rating" className="text-sm font-medium">
                                    Rating:
                                </Label>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, index) => (
                                        <StarIcon
                                            key={index}
                                            className={
                                                index < rating
                                                    ? 'w-4 h-4 fill-primary'
                                                    : 'w-4 h-4 fill-muted stroke-muted-foreground'
                                            }
                                            onClick={e => setRating(index + 1)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="comment" className="text-sm font-medium">
                                    Comment
                                </Label>
                                <Textarea
                                    id="comment"
                                    placeholder="Share your thoughts on our pizza"
                                    className="min-h-[100px]"
                                    onChange={e => setComment(e.target.value)}/>
                            </div>
                            <Button className="w-full" onClick={handleSubmitReview}>
                                Submit review
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            }
        </>
    );
};

export default ReviewsSection;