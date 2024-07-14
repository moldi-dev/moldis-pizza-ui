import React, {useEffect, useState} from 'react';
import PizzaModel from "../models/PizzaModel.tsx";
import ImageAPI from "../apis/ImageAPI.tsx";

interface PizzaCheckoutDetailProps {
    pizza: PizzaModel
}

const PizzaCheckoutDetail: React.FC<PizzaCheckoutDetailProps> = ({pizza}) => {
    const [pizzaImage, setPizzaImage] = useState('');

    useEffect(() => {
        async function fetchPizzaImage() {
            try {
                const response = await ImageAPI.findAllByPizzaId(pizza.pizzaId);

                const imageId = response.data.imagesDTOs[0].imageId;

                const firstImage = await ImageAPI.findById(imageId);

                setPizzaImage(firstImage.data.base64EncodedImage);
            } catch (error) {
                console.log(error);
            }
        }

        fetchPizzaImage();
    }, []);

    return (
        <>
            <img
                src={`data:image/jpeg;base64,${pizzaImage}`}
                alt="delicious pizza"
                width="800"
                height="600"
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{pizza.name}</h3>
                <p className="text-muted-foreground text-sm mb-2">{pizza.ingredients}</p>
                <p className="font-bold">${pizza.price.toFixed(2)}</p>
            </div>
        </>
    );
};

export default PizzaCheckoutDetail;