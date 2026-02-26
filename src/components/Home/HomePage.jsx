//homepage.jsx
import AboutSection from '@/components/Home/AboutSection';
import Gallery from '@/components/Home/Gallery';
import GallerySection from '@/components/Home/GallerySection';
import HeroSection from '@/components/Home/HeroSection';
import MediaHub from '@/components/Home/MediaHub';
import QuickActionsSection from '@/components/Home/QuickActionsSection';
import SanctuaryHub from '@/components/Home/SanctuaryHub';
import { useAuthStore } from '@/store/auth.store';

const HomePage = () => {
    const { isAuthenticated, user } = useAuthStore();

    return (
        <>
            <main className="w-full">
                <HeroSection />
                <AboutSection />
                <Gallery />
                <SanctuaryHub />
                <GallerySection />
                <MediaHub isAuthenticated={isAuthenticated} user={user} />
                <QuickActionsSection />
            </main>
        </>
    );
};

export default HomePage;