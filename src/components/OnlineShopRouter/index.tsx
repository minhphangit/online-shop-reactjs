import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./MainLayout";
import Error from "./Pages/Error";
import Categories from "./Pages/Categories";
import Products from "./Pages/Products";
import Customers from "./Pages/Customers";
import Suppliers from "./Pages/Suppliers";
import Employees from "./Pages/Employees";
import Orders from "./Pages/Orders";
import LoginWithAxios from "./Pages/LoginWithAxios";

// Lazy loading
// const About = React.lazy(() => import('./pages/About'));
// const Settings = React.lazy(() => import('./pages/Settings'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        index: true,
        element: <Categories />,
      },
      {
        path: "/online-shop/data-management/categories",
        element: <Categories />,
      },
      {
        path: "/online-shop/data-management/employees",
        element: <Employees />,
      },
      {
        path: "/online-shop/data-management/products",
        element: <Products />,
      },
      {
        path: "/online-shop/data-management/customers",
        element: <Customers />,
      },
      {
        path: "/online-shop/data-management/suppliers",
        element: <Suppliers />,
      },
      {
        path: "/online-shop/data-management/orders",
        element: <Orders />,
      },
      {
        path: "/online-shop/data-management/login",
        element: <LoginWithAxios />,
      },
    ],
  },
  //NO MATCH ROUTE
  {
    path: "*",
    element: <Error />,
  },
]);
type Props = {};
export default function OnlineShop({}: Props) {
  return (
    <div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </React.Suspense>
    </div>
  );
}
