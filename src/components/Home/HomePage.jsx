import AboutSection from '@/components/Home/AboutSection';
import GallerySection from '@/components/Home/GallerySection';
import HeroSection from '@/components/Home/HeroSection';
import MediaHub from '@/components/Home/MediaHub';
import QuickActionsSection from '@/components/Home/QuickActionsSection';
import SanctuaryHub from '@/components/Home/SanctuaryHub';

const HomePage = () => {
    return (
        <main className="w-full">
            <HeroSection />
            <AboutSection />
            <SanctuaryHub />
            <QuickActionsSection />
            <MediaHub />
            <GallerySection />
        </main>
    );
};

export default HomePage;