import {Button} from "./ui/button.tsx";
import React, {useEffect, useState} from "react";
import PizzaModel from "../models/PizzaModel.tsx";
import ImageAPI from "../apis/ImageAPI.tsx";
import {Link} from "react-router-dom";

interface PizzaSectionCardProps {
    pizza: PizzaModel;
}

const PizzaSectionCard: React.FC<PizzaSectionCardProps> = ({ pizza }) => {
    const [pizzaImage, setPizzaImage] = useState('');

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
            <img
                src={`data:img/jpeg;base64,${pizzaImage}`}
                alt="delicious pizza"
                width={400}
                height={200}
                className="aspect-[3/2] w-full rounded-md object-cover"
            />
            <div className="grid gap-2">
                <h3 className="text-lg font-semibold">{pizza.name}</h3>
                <p className="text-muted-foreground">{pizza.ingredients}</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${pizza.price.toFixed(2)}</span>
                    <Link to={`/pizza?id=${pizza.pizzaId}`}>
                        <Button size="sm">View pizza</Button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default PizzaSectionCard;