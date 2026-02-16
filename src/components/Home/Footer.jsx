import React from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Youtube,
    ChevronRight,
    ExternalLink
} from 'lucide-react';

// TikTok icon component (lucide-react doesn't have TikTok, so we create custom)
const TikTok = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'About Us', href: '#about', isHash: true },
        { name: 'Our Services', href: '#services', isHash: true },
        { name: 'Forms', href: '/forms', isHash: false },
        { name: 'Contact', href: '#contact', isHash: true },
    ];

    const socialLinks = [
        { icon: Facebook, href: 'https://www.facebook.com/share/1K8ura74Dc/', label: 'Facebook', color: 'hover:bg-[#1877f2]' },
        { icon: Instagram, href: 'https://www.instagram.com/gcccibadan?igsh=YmhydmdsemN2M3Mx', label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-[#f58529] hover:via-[#dd2a7b] hover:to-[#8134af]' },
        { icon: TikTok, href: 'https://www.tiktok.com/@gcccibadan?_r=1&_t=ZS-93jXPQ30QnU', label: 'TikTok', color: 'hover:bg-black' },
        { icon: Youtube, href: 'https://www.youtube.com/@GcccIbadan', label: 'YouTube', color: 'hover:bg-[#ff0000]' }
    ];

    const churchAddress = "13 Ayo Oluwole Street, Bodija Akintola Road, Bodija, adjacent Raian Pharmacy, Iyana Bodija, Ibadan 200284, Oyo";
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(churchAddress)}`;

    // Smooth scroll handler for hash links
    const handleHashClick = (e, href) => {
        e.preventDefault();
        const targetId = href.replace('#', '');
        const element = document.getElementById(targetId);

        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Update URL without page jump
            window.history.pushState(null, '', href);
        }
    };

    return (
        <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-300 overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '32px 32px'
                }} />
            </div>

            {/* Gradient Orbs */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0998d5] rounded-full blur-[128px]" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#eb2225] rounded-full blur-[128px]" />
            </div>

            <div className="relative container mx-auto px-6 lg:px-8">

                {/* Main Footer Content */}
                <div className="py-16 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                        {/* Column 1: Brand & Social - Spans 5 columns */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="lg:col-span-5 space-y-8"
                        >
                            {/* Logo */}
                            <div className="space-y-4">
                                <Link href="/" className="inline-block">
                                    <img
                                        src="/images/logo/logo-white.png"
                                        alt="Glory Centre Community Church"
                                        className="h-16 w-auto"
                                    />
                                </Link>
                                <p className="text-base leading-relaxed text-gray-400 max-w-md">
                                    Where God Meets With His People. A growing community rooted in Love, Family, and Kingdom.
                                </p>
                            </div>

                            {/* Social Links */}
                            <div className="pt-2">
                                <h5 className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-4">
                                    Connect With Us
                                </h5>
                                <div className="flex gap-3">
                                    {socialLinks.map((social, index) => {
                                        const Icon = social.icon;
                                        return (
                                            <motion.a
                                                key={index}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ scale: 1.1, y: -3 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-800 ${social.color} text-gray-400 hover:text-white hover:border-transparent transition-all duration-300 rounded-lg group`}
                                                aria-label={social.label}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </motion.a>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>

                        {/* Column 2: Quick Links - Spans 3 columns */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="lg:col-span-3 space-y-6"
                        >
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
                            <ul className="space-y-3.5">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        {link.isHash ? (
                                            <a
                                                href={link.href}
                                                onClick={(e) => handleHashClick(e, link.href)}
                                                className="group inline-flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-all duration-300 cursor-pointer"
                                            >
                                                <ChevronRight className="w-3.5 h-3.5 text-[#eb2225] transform group-hover:translate-x-1 transition-transform duration-300" />
                                                <span className="group-hover:translate-x-0.5 transition-transform duration-300">{link.name}</span>
                                            </a>
                                        ) : (
                                            <Link
                                                to={link.href}
                                                className="group inline-flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-all duration-300"
                                            >
                                                <ChevronRight className="w-3.5 h-3.5 text-[#eb2225] transform group-hover:translate-x-1 transition-transform duration-300" />
                                                <span className="group-hover:translate-x-0.5 transition-transform duration-300">{link.name}</span>
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Column 3: Contact - Spans 4 columns */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="lg:col-span-4 space-y-6"
                        >
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Get In Touch</h4>

                            <div className="space-y-5">
                                {/* Phone */}
                                <a
                                    href="tel:+2348063176234"
                                    className="group flex items-center gap-4 text-sm text-gray-400 hover:text-white transition-all duration-300 p-3 rounded-lg hover:bg-gray-800/30"
                                >
                                    <div className="p-2.5 bg-gray-800/50 rounded-lg group-hover:bg-[#0998d5] transition-colors duration-300">
                                        <Phone className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <span className="font-medium">0806 317 6234</span>
                                </a>

                                {/* Email */}
                                <a
                                    href="mailto:admin@gcccibadan.org"
                                    className="group flex items-center gap-4 text-sm text-gray-400 hover:text-white transition-all duration-300 p-3 rounded-lg hover:bg-gray-800/30"
                                >
                                    <div className="p-2.5 bg-gray-800/50 rounded-lg group-hover:bg-[#0998d5] transition-colors duration-300">
                                        <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <span className="font-medium">admin@gcccibadan.org</span>
                                </a>

                                {/* Address */}
                                <a
                                    href={googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-start gap-4 text-sm text-gray-400 hover:text-white transition-all duration-300 p-3 rounded-lg hover:bg-gray-800/30"
                                >
                                    <div className="p-2.5 bg-gray-800/50 rounded-lg group-hover:bg-[#eb2225] transition-colors duration-300 flex-shrink-0">
                                        <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="font-medium block leading-relaxed">
                                            13 Ayo Oluwole Street, Bodija Akintola Road,
                                            Bodija, adjacent Raian Pharmacy,
                                            Iyana Bodija, Ibadan 200284, Oyo
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 mt-2 text-xs text-[#0998d5] group-hover:text-[#eb2225] transition-colors duration-300">
                                            Get Directions <ExternalLink className="w-3 h-3" />
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="py-8 border-t border-gray-800/50"
                >
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            © {currentYear} Glory Centre Community Church. All rights reserved.
                        </p>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;