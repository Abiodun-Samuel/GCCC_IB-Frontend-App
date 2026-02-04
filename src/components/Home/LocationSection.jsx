import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Mail, Clock, ExternalLink, Calendar } from 'lucide-react';

export const LocationSection = memo(() => {
    const [mapLoaded, setMapLoaded] = useState(false);
    const churchAddress = 'Oluwole Akintola Way, Iyana Bodija Ibadan, Nigeria';
    const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.7!2d3.8931!3d7.4385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjYnMTguNiJOIDPCsDUzJzM1LjIiRQ!5e0!3m2!1sen!2sng!4v1234567890`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(churchAddress)}`;

    const contactInfo = [
        { icon: Phone, label: 'Phone', value: '08063176234', link: 'tel:08063176234' },
        { icon: Mail, label: 'Email', value: 'admin@gcccibadan.org', link: 'mailto:admin@gcccibadan.org' },
        { icon: Clock, label: 'Service Times', value: 'Sunday 9:00 AM', link: null },
    ];

    const schedule = [
        { day: 'Sunday Service', time: '9:00 AM - 11:30 AM' },
        { day: 'Midweek Service', time: 'Wednesday 6:00 PM' },
        { day: 'Youth Service', time: 'Friday 5:00 PM' },
        { day: 'Prayer Meeting', time: 'Tuesday 6:00 AM' },
    ];

    return (
        <section id="contact" className="relative py-20 md:py-32 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div data-aos="fade-up" className="text-center mb-16">
                    <span className="inline-block px-5 py-2 bg-ocean-50 dark:bg-ocean-900/20 text-ocean-700 dark:text-ocean-400 text-sm font-semibold mb-4">
                        Visit Us
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">Find Your Way Home</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">We're located in the heart of Ibadan. Come experience God's presence with us</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    <motion.div data-aos="fade-right" className="relative">
                        <div className="relative bg-white dark:bg-gray-900 overflow-hidden">
                            <div className="relative h-[400px] lg:h-[500px]">
                                {!mapLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                        <div className="text-center">
                                            <div className="w-16 h-16 border-4 border-gray-300 border-t-coral-600 rounded-full animate-spin mx-auto mb-4" />
                                            <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
                                        </div>
                                    </div>
                                )}
                                <iframe src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" onLoad={() => setMapLoaded(true)} className="absolute inset-0" />
                            </div>
                            <div className="p-6">
                                <button onClick={() => window.open(directionsUrl, '_blank')} className="w-full px-6 py-4 bg-coral-600 hover:bg-coral-700 text-white font-semibold transition-all flex items-center justify-center gap-2">
                                    <Navigation size={20} />Get Directions<ExternalLink size={16} />
                                </button>
                            </div>
                        </div>

                        <motion.div className="mt-6 p-6 bg-white dark:bg-gray-900">
                            <div className="flex items-start gap-4">
                                <div className="p-4 bg-coral-50 dark:bg-coral-900/20">
                                    <MapPin className="text-coral-600 dark:text-coral-400" size={28} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-2">Our Location</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{churchAddress}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div data-aos="fade-left" className="space-y-6">
                        {contactInfo.map((info, index) => (
                            <motion.div key={info.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * index }} whileHover={{ scale: 1.02 }}>
                                {info.link ? (
                                    <a href={info.link} className="block p-6 bg-white dark:bg-gray-900 hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-ocean-50 dark:bg-ocean-900/20">
                                                <info.icon className="text-ocean-600 dark:text-ocean-400" size={28} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{info.label}</p>
                                                <p className="text-gray-900 dark:text-white font-semibold text-lg">{info.value}</p>
                                            </div>
                                            <ExternalLink className="text-gray-400" size={20} />
                                        </div>
                                    </a>
                                ) : (
                                    <div className="p-6 bg-white dark:bg-gray-900">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-ocean-50 dark:bg-ocean-900/20">
                                                <info.icon className="text-ocean-600 dark:text-ocean-400" size={28} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{info.label}</p>
                                                <p className="text-gray-900 dark:text-white font-semibold text-lg">{info.value}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        <motion.div className="p-8 bg-white dark:bg-gray-900">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <Calendar className="text-coral-600 dark:text-coral-400" size={28} />Service Schedule
                            </h3>
                            <div className="space-y-4">
                                {schedule.map((item) => (
                                    <div key={item.day} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">{item.day}</span>
                                        <span className="text-coral-600 dark:text-coral-400 font-bold">{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
});

LocationSection.displayName = 'LocationSection';
export default LocationSection;