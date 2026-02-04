import { memo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, ArrowRight, Ticket } from 'lucide-react';

const events = [
    { id: 1, title: 'Annual Conference 2024', date: 'December 15-17, 2024', time: '9:00 AM - 6:00 PM', location: 'GCCC Main Auditorium', description: 'Three days of powerful worship and inspiring messages.', image: 'https://images.unsplash.com/photo-1519167758481-83f29da8b8b9?w=800&q=80', attendees: '1000+', featured: true },
    { id: 2, title: 'Youth Explosion', date: 'January 20, 2025', time: '5:00 PM - 9:00 PM', location: 'GCCC Youth Center', description: 'An electrifying night of worship and teaching.', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', attendees: '300+', featured: false },
];

export const EventsSection = memo(() => (
    <section id="events" className="relative py-20 md:py-32 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-aos="fade-up" className="text-center mb-16">
                <span className="inline-block px-5 py-2 bg-coral-50 dark:bg-coral-900/20 text-coral-700 dark:text-coral-400 text-sm font-semibold mb-4">What's Happening</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">Upcoming Events</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Join us for life-changing experiences</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {events.map((event, index) => (
                    <motion.div key={event.id} data-aos="fade-up" data-aos-delay={index * 100} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -8 }} className="group">
                        <div className="h-full bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-all duration-500">
                            <div className="relative h-64">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                                {event.featured && <div className="absolute top-4 left-4 px-4 py-2 bg-coral-600 text-white text-sm font-bold flex items-center gap-2"><Ticket size={16} />Featured</div>}
                                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm"><span className="text-xs font-semibold">{event.attendees} Expected</span></div>
                            </div>
                            <div className="p-6 md:p-8 space-y-4">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{event.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{event.description}</p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm"><Calendar size={16} className="text-coral-600" /><span>{event.date}</span></div>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm"><Clock size={16} className="text-coral-600" /><span>{event.time}</span></div>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm"><MapPin size={16} className="text-coral-600" /><span>{event.location}</span></div>
                                </div>
                                <button className="w-full mt-4 px-6 py-3 bg-coral-600 hover:bg-coral-700 text-white font-semibold transition-all flex items-center justify-center gap-2">Register<ArrowRight size={18} /></button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
));

EventsSection.displayName = 'EventsSection';

export default EventsSection;