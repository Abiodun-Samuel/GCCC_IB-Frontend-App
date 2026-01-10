import { TelegramIcon } from "@/icons";
import { memo } from "react";

const SuccessCompletion = memo(() => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/40 dark:from-gray-950 dark:via-green-950/20 dark:to-emerald-950/20">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-green-100/50 dark:border-green-900/30 shadow-2xl shadow-green-500/10 dark:shadow-green-500/5">

          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-400/20 dark:from-green-500/10 dark:to-emerald-500/10 rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-emerald-400/20 to-green-400/20 dark:from-emerald-500/10 dark:to-green-500/10 rounded-full blur-3xl animate-float-delayed" />
          </div>

          {/* Content Container */}
          <div className="relative px-6 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16 z-10">

            {/* Success Icon with Animation */}
            <div className="relative mx-auto mb-8 w-24 h-24 sm:w-28 sm:h-28 animate-scale-in">
              {/* Outer Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 opacity-20 animate-ping" />

              {/* Main Circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-500 dark:to-emerald-600 shadow-xl shadow-green-500/40 dark:shadow-green-500/20 flex items-center justify-center">
                {/* Checkmark Icon */}
                <svg
                  className="w-12 h-12 sm:w-14 sm:h-14 text-white animate-draw-check"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Sparkles */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-sparkle" />
              <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-emerald-400 rounded-full animate-sparkle-delayed" />
              <div className="absolute top-1/2 -right-3 w-2.5 h-2.5 bg-green-400 rounded-full animate-sparkle-more-delayed" />
            </div>

            {/* Heading */}
            <div className="text-center mb-6 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 dark:from-green-400 dark:via-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                  You're All Set!
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-medium">
                Welcome to our community 🎉
              </p>
            </div>

            {/* Description */}
            <div className="text-center mb-8 space-y-3 animate-fade-in-up-delayed">
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
                Thank you for joining us today! It was a blessing to have you fellowship with us. Your details have been received, and we're excited to connect with you soon.
              </p>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
                May your week be filled with peace and God's abundant blessings.
              </p>
            </div>

            {/* CTA Section */}
            <div className="space-y-4 animate-fade-in-up-more-delayed">
              {/* Telegram CTA Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 p-[1px] shadow-lg shadow-blue-500/20">
                <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/90 dark:to-cyan-950/90 rounded-2xl p-6 sm:p-7">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse-subtle">
                      <TelegramIcon />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                        Stay Connected
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        Join our Telegram channel for daily devotionals, prayer points, and community updates
                      </p>
                    </div>

                    {/* Button */}
                    <a
                      href="https://t.me/Pastoropeyemipeter"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span>Join Channel</span>
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => window.location.reload()}
                className="group w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-400 dark:hover:to-emerald-400 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg shadow-green-500/30 dark:shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/40 dark:hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Complete</span>
              </button>
            </div>

            {/* Security Badge */}
            <div className="mt-10 pt-8 border-t border-gray-200/50 dark:border-gray-700/50 animate-fade-in-final">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg
                  className="w-4 h-4 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Your information is secure and encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes draw-check {
          0% {
            stroke-dasharray: 0, 100;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            stroke-dasharray: 100, 0;
            opacity: 1;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-draw-check {
          animation: draw-check 0.8s ease-out 0.3s forwards;
        }

        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }

        .animate-sparkle-delayed {
          animation: sparkle 1.5s ease-in-out 0.3s infinite;
        }

        .animate-sparkle-more-delayed {
          animation: sparkle 1.5s ease-in-out 0.6s infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out 0.5s both;
        }

        .animate-fade-in-up-delayed {
          animation: fade-in-up 0.6s ease-out 0.7s both;
        }

        .animate-fade-in-up-more-delayed {
          animation: fade-in-up 0.6s ease-out 0.9s both;
        }

        .animate-fade-in-final {
          animation: fade-in-up 0.6s ease-out 1.1s both;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 8s ease-in-out 4s infinite;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
});

SuccessCompletion.displayName = "SuccessCompletion";
export default SuccessCompletion;