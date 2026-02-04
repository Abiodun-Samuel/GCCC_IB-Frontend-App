import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, Calendar, Clock, MapPin, Users, ArrowRight, Ticket, Heart, Send, Facebook, Instagram, Youtube, Twitter, Mail, Phone } from 'lucide-react';

// TESTIMONIES SECTION
const testimonies = [
    { id: 1, name: 'Sarah Johnson', role: 'Member since 2018', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', testimony: "GCCC has been a transformative experience for my family. The love, support, and genuine fellowship we've found here have helped us grow closer to God and each other.", rating: 5 },
    { id: 2, name: 'David Okonkwo', role: 'Youth Ministry Leader', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', testimony: "I came to GCCC as a broken young man searching for purpose. Through the discipleship program and the caring community, I found my identity in Christ.", rating: 5 },
    { id: 3, name: 'Grace Adeyemi', role: 'New Convert', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', testimony: "As a new believer, I was warmly welcomed into the GCCC family. The Bible study groups helped me understand Scripture, and the prayer team supported me.", rating: 5 },
];

export const TestimonySection = memo(() => {
    const [currentIndex, setCurrentIndex] = useState(0);
    return (
        <section id="testimonies" className="relative py-20 md:py-32 bg-gradient-to-br from-primary-900 via-primary-800 to-danger-900 overflow-hidden">
            <div className="absolute inset-0"><div className="absolute top-0 right-0 w-96 h-96 bg-danger-500/20 rounded-full blur-3xl animate-pulse" /><div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} /></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div data-aos="fade-up" className="text-center mb-16">
                    <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-sm font-semibold mb-6 shadow-2xl">
                        <Star size={16} className="text-primary-300" />Testimonies
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Lives Transformed</h2>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto">Hear stories of hope, healing, and transformation from our church family</p>
                </div>
                <div className="relative max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div key={currentIndex} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5 }} className="relative">
                            <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 md:p-12">
                                <div className="absolute top-8 left-8 opacity-20"><Quote size={64} className="text-primary-300" /></div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                                    <div className="flex-shrink-0">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-primary rounded-full blur-lg opacity-50" />
                                            <img src={testimonies[currentIndex].image} alt={testimonies[currentIndex].name} className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/20" />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-6">
                                        <div className="flex gap-1">{[...Array(testimonies[currentIndex].rating)].map((_, i) => <Star key={i} size={20} className="fill-primary-400 text-primary-400" />)}</div>
                                        <p className="text-white/90 text-lg md:text-xl leading-relaxed italic">"{testimonies[currentIndex].testimony}"</p>
                                        <div><h4 className="text-white text-xl font-bold">{testimonies[currentIndex].name}</h4><p className="text-primary-300 text-sm">{testimonies[currentIndex].role}</p></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
                        <button onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonies.length) % testimonies.length)} className="pointer-events-auto -ml-6 p-3 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-full text-white hover:bg-white/20 transition-all hover:scale-110"><ChevronLeft size={24} /></button>
                        <button onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonies.length)} className="pointer-events-auto -mr-6 p-3 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-full text-white hover:bg-white/20 transition-all hover:scale-110"><ChevronRight size={24} /></button>
                    </div>
                    <div className="flex justify-center gap-2 mt-8">{testimonies.map((_, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-primary-400' : 'w-2 bg-white/30 hover:bg-white/50'}`} />)}</div>
                </div>
            </div>
        </section>
    );
});
TestimonySection.displayName = 'TestimonySection';

