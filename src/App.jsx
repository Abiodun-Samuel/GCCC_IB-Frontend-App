import AppRoutes from "@/router";
import AOS from 'aos';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useEffect } from 'react';
import PWAUpdateHandler from "@/components/common/PWAUpdateHandler";
import PWAInstallBanner from "@/components/common/PWAInstallBanner";

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

  return (
    <>
      <PWAUpdateHandler />
      <PWAInstallBanner />
      <RouterProvider router={router} />
    </>
  )
}