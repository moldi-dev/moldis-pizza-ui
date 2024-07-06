import React, {useEffect, useState} from 'react';
import ReviewModel from "../models/ReviewModel.tsx";
import {Card, CardContent} from "./ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar.tsx";
import {StarIcon} from "lucide-react";
import axios from "axios";

interface ReviewCardProps {
    review: ReviewModel
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const [userImage, setUserImage] = useState<string | undefined>(undefined);

    useEffect(() => {
        async function fetchReviewUserImage() {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/images/id=${review.userDTO.image.imageId}`);
                setUserImage(response.data.data.base64EncodedImage);
            }

            catch (error) {
                console.log(error);
            }
        }

        fetchReviewUserImage();
    }, []);

    return (
        <>
            <Card>
                <CardContent className="space-y-4 mt-5">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={`data:image/jpg;base64,${userImage}`} />
                            <AvatarFallback>{review.userDTO.username.charAt(0).concat(review.userDTO.firstName.charAt(0)).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold">{review.userDTO.lastName.concat(' ').concat(review.userDTO.firstName)}</div>
                            <div className="flex items-center gap-1 text-xs font-semibold">
                                {[...Array(5)].map((_, index) => (
                                    <StarIcon
                                        key={index}
                                        className={
                                            index < review.rating
                                                ? 'w-4 h-4 fill-primary'
                                                : 'w-4 h-4 fill-muted stroke-muted-foreground'
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className="text-muted-foreground">
                        {review.comment ? review.comment : ''}
                    </p>
                </CardContent>
            </Card>
        </>
    );
};

export default ReviewCard;