import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import PizzasPage from "./pages/PizzasPage.tsx";

function App() {

  return (
      <>
      <BrowserRouter>
          <Routes>
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/pizzas" element={<PizzasPage />} />
          </Routes>
      </BrowserRouter>
      </>
  )
}

export default App
