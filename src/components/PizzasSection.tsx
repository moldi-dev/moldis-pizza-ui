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
import {PizzaIcon} from "lucide-react";

interface PizzasSectionProps {
    pizzas: PizzaModel[] | undefined;
    page: number;
    updatePage: (setPage: number) => void;
    numberOfPages: number;
}

const PizzasSection: React.FC<PizzasSectionProps> = ({pizzas, page, numberOfPages, updatePage}) => {
    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < numberOfPages) {
            updatePage(newPage);
        }
    };

    return (
        pizzas && pizzas.length > 0 ? (
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
                            <PizzaSectionCard pizza={pizza}/>
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
                        <PaginationItem>
                            <PaginationLink isActive={true}>{page + 1}</PaginationLink>
                        </PaginationItem>
                        {page < numberOfPages - 1 && (
                            <PaginationItem>
                                <PaginationNext onClick={() => handlePageChange(page + 1)} />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            </div>
        </section>
            ) : (
            <section className="flex flex-col items-center justify-center gap-6 py-16 md:py-24">
                <div className="flex max-w-md flex-col items-center justify-center gap-4 text-center">
                    <PizzaIcon className="h-20 w-20 text-red-500"/>
                    <h1 className="text-2xl font-bold">No Pizzas available yet</h1>
                    <h2 className="text-muted-foreground">
                        It looks like we don't have any pizzas available at the moment.
                        Please check back later to see our wide selection of delicious pizzas.
                        Whether you're craving a classic Margherita or something more adventurous,
                        we'll have something to satisfy your taste buds soon.
                    </h2>
                </div>
            </section>
        )
    );
};

export default PizzasSection;