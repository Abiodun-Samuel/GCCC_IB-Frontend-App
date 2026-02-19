import { useScrollState } from "@/hooks/useScrollState";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from 'lucide-react';


export function ScrollToTop() {
  const { showBackToTop } = useScrollState();
  const { pathname } = useLocation();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  {/* Back to Top Button */ }
  return (
    <AnimatePresence>
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 bg-[#0998d5] hover:bg-[#0886bd] text-white shadow transition-colors duration-200 group"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6 transition-transform duration-200 group-hover:-translate-y-1" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
