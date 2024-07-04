import UserModel from "./UserModel.tsx";
import PizzaModel from "./PizzaModel.tsx";

interface OrderModel {
    orderId: number,
    user: UserModel,
    pizzas: PizzaModel[],
    totalPrice: number,
    createdDate: Date,
    status: string
}

export default OrderModel;