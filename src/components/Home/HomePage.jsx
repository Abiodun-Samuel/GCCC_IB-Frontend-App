import AboutSection from '@/components/Home/AboutSection';
import GallerySection from '@/components/Home/GallerySection';
import HeroSection from '@/components/Home/HeroSection';
import SanctuaryHub from '@/components/Home/SanctuaryHub';

const HomePage = () => {
    return (
        <main className="w-full">
            <HeroSection />
            <AboutSection />
            <SanctuaryHub />
            <GallerySection />
        </main>
    );
};

export default HomePage;