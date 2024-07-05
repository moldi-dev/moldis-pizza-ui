import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import PizzasPage from "./pages/PizzasPage.tsx";
import OrdersPage from "./pages/OrdersPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import React from "react";

function App() {

  return (
      <>
          <BrowserRouter>
              <Routes>
                  <Route path="/sign-in" element={<SignInPage />} />
                  <Route path="/sign-up" element={<SignUpPage />} />
                  <Route path="/pizzas" element={<PizzasPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/" element={<Navigate to="/pizzas" />} />
                  <Route path="*" element={<NotFoundPage />} />
              </Routes>
          </BrowserRouter>
      </>
  )
}

export default App
