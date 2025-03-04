import UserModel from "../models/UserModel.tsx";
import {Link, useLocation, useNavigate} from "react-router-dom";
import BasketModel from "../models/BasketModel.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./ui/dropdown-menu.tsx";
import {Button} from "./ui/button.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar.tsx";
import {CircleAlertIcon, CreditCard, LogOut, PizzaIcon, ShoppingCart, Trash2, User, UserRound} from "lucide-react";
import {Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger} from "./ui/sheet.tsx";
import PizzaInBasketCard from "./PizzaInBasketCard.tsx";
import PizzaModel from "../models/PizzaModel.tsx";
import {Separator} from "./ui/separator.tsx";
import BasketAPI from "../apis/BasketAPI.tsx";
import React, {useEffect, useState} from "react";
import StorageAPI from "../apis/StorageAPI.tsx";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "./ui/dialog.tsx";
import axios from "axios";
import UserAPI from "../apis/UserAPI.tsx";

interface NavbarProps {
    loggedInUser: UserModel | undefined;
    loggedInUserProfilePicture: string | undefined;
    loggedInUserBasket: BasketModel | undefined;
}

const Navbar: React.FC<NavbarProps> = ({loggedInUser, loggedInUserProfilePicture, loggedInUserBasket}) => {
    const navigate = useNavigate();

    const [basket, setBasket] = useState<BasketModel | undefined>(loggedInUserBasket);
    const [error, setError] = useState(false);

    const [isAdmin, setIsAdmin] = useState(false);

    const location = useLocation();
    const isOnCheckoutPage: boolean = location.pathname === '/checkout';

    useEffect(() => {
        if (loggedInUserBasket) {
            setBasket(loggedInUserBasket);
        }
    }, [loggedInUserBasket]);

    useEffect(() => {
        async function testIfAdmin() {
            try {
                const userResponse = await UserAPI.findLoggedInUser();

                const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

                const response2 = await axios.get(`http://localhost:8080/api/v1/users/admin/id=${userResponse.userId}`, {
                    headers: {Authorization: `Bearer ${accessToken}`}
                });

                setIsAdmin(response2.data.data.answer);
            } catch (error) {
                setIsAdmin(false);
            }
        }

        testIfAdmin();
    }, []);

    const handleGoToAdminPanel = () => {
        navigate("/admin-panel/users");
    }

    const handleRemovePizzaFromBasket = async (pizzaId: number) => {
        const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

        if (loggedInUser != undefined && accessToken != null) {
            try {
                const response = await BasketAPI.removePizzaFromUserBasket(loggedInUser.userId, pizzaId, accessToken);
                setBasket(response.data.basketDTO);
            } catch (error) {
                console.log(error);
                setError(true);
            }
        }
    }

    const handleSignOut = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        if (localStorage.getItem("rememberMeToken") != null) {
            localStorage.removeItem("rememberMeToken");
        }

        navigate("/sign-in");
    }

    return (
        <>
            {error &&
                <>
                    <Dialog defaultOpen={true}>
                        <DialogTitle/>
                        <DialogTrigger asChild>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
                            <div className="flex flex-col items-center justify-center gap-4 py-8">
                                <CircleAlertIcon className="size-12 text-red-500"/>
                                <div className="grid gap-2 text-center">
                                    <h3 className="text-2xl font-bold">Error</h3>
                                    <p className="text-muted-foreground">An unexpected error has occurred, please try
                                        again later.</p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
            }

            <nav className="flex justify-between items-center py-3 px-2 bg-primary">

                {/* Logo */}
                <div className="flex justify-between">
                    <Link to="/pizzas">
                        <PizzaIcon className="h-12 w-12 text-white"/>
                        <span className="text-white">Moldi's Pizza</span>
                    </Link>
                </div>

                {/* Right aligned container */}
                <div className="flex items-center space-x-4">

                    {/* User avatar with dropdown */}
                    {loggedInUser != undefined &&
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full mx-6">
                                    <Avatar className="h-12 w-12 border-2 border-white">
                                        <AvatarImage src={`data:image/jpeg;base64,${loggedInUserProfilePicture}`}
                                                     alt="user avatar"/>
                                        <AvatarFallback>{loggedInUser.lastName.charAt(0).concat(loggedInUser.firstName.charAt(0)).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{loggedInUser.lastName.concat(' ').concat(loggedInUser.firstName)}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{loggedInUser.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuGroup>
                                    <Link to="/profile">
                                        <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4"/>
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link to="/orders">
                                        <DropdownMenuItem>
                                            <CreditCard className="mr-2 h-4 w-4"/>
                                            <span>Orders</span>
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator/>
                                {isAdmin &&
                                    <DropdownMenuItem onClick={handleGoToAdminPanel}>
                                        <UserRound className="mr-2 h-4 w-4"/>
                                        <span>Admin Panel</span>
                                    </DropdownMenuItem>
                                }
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4"/>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    }

                    {/* User shopping cart with sheet */}
                    {loggedInUser != undefined && !isOnCheckoutPage &&
                        <div className="flex items-center space-x-4 text-white px-3">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button className="border-2 border-white">
                                        <ShoppingCart className="h-8 w-8"/>
                                        <span className="px-3">Your basket</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="overflow-y-scroll" aria-describedby={undefined}>
                                    <SheetHeader>
                                        <SheetTitle className="pb-5">Your basket</SheetTitle>
                                    </SheetHeader>
                                    {basket && basket.pizzas.length > 0 ?
                                        <>
                                            <div className="row flex flex-col">
                                                {basket.pizzas.map((pizza: PizzaModel, index) => (
                                                    <React.Fragment key={index}>
                                                        <div className="col-12">
                                                            <PizzaInBasketCard pizza={pizza}/>
                                                        </div>
                                                        <div className="col-12 text-right">
                                                            <Button className="pt-2 text-right"
                                                                    onClick={() => handleRemovePizzaFromBasket(pizza.pizzaId)}>
                                                                <Trash2/>
                                                            </Button>
                                                        </div>
                                                        <div className="col-12 mt-4 mb-4">
                                                            <Separator className="mt-4 mb-4"/>
                                                        </div>
                                                    </React.Fragment>
                                                ))}
                                                <p>Total price to pay: ${basket.totalPrice.toFixed(2)}</p>
                                            </div>

                                            <SheetFooter className="flex flex-col mt-2">
                                                <SheetClose asChild>
                                                    <Link to="/checkout">
                                                        <Button>Go to checkout</Button>
                                                    </Link>
                                                </SheetClose>
                                            </SheetFooter>
                                        </>

                                        :

                                        <>
                                            <h1 className="flex mt-2">Your basket is empty. Consider adding some pizzas
                                                in it :)</h1>
                                        </>
                                    }
                                </SheetContent>
                            </Sheet>
                        </div>
                    }

                    {/* User redirect to sign-in page for a user which is not logged in */}
                    {loggedInUser == undefined &&
                        <Link to="/sign-in" className="flex items-center text-white">
                            <Button variant="ghost"
                                    className="relative h-15 mx-6 border-2 border-white hover:bg-primary hover:text-white">
                                <User/>
                                <span className="px-2">My account</span>
                            </Button>
                        </Link>
                    }

                </div>
            </nav>
        </>

    );
};

export default Navbar;
