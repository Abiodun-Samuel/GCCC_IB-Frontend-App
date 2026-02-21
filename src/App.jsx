import AppRoutes from "@/router";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AOS from 'aos';
import { useEffect } from "react";


const router = createBrowserRouter(AppRoutes);

export default function App() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 900,
      easing: 'ease-out-quart',
      offset: 80,
    });
  }, []);

  return <RouterProvider router={router} />
}