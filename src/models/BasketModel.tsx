import UserModel from "./UserModel.tsx";
import PizzaModel from "./PizzaModel.tsx";

interface BasketModel {
    basketId: number,
    user: UserModel,
    totalPrice: number,
    pizzas: PizzaModel[]
}

export default BasketModel;