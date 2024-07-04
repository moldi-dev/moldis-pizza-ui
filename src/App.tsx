import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import PizzasPage from "./pages/PizzasPage.tsx";
import OrdersPage from "./pages/OrdersPage.tsx";

function App() {

  return (
      <>
      <BrowserRouter>
          <Routes>
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/pizzas" element={<PizzasPage />} />
              <Route path="/orders" element={<OrdersPage />} />
          </Routes>
      </BrowserRouter>
      </>
  )
}

export default App
