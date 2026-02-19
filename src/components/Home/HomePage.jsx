import AboutSection from '@/components/Home/AboutSection';
import HeroSection from '@/components/Home/HeroSection';

const HomePage = () => {

    return (
        <main className="w-full">
            <HeroSection />
            <main className='container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden'>
                <AboutSection />
            </main>
        </main>
    );
};

export default HomePage;