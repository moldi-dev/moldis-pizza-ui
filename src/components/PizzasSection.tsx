import React from 'react';
import PizzaModel from "../models/PizzaModel.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "./ui/pagination.tsx";
import PizzaSectionCard from "./PizzaSectionCard.tsx";
import UserModel from "../models/UserModel.tsx";
import BasketModel from "../models/BasketModel.tsx";

interface PizzasSectionProps {
    pizzas: PizzaModel[] | undefined;
    loggedInUser: UserModel | undefined;
    loggedInUserBasket: BasketModel | undefined;
    page: number;
    updatePage: (setPage: number) => void;
    numberOfPages: number;
    updateBasket: (newBasket: BasketModel) => void;
}

const PizzasSection: React.FC<PizzasSectionProps> = ({pizzas, page, numberOfPages, updatePage, loggedInUser, loggedInUserBasket, updateBasket}) => {
    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < numberOfPages) {
            updatePage(newPage);
        }
    };

    return (
        <section className="w-full py-12 md:py-16 lg:py-20">
            <div className="container grid gap-8 px-4 md:px-6">
                <div className="grid gap-2 text-center">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Our Pizzas</h2>
                    <p className="text-muted-foreground md:text-lg">Choose from our wide selection of freshly made
                        pizzas.</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {pizzas && pizzas.map((pizza, index) => (
                        <div key={index} className="grid gap-4 rounded-lg border bg-card p-4 shadow-sm">
                            <PizzaSectionCard pizza={pizza} loggedInUser={loggedInUser} loggedInUserBasket={loggedInUserBasket} updateBasket={updateBasket}/>
                        </div>
                    ))}
                </div>
                <Pagination>
                    <PaginationContent>
                        {page > 0 && (
                            <PaginationItem>
                                <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
                            </PaginationItem>
                        )}
                        {[...Array(numberOfPages)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink onClick={() => handlePageChange(index)} isActive={page == index} >{index}</PaginationLink>
                            </PaginationItem>
                        ))}
                        {page < numberOfPages - 1 && (
                            <PaginationItem>
                                <PaginationNext onClick={() => handlePageChange(page + 1)} />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            </div>
        </section>
    );
};

export default PizzasSection;