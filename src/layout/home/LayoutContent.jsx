import Navbar from "@/components/header/Navbar";
import AnimatedBackground from "@/layout/home/background/AnimatedBackground";
import { Outlet } from "react-router-dom";

const LayoutContent = () => {
    return (
        <>
            <Outlet />
            {/* <div className="relative min-h-screen bg-[#24244e] dark:bg-gray-950 overflow-hidden">

                <AnimatedBackground />

                <div className="relative">
                    <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/40 to-transparent dark:via-blue-400/50"></div>

                    <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-blue-500/5 to-transparent dark:from-blue-400/10 rounded-br-full"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-purple-500/5 to-transparent dark:from-purple-400/10 rounded-bl-full"></div>

                    <Navbar title="Home" />
                    <div className="relative container mx-auto overflow-y-hidden">
                        <Outlet />
                    </div>
                </div>
            </div> */}
        </>
    );
};

export default LayoutContent;
