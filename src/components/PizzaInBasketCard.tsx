import PizzaModel from "../models/PizzaModel.tsx";
import React, {useEffect, useState} from "react";
import ImageAPI from "../apis/ImageAPI.tsx";

interface PizzaCardProps {
    pizza: PizzaModel;
}

const PizzaInBasketCard: React.FC<PizzaCardProps> = ({pizza}) => {
    const [pizzaImage, setPizzaImage] = useState<string>();

    useEffect(() => {
        async function fetchPizzaImage() {
            const response = await ImageAPI.findAllByPizzaId(pizza.pizzaId);

            const imageId = response.data.imagesDTOs[0].imageId;

            const firstImage = await ImageAPI.findById(imageId);

            setPizzaImage(firstImage.data.base64EncodedImage);
        }

        fetchPizzaImage();
    }, []);

    return (
        <>
            {pizzaImage != undefined &&
                <img src={`data:image/jpeg;base64,${pizzaImage}`} width="200px" height="200px" alt="pizza image"
                     className="object-cover"/>
            }
            <p className="pt-2">{pizza.name}</p>
            <p className="pt-2">{pizza.ingredients}</p>
            <p className="pt-2">${pizza.price.toFixed(2)}</p>
        </>
    );
};

export default PizzaInBasketCard;
