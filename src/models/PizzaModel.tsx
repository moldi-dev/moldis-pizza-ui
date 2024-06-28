import ImageModel from './ImageModel';

interface PizzaModel {
    pizzaId: number;
    name: string,
    images: ImageModel[],
    ingredients: string,
    price: number
}

export default PizzaModel;