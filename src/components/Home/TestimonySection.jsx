import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, Calendar, Clock, MapPin, Users, ArrowRight, Ticket, Heart, Send, Facebook, Instagram, Youtube, Twitter, Mail, Phone } from 'lucide-react';


// ==================== TESTIMONIES SECTION ====================
const testimonies = [
    { id: 1, name: 'Sarah Johnson', role: 'Member since 2018', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', testimony: "GCCC has transformed my family. The love and fellowship have helped us grow closer to God.", rating: 5 },
    { id: 2, name: 'David Okonkwo', role: 'Youth Leader', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', testimony: "I found my identity in Christ through the discipleship program and caring community.", rating: 5 },
    { id: 3, name: 'Grace Adeyemi', role: 'New Convert', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', testimony: "The Bible study groups helped me understand Scripture and the prayer team supported me.", rating: 5 },
];

export const TestimonySection = memo(() => {
    const [currentIndex, setCurrentIndex] = useState(0);
    return (
        <section id="testimonies" className="relative py-20 md:py-32 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div data-aos="fade-up" className="text-center mb-16">
                    <span className="inline-block px-5 py-2 bg-ocean-50 dark:bg-ocean-900/20 text-ocean-700 dark:text-ocean-400 text-sm font-semibold mb-4">Testimonies</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">Lives Transformed</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Hear stories of hope, healing, and transformation</p>
                </div>
                <div className="relative max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div key={currentIndex} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-gray-900 p-8 md:p-12">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="flex-shrink-0">
                                    <img src={testimonies[currentIndex].image} alt={testimonies[currentIndex].name} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="flex gap-1">{[...Array(testimonies[currentIndex].rating)].map((_, i) => <Star key={i} size={20} className="fill-coral-400 text-coral-400" />)}</div>
                                    <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl leading-relaxed italic">"{testimonies[currentIndex].testimony}"</p>
                                    <div><h4 className="text-gray-900 dark:text-white text-xl font-bold">{testimonies[currentIndex].name}</h4><p className="text-coral-600 dark:text-coral-400 text-sm">{testimonies[currentIndex].role}</p></div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
                        <button onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonies.length) % testimonies.length)} className="pointer-events-auto -ml-6 p-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><ChevronLeft size={24} /></button>
                        <button onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonies.length)} className="pointer-events-auto -mr-6 p-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><ChevronRight size={24} /></button>
                    </div>
                    <div className="flex justify-center gap-2 mt-8">{testimonies.map((_, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={`h-2 transition-all ${index === currentIndex ? 'w-8 bg-coral-600' : 'w-2 bg-gray-300'}`} />)}</div>
                </div>
            </div>
        </section>
    );
});
TestimonySection.displayName = 'TestimonySection';