// EVENTS SECTION  
const events = [
    { id: 1, title: 'Annual Conference 2024', date: 'December 15-17, 2024', time: '9:00 AM - 6:00 PM', location: 'GCCC Main Auditorium', description: 'Three days of powerful worship, inspiring messages, and life-changing encounters with God.', image: 'https://images.unsplash.com/photo-1519167758481-83f29da8b8b9?w=800&q=80', attendees: '1000+', featured: true, gradient: 'from-primary-600 to-indigo-600' },
    { id: 2, title: 'Youth Explosion', date: 'January 20, 2025', time: '5:00 PM - 9:00 PM', location: 'GCCC Youth Center', description: 'An electrifying night of worship, games, and relevant teaching for young people.', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', attendees: '300+', featured: false, gradient: 'from-blue-600 to-cyan-600' },
];

export const EventsSection = memo(() => (
    <section id="events" className="relative py-20 md:py-32 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100 dark:bg-primary-900/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-danger-100 dark:bg-danger-900/10 rounded-full blur-3xl opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-aos="fade-up" className="text-center mb-16">
                <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-100 to-danger-100 dark:from-primary-900/30 dark:to-danger-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold mb-6 shadow-lg">
                    <Calendar size={16} className="text-danger-500" />What's Happening
                </motion.span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">Upcoming Events</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Join us for life-changing experiences and memorable moments</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {events.map((event, index) => (
                    <motion.div key={event.id} data-aos="fade-up" data-aos-delay={index * 100} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * index }} whileHover={{ y: -10, scale: 1.02 }} className="group relative">
                        <div className="relative h-full bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <div className="relative h-64">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className={`absolute inset-0 bg-gradient-to-t ${event.gradient} opacity-60`} />
                                {event.featured && <div className="absolute top-4 left-4 px-4 py-2 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold flex items-center gap-2"><Ticket size={16} />Featured</div>}
                                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"><span className="text-xs font-semibold text-gray-700">{event.attendees} Expected</span></div>
                            </div>
                            <div className="p-6 md:p-8 space-y-4">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{event.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{event.description}</p>
                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm"><Calendar size={16} className="text-primary-500" /><span>{event.date}</span></div>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm"><Clock size={16} className="text-primary-500" /><span>{event.time}</span></div>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm"><MapPin size={16} className="text-primary-500" /><span>{event.location}</span></div>
                                </div>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`w-full mt-4 px-6 py-3 bg-gradient-to-r ${event.gradient} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}>
                                    Register<ArrowRight size={18} />
                                </motion.button>
                            </div>
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${event.gradient} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
));
EventsSection.displayName = 'EventsSection';

// CTA SECTION
export const CTASection = memo(() => (
    <section className="relative py-20 md:py-32 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="absolute inset-0"><div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-200 dark:bg-primary-900/20 rounded-full blur-3xl opacity-30" /><div className="absolute bottom-1/4 right-0 w-96 h-96 bg-danger-200 dark:bg-danger-900/20 rounded-full blur-3xl opacity-30" /></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div data-aos="zoom-in" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative mb-16">
                <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-danger-600 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                    <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Ready to Start Your <span className="block mt-2 bg-gradient-to-r from-danger-200 to-white bg-clip-text text-transparent">Spiritual Journey?</span></h2>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10">Join our vibrant community and experience the transforming power of God's love.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white text-primary-900 font-semibold rounded-full shadow-2xl hover:shadow-white/50 transition-all flex items-center justify-center gap-2">Plan Your Visit<ArrowRight size={20} /></motion.button><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition-all flex items-center justify-center gap-2"><Heart size={20} />Connect With Us</motion.button></div>
                    </div>
                </div>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
                {[{ icon: Users, title: 'New Here?', description: 'Learn what to expect on your first visit', cta: 'First Time Guide', gradient: 'from-blue-500 to-cyan-500' }, { icon: Heart, title: 'Give Online', description: 'Support the ministry through your generosity', cta: 'Give Now', gradient: 'from-danger-500 to-danger-600' }, { icon: Send, title: 'Prayer Request', description: 'Let our community stand with you in faith', cta: 'Send Request', gradient: 'from-primary-500 to-indigo-500' }].map((item, index) => (
                    <motion.div key={item.title} data-aos="fade-up" data-aos-delay={index * 100} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * index }} whileHover={{ y: -8 }} className="group">
                        <div className="relative h-full p-8 bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500">
                            <div className={`inline-flex p-4 bg-gradient-to-br ${item.gradient} rounded-2xl mb-6 shadow-lg`}><item.icon className="text-white" size={28} /></div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{item.description}</p>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`w-full px-6 py-3 bg-gradient-to-r ${item.gradient} text-white font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center justify-center gap-2`}>{item.cta}<ArrowRight size={18} /></motion.button>
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
));
CTASection.displayName = 'CTASection';

// FOOTER
const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-500' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
];

export const Footer = memo(() => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold">G</div>
                            <div><h3 className="text-2xl font-bold">GCCC Ibadan</h3><p className="text-sm text-white/70">Grace Chapel Christian Centre</p></div>
                        </div>
                        <p className="text-white/70 leading-relaxed max-w-md">A vibrant, Spirit-filled church dedicated to spreading the gospel of Jesus Christ and transforming lives through God's love.</p>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-sm text-white/70"><MapPin size={18} className="text-primary-400 mt-0.5 flex-shrink-0" /><span>13 Ayo Oluwole Street, Bodija, Ibadan</span></div>
                            <div className="flex items-center gap-3 text-sm text-white/70"><Phone size={18} className="text-primary-400" /><span>+234 XXX XXX XXXX</span></div>
                            <div className="flex items-center gap-3 text-sm text-white/70"><Mail size={18} className="text-primary-400" /><span>info@gcccibadan.org</span></div>
                        </div>
                        <div className="flex gap-3">{socialLinks.map((social) => <a key={social.label} href={social.href} className={`p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all hover:scale-110 ${social.color}`}><social.icon size={20} /></a>)}</div>
                    </motion.div>
                    {[{ title: 'Quick Links', links: ['About Us', 'Our Services', 'Ministries', 'Events'] }, { title: 'Resources', links: ['Sermons', 'Prayer Requests', 'Give Online', 'Contact'] }].map((col, i) => (
                        <motion.div key={col.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}>
                            <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-primary-400 to-danger-400 bg-clip-text text-transparent">{col.title}</h4>
                            <ul className="space-y-3">{col.links.map((link) => <li key={link}><a href="#" className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2 group"><span className="w-0 h-0.5 bg-primary-400 group-hover:w-4 transition-all" />{link}</a></li>)}</ul>
                        </motion.div>
                    ))}
                </div>
                <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
                    <p>© {currentYear} Grace Chapel Christian Centre Ibadan. All rights reserved.</p>
                    <div className="flex items-center gap-6">{['Privacy Policy', 'Terms of Service'].map((link) => <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>)}</div>
                    <div className="flex items-center gap-2"><span>Made with</span><Heart size={16} className="text-danger-500 fill-danger-500 animate-pulse" /><span>for God's glory</span></div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-danger-500 to-primary-600" />
        </footer>
    );
});
Footer.displayName = 'Footer';