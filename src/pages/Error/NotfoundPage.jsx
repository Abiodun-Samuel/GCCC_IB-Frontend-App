import { Link } from 'react-router-dom';
import PageMeta from '../../components/common/PageMeta'
import { useEffect, useState } from 'react';
import { HomeIcon } from '@/icons';
import Button from '@/components/ui/Button';

export default function NotfoundPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return (
    <>
      <PageMeta title="GCCC Ibadan" description="Page not found" />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl animate-pulse"
            style={{
              transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
              transition: 'transform 0.3s ease-out',
              animationDelay: '1s',
            }}
          />
        </div>

        <div
          className={`relative z-10 max-w-4xl w-full text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          {/* Animated 404 SVG */}
          <div className="mb-8 md:mb-12 relative">
            <svg
              viewBox="0 0 900 350"
              className="w-full h-auto max-w-3xl mx-auto drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className="text-blue-500 dark:text-blue-400" stopColor="currentColor" />
                  <stop offset="100%" className="text-indigo-600 dark:text-indigo-400" stopColor="currentColor" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* First 4 */}
              <g className="animate-[bounce_2s_ease-in-out_infinite]" style={{ animationDelay: '0s' }}>
                <path
                  d="M 150 100 L 150 250 M 150 100 L 80 180 L 180 180"
                  stroke="url(#gradient1)"
                  strokeWidth="32"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  filter="url(#glow)"
                />
              </g>

              {/* 0 */}
              <g className="animate-[bounce_2s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }}>
                <ellipse
                  cx="450"
                  cy="175"
                  rx="85"
                  ry="95"
                  stroke="url(#gradient1)"
                  strokeWidth="32"
                  fill="none"
                  filter="url(#glow)"
                />
              </g>

              {/* Second 4 */}
              <g className="animate-[bounce_2s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }}>
                <path
                  d="M 750 100 L 750 250 M 750 100 L 680 180 L 780 180"
                  stroke="url(#gradient1)"
                  strokeWidth="32"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  filter="url(#glow)"
                />
              </g>
            </svg>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-ping"
                  style={{
                    left: `${15 + i * 12}%`,
                    top: `${25 + (i % 4) * 15}%`,
                    animationDelay: `${i * 0.4}s`,
                    animationDuration: '3s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-4 md:space-y-6 mb-10 md:mb-14 px-4">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-slate-100 transition-all duration-500"
              style={{
                transform: `translateX(${mousePosition.x * 0.5}px)`,
              }}
            >
              Oops! Page Not Found
            </h1>
            <p
              className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed transition-all duration-500"
              style={{
                transform: `translateX(${-mousePosition.x * 0.3}px)`,
              }}
            >
              The page you're looking for seems to have wandered off into the digital void.
              Don't worry though, we'll help you find your way back home.
            </p>
          </div>

          {/* Action button */}
          <div className="flex justify-center items-center px-4">
            <Button href={'/'}>Go Home</Button>
          </div>

          {/* Help text */}
          <p className="mt-10 md:mt-14 text-xs sm:text-sm text-slate-500 dark:text-slate-500 px-4">
            Error Code: 404 • If you believe this is a mistake, please contact support
          </p>
        </div>
      </div>
    </>
  );
}
