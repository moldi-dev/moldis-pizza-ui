import UserModel from "./UserModel.tsx";
import PizzaModel from "./PizzaModel.tsx";

interface ReviewModel {
    reviewId: number,
    user: UserModel,
    rating: number,
    comment: string,
    pizza: PizzaModel,
}

export default ReviewModel;