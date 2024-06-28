import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCartShopping, faKey, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import UserAPI from "../api/UserAPI.tsx";
import UserModel from "../models/UserModel.tsx";
import BasketAPI from "../api/BasketAPI.tsx";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [loggedInUser, setLoggedInUser] = useState<UserModel | undefined>(undefined);

    useEffect(() => {
        async function fetchLoggedInUserData() {
            const user = await UserAPI.findLoggedInUser();
            const basket = await BasketAPI.findLoggedInUserBasket();

            setLoggedInUser(user);
        }

        fetchLoggedInUserData();
    }, []);

    const handleSignOut = () => {
        setLoggedInUser(undefined);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        if (localStorage.getItem("rememberMeToken") != null) {
            localStorage.removeItem("rememberMeToken");
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    <img src="src/assets/logo.png" width="60" height="60" alt="logo" />
                    <span style={{ fontFamily: 'Cursive', paddingLeft: "0.5em" }}>Moldi's Pizza</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link to="/menu" className="nav-link">
                                <FontAwesomeIcon icon={faBook} style={{ paddingLeft: "0.5em", paddingRight: "0.5em" }} />
                                Menu
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link to="#" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <FontAwesomeIcon icon={faUser} style={{ paddingLeft: "0.5em", paddingRight: "0.5em", color: "#ffffff" }} />
                                Account
                            </Link>
                            <ul className="dropdown-menu">
                                {loggedInUser ?
                                    <>
                                        <li>
                                            <Link to="/profile" className="dropdown-item" style={{ color: "red" }}>
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <a onClick={handleSignOut} className="dropdown-item" style={{ cursor: "pointer", color: "red" }}>
                                                <FontAwesomeIcon icon={faLock} style={{ paddingRight: "0.5em" }} />
                                                Sign out
                                            </a>
                                        </li>
                                    </>
                                    :
                                    <li>
                                        <Link to="/sign-in" className="dropdown-item" style={{ color: "red" }}>
                                            <FontAwesomeIcon icon={faKey} style={{ paddingLeft: "0.5em", paddingRight: "0.5em" }} />
                                            Sign in
                                        </Link>
                                    </li>
                                }
                            </ul>
                        </li>
                        {loggedInUser &&
                            <li className="nav-item">
                                <Link to="/shopping-cart" className="nav-link">
                                    <FontAwesomeIcon icon={faCartShopping} style={{ paddingLeft: "0.5em", paddingRight: "0.5em", color: "#ffffff" }} />
                                    Shopping Cart
                                </Link>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
