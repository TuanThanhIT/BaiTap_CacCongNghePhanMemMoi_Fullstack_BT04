import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterPage from "./pages/register";
import UsersPage from "./pages/users";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import ProductsPage from "./pages/products";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
    ],
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />,
  </React.StrictMode>
);
