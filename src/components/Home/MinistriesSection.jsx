import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Baby, Music, Heart, BookOpen, Smile, GraduationCap, HandHeart, ArrowRight } from 'lucide-react';

const ministries = [
    { icon: Music, title: 'Worship Ministry', description: 'Leading the congregation in spirit-filled worship', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80', members: '50+' },
    { icon: Baby, title: 'Children Ministry', description: 'Nurturing young hearts to know and love Jesus', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80', members: '100+' },
    { icon: Smile, title: 'Youth Ministry', description: 'Empowering the next generation for Christ', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80', members: '150+' },
    { icon: Users, title: 'Men Ministry', description: 'Building godly men of strength and integrity', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', members: '80+' },
    { icon: Heart, title: 'Women Ministry', description: 'Equipping women to shine for Jesus', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80', members: '120+' },
    { icon: HandHeart, title: 'Outreach Ministry', description: "Spreading God's love beyond our walls", image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80', members: '60+' },
    { icon: BookOpen, title: 'Bible Study', description: "Growing deeper in God's Word", image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', members: '90+' },
    { icon: GraduationCap, title: 'Discipleship', description: 'Mentoring believers to spiritual maturity', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80', members: '70+' },
];

export const MinistriesSection = memo(() => (
    <section id="ministries" className="relative py-20 md:py-32 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-aos="fade-up" className="text-center mb-16">
                <span className="inline-block px-5 py-2 bg-coral-50 dark:bg-coral-900/20 text-coral-700 dark:text-coral-400 text-sm font-semibold mb-4">Get Involved</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">Our Ministries</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Find your place to serve and grow in community</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ministries.map((ministry, index) => (
                    <motion.div key={ministry.title} data-aos="zoom-in" data-aos-delay={index * 50} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} whileHover={{ y: -8 }} className="group">
                        <div className="h-full bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-all duration-500">
                            <div className="relative h-52 overflow-hidden">
                                <img src={ministry.image} alt={ministry.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                                <div className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur-sm"><ministry.icon className="text-coral-600" size={24} /></div>
                                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm"><span className="text-xs font-semibold">{ministry.members} Members</span></div>
                            </div>
                            <div className="p-6 space-y-3">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{ministry.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{ministry.description}</p>
                                <button className="w-full mt-4 px-4 py-2.5 bg-ocean-600 hover:bg-ocean-700 text-white font-semibold transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 flex items-center justify-center gap-2">Learn More<ArrowRight size={16} /></button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
))

MinistriesSection.displayName = 'MinistriesSection';
export default MinistriesSection;