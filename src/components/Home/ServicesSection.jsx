import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, MapPin, Users, Video, Play, Calendar, Baby, Music, Smile,
    GraduationCap, HandHeart, BookOpen, Heart, ArrowRight, ChevronLeft,
    ChevronRight, Quote, Star, Send, Phone, Mail, Navigation, ExternalLink,
    Facebook, Instagram, Youtube, Twitter, Ticket
} from 'lucide-react';

// ==================== SERVICES SECTION ====================
const services = [
    { title: 'Sunday Service', time: '9:00 AM - 11:30 AM', description: 'Join us for powerful worship, inspiring messages, and meaningful fellowship.', image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80', isLive: true, attendees: '500+', features: ['Live Worship', 'Bible Teaching', 'Prayer'] },
    { title: 'Midweek Service', time: 'Wednesday 6:00 PM', description: 'A time of prayer, Bible study, and spiritual refreshing.', image: 'https://images.unsplash.com/photo-1517096851-6a40c02c0835?w=800&q=80', isLive: false, attendees: '200+', features: ['Bible Study', 'Prayer', 'Testimonies'] },
    { title: 'Youth Service', time: 'Friday 5:00 PM', description: 'Dynamic worship and relevant teaching for young people.', image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80', isLive: false, attendees: '150+', features: ['Worship', 'Teaching', 'Fellowship'] },
];

export const ServicesSection = memo(() => (
    <section id="services" className="relative py-20 md:py-32 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-aos="fade-up" className="text-center mb-16">
                <span className="inline-block px-5 py-2 bg-ocean-50 dark:bg-ocean-900/20 text-ocean-700 dark:text-ocean-400 text-sm font-semibold mb-4">Our Services</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">Join Us This Week</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Experience the presence of God through worship, teaching, and fellowship</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <motion.div key={service.title} data-aos="fade-up" data-aos-delay={index * 100} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -8 }} className="group">
                        <div className="h-full bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg transition-all duration-500">
                            <div className="relative h-64 overflow-hidden">
                                <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                                {service.isLive && <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-coral-600"><div className="w-2 h-2 bg-white rounded-full animate-pulse" /><span className="text-white text-xs font-bold">LIVE NOW</span></div>}
                                <div className="absolute top-4 left-4 px-3 py-2 bg-white/90 backdrop-blur-sm"><Users size={14} /><span className="text-xs font-semibold ml-1">{service.attendees}</span></div>
                            </div>
                            <div className="p-6 md:p-8 space-y-4">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                                    <div className="flex items-center gap-2 text-coral-600 dark:text-coral-400 mb-4"><Clock size={18} /><span className="text-sm font-semibold">{service.time}</span></div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{service.description}</p>
                                <div className="space-y-2 pt-4">
                                    {service.features.map((feature) => <div key={feature} className="flex items-center gap-3 text-gray-700 dark:text-gray-300"><div className="w-1.5 h-1.5 bg-coral-600 rounded-full" /><span className="text-sm">{feature}</span></div>)}
                                </div>
                                <button className="w-full mt-4 px-6 py-3 bg-coral-600 hover:bg-coral-700 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2">Join Service<ArrowRight size={18} /></button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
));

ServicesSection.displayName = 'ServicesSection';

export default ServicesSection;