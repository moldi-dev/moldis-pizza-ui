import {BrowserRouter, Navigate, Route, Routes, useLocation} from "react-router-dom";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import PizzasPage from "./pages/PizzasPage.tsx";
import OrdersPage from "./pages/OrdersPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import React, {useEffect} from "react";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import PizzaPage from "./pages/PizzaPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.tsx";
import PaymentCancelPage from "./pages/PaymentCancelPage.tsx";
import AdminPanelPage from "./pages/AdminPanelPage.tsx";
import 'react-toastify/dist/ReactToastify.css';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

function App() {

  return (
      <>
          <BrowserRouter>
              <ScrollToTop />
              <Routes>
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/sign-in" element={<SignInPage />} />
                  <Route path="/sign-up" element={<SignUpPage />} />
                  <Route path="/pizzas" element={<PizzasPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/" element={<Navigate to="/pizzas" />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/pizza/:id" element={<PizzaPage /> } />
                  <Route path="/payment-success" element={<PaymentSuccessPage />} />
                  <Route path="/payment-cancel" element={<PaymentCancelPage />} />
                  <Route path="/admin-panel/:panel" element={<AdminPanelPage />} />
                  <Route path="*" element={<NotFoundPage />} />
              </Routes>
          </BrowserRouter>
      </>
  )
}

export default App
