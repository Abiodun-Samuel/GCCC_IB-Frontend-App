import Footer from '@/layout/home/Footer';
import Header from '@/layout/home/Header';
import ProgressBar from '@/components/others/ProgressBar';
import { ScrollToTop } from '@/components/others/ScrollToTop';
import { Outlet } from 'react-router-dom';
import { useMe } from '@/queries/auth.query';

const HomeLayout = () => {
    useMe()

    return (
        <>
            <ProgressBar />
            <ScrollToTop />
            <Header />
            <div className="relative min-h-screen w-full mx-auto overflow-hidden bg-white dark:bg-gray-950">
                <Outlet />
            </div>
            <Footer />
        </>
    )
};

export default HomeLayout;
