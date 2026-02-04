import { memo } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';

const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Twitter, href: '#', label: 'Twitter' },
];

export const Footer = memo(() => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="relative bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <motion.div className="lg:col-span-2 space-y-6">
                        <img src="/logo-white.png" alt="GCCC Logo" className="h-16 w-auto" />
                        <p className="text-gray-400 leading-relaxed max-w-md">A vibrant, Spirit-filled church where the Glory and Power of God find expression through community.</p>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-sm text-gray-400">
                                <MapPin size={18} className="text-coral-400 mt-0.5 flex-shrink-0" />
                                <span>Oluwole Akintola Way, Iyana Bodija Ibadan, Nigeria</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Phone size={18} className="text-coral-400" />
                                <span>08063176234</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Mail size={18} className="text-coral-400" />
                                <span>admin@gcccibadan.org</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a key={social.label} href={social.href} className="p-3 bg-white/10 hover:bg-coral-600 transition-all">
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {[
                        { title: 'Quick Links', links: ['About Us', 'Our Services', 'Ministries', 'Events'] },
                        { title: 'Resources', links: ['Sermons', 'Prayer Requests', 'Give Online', 'Contact'] },
                    ].map((col) => (
                        <motion.div key={col.title}>
                            <h4 className="text-lg font-bold mb-6 text-coral-400">{col.title}</h4>
                            <ul className="space-y-3">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                <div className="py-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                    <p>© {currentYear} Glory Centre Community Church Ibadan. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        {['Privacy Policy', 'Terms of Service'].map((link) => (
                            <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Made with</span>
                        <Heart size={16} className="text-coral-500 fill-coral-500 animate-pulse" />
                        <span>for God's glory</span>
                    </div>
                </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-coral-600 to-ocean-600" />
        </footer>
    );
})

Footer.displayName = 'Footer';

export default Footer;