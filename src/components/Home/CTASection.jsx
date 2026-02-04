import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Users, Send } from 'lucide-react';

export const CTASection = memo(() => (
    <section className="relative py-20 md:py-32 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div data-aos="zoom-in" className="relative mb-16">
                <div className="relative bg-gradient-to-br from-coral-600 to-ocean-600 p-8 md:p-16 text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Ready to Start Your <span className="block mt-2">Spiritual Journey?</span>
                    </h2>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10">Join our vibrant community and experience the transforming power of God's love.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-white text-coral-600 font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">Plan Your Visit<ArrowRight size={20} /></button>
                        <button className="px-8 py-4 bg-white/10 border border-white text-white font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"><Heart size={20} />Connect With Us</button>
                    </div>
                </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { icon: Users, title: 'New Here?', description: 'Learn what to expect on your first visit', cta: 'First Time Guide' },
                    { icon: Heart, title: 'Give Online', description: 'Support the ministry through your generosity', cta: 'Give Now' },
                    { icon: Send, title: 'Prayer Request', description: 'Let our community stand with you in faith', cta: 'Send Request' },
                ].map((item, index) => (
                    <motion.div key={item.title} data-aos="fade-up" data-aos-delay={index * 100} whileHover={{ y: -8 }} className="group">
                        <div className="h-full p-8 bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-all duration-500">
                            <div className="inline-flex p-4 bg-coral-50 dark:bg-coral-900/20 mb-6">
                                <item.icon className="text-coral-600 dark:text-coral-400" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{item.description}</p>
                            <button className="w-full px-6 py-3 bg-ocean-600 hover:bg-ocean-700 text-white font-semibold transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 flex items-center justify-center gap-2">{item.cta}<ArrowRight size={18} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
));

CTASection.displayName = 'CTASection';

export default CTASection;