import PizzaModel from "../models/PizzaModel.tsx";
import { useNavigate } from "react-router-dom";
import React, {useEffect, useState} from "react";
import ImageAPI from "../api/ImageAPI.tsx";

interface PizzaCardProps {
    pizza: PizzaModel;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza }) => {
    const [pizzaImage, setPizzaImage] = useState<string>();

    useEffect(() => {
        async function fetchPizzaImage() {
            const response = await ImageAPI.findAllByPizzaId(pizza.pizzaId);

            const imageId = response.data.imagesDTOs[0].imageId;

            const firstImage = await ImageAPI.findById(imageId);

            setPizzaImage(firstImage);
        }

        fetchPizzaImage();
    }, []);

    const navigate = useNavigate();

    const handleView = () => {
        navigate(`/pizzas/id=${pizza.pizzaId}`);
    };

    return (
        <div className="card" style={{ width: '18rem' }}>
            <img className="card-img-top" width="300px" height="200px" src={`data:image/jpeg;base64,${pizzaImage}`} alt={pizza.name}/>
            <div className="card-body">
                <h5 className="card-title">{pizza.name}</h5>
                <p className="card-text">{pizza.ingredients}</p>
                <p className="card-text">${pizza.price}</p>
                <button className="btn btn-outline-danger" onClick={handleView}>
                    View
                </button>
            </div>
        </div>
    );
};

export default PizzaCard;
