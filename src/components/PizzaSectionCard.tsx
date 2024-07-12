import {Button} from "./ui/button.tsx";
import React, {useEffect, useState} from "react";
import PizzaModel from "../models/PizzaModel.tsx";
import {Link} from "react-router-dom";
import axios from "axios";
import {Carousel, CarouselContent, CarouselItem} from "./ui/carousel.tsx";

interface PizzaSectionCardProps {
    pizza: PizzaModel;
}

const PizzaSectionCard: React.FC<PizzaSectionCardProps> = ({ pizza }) => {
    const [pizzaImages, setPizzaImages] = useState<string[]>([]);

    useEffect(() => {
        async function fetchPizzaImages() {
            const fetchedImages= new Array(pizza.images.length).fill('');

            for (let index = 0; index < pizza.images.length; index++) {
                const imageId = pizza.images[index].imageId;

                const imageDataResponse = await axios.get(`http://localhost:8080/api/v1/images/id=${imageId}`);

                fetchedImages[index] = (imageDataResponse.data.data.base64EncodedImage);
            }

            setPizzaImages(fetchedImages);
        }

        fetchPizzaImages();
    }, []);

    return (
        <>
            <Carousel opts={{align: "start", loop: true}} className="rounded-t-lg">
                <CarouselContent>
                    {pizza.images.map((image, index) => (
                        <CarouselItem key={index}>
                            <img
                                src={`data:image/jpeg;base64,${pizzaImages[index]}`}
                                alt="delicious pizza"
                                width={300}
                                height={200}
                                className="object-cover w-full h-full"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="grid gap-2">
                <h3 className="text-lg font-semibold">{pizza.name}</h3>
                <p className="text-muted-foreground">{pizza.ingredients}</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${pizza.price.toFixed(2)}</span>
                    <Link to={`/pizza/${pizza.pizzaId}`}>
                        <Button size="sm">View pizza</Button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default PizzaSectionCard;