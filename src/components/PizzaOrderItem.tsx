import React, {useEffect, useState} from 'react';
import PizzaModel from "../models/PizzaModel.tsx";
import ImageAPI from "../apis/ImageAPI.tsx";

interface PizzaOrderItemProps {
    pizza: PizzaModel;
}

const PizzaOrderItem: React.FC<PizzaOrderItemProps> = ({ pizza }) => {
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
            <img src={`data:image/jpeg;base64,${pizzaImage}`} alt="delicious pizza" width={200} height={200}
                 className="rounded-md"/>
            <div>
                <h3 className="font-semibold">{pizza.name}</h3>
                <p className="text-muted-foreground">{pizza.ingredients}</p>
                <p className="font-semibold">${pizza.price.toFixed(2)}</p>
            </div>
        </>
    );
}

export default PizzaOrderItem;