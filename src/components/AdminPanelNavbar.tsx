import React from 'react';
import {Link} from "react-router-dom";
import {PizzaIcon, ShoppingCartIcon, Star, UsersIcon} from "lucide-react";

interface AdminPanelNavbarProps {
    panel: string | undefined;
}

const AdminPanelNavbar: React.FC<AdminPanelNavbarProps> = ({ panel }) => {
    return (
        <>
            <div className="flex flex-col border-b md:border-r bg-primary">
                <div className="flex h-[60px] items-center px-6">
                    <Link to="/pizzas" className="flex text-white items-center gap-2 font-semibold">
                        <PizzaIcon className="h-6 w-6"/>
                        <span>Moldi's Pizza</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <Link
                            to="/admin-panel/users"
                            className={panel === "users" ? "flex text-white items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground" : "flex text-black items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground"}
                        >
                            <UsersIcon className="h-4 w-4"/>
                            Users
                        </Link>
                        <Link
                            to="/admin-panel/pizzas"
                            className={panel === "pizzas" ? "flex text-white items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground" : "flex text-black items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground"}
                        >
                            <PizzaIcon className="h-4 w-4"/>
                            Pizzas
                        </Link>
                        <Link
                            to="/admin-panel/orders"
                            className={panel === "orders" ? "flex text-white items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground" : "flex text-black items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground"}
                        >
                            <ShoppingCartIcon className="h-4 w-4"/>
                            Orders
                        </Link>
                        <Link
                            to="/admin-panel/reviews"
                            className={panel === "reviews" ? "flex text-white items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground" : "flex text-black items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground"}
                        >
                            <Star className="h-4 w-4"/>
                            Reviews
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default AdminPanelNavbar;