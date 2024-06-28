import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import PizzaAPI from '../api/PizzaAPI.tsx';
import PizzaModel from "../models/PizzaModel.tsx";
import PizzaCard from "../components/PizzaCard.tsx";

const PizzasPage = () => {
    const [pizzas, setPizzas] = useState<PizzaModel[]>([]);

    useEffect(() => {
        async function fetchPizzas() {
            try {
                const fetchedData = await PizzaAPI.findAll(0, 10);

                setPizzas(fetchedData.data.pizzasDTOs.content);
            }

            catch (error) {
                console.log(error);
            }
        }

        fetchPizzas();
    }, []);

    return (
        <div>
            <Navbar />
            {pizzas.length == 0 ? (
                <h1>No pizzas found.</h1>
            ) : (
                <div className="row text-center" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                    {pizzas.map((pizza) => (
                        <div key={pizza.pizzaId} className="col-md-4 mb-3">
                            <PizzaCard pizza={pizza}/>
                        </div>
                    ))}
                </div>
            )}
            <Footer/>
        </div>
    );
};

export default PizzasPage;
