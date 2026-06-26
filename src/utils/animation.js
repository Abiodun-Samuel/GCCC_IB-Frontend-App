export const easingFunctions = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
  'ease-in-back': [0.36, 0, 0.66, -0.56],
  'ease-out-back': [0.34, 1.56, 0.64, 1],
  'ease-in-out-back': [0.68, -0.6, 0.32, 1.6],
  'ease-in-sine': [0.47, 0, 0.75, 0.72],
  'ease-out-sine': [0.39, 0.58, 0.57, 1],
  'ease-in-out-sine': [0.45, 0.05, 0.55, 0.95],
  'ease-in-quad': [0.55, 0.085, 0.68, 0.53],
  'ease-out-quad': [0.25, 0.46, 0.45, 0.94],
  'ease-in-out-quad': [0.455, 0.03, 0.515, 0.955],
  'ease-in-cubic': [0.55, 0.055, 0.675, 0.19],
  'ease-out-cubic': [0.215, 0.61, 0.355, 1],
  'ease-in-out-cubic': [0.645, 0.045, 0.355, 1],
  'ease-in-quart': [0.895, 0.03, 0.685, 0.22],
  'ease-out-quart': [0.165, 0.84, 0.44, 1],
  'ease-in-out-quart': [0.77, 0, 0.175, 1],
};

export const animationVariants = {
  // Fade animations
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  'fade-up': { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
  'fade-down': {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-left': { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } },
  'fade-right': {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  'fade-up-right': {
    hidden: { opacity: 0, x: -30, y: 30 },
    visible: { opacity: 1, x: 0, y: 0 },
  },
  'fade-up-left': {
    hidden: { opacity: 0, x: 30, y: 30 },
    visible: { opacity: 1, x: 0, y: 0 },
  },
  'fade-down-right': {
    hidden: { opacity: 0, x: -30, y: -30 },
    visible: { opacity: 1, x: 0, y: 0 },
  },
  'fade-down-left': {
    hidden: { opacity: 0, x: 30, y: -30 },
    visible: { opacity: 1, x: 0, y: 0 },
  },

  // Flip animations
  'flip-up': {
    hidden: { rotateX: 90, opacity: 0 },
    visible: { rotateX: 0, opacity: 1 },
  },
  'flip-down': {
    hidden: { rotateX: -90, opacity: 0 },
    visible: { rotateX: 0, opacity: 1 },
  },
  'flip-left': {
    hidden: { rotateY: -90, opacity: 0 },
    visible: { rotateY: 0, opacity: 1 },
  },
  'flip-right': {
    hidden: { rotateY: 90, opacity: 0 },
    visible: { rotateY: 0, opacity: 1 },
  },

  // Slide animations
  'slide-up': { hidden: { y: 100 }, visible: { y: 0 } },
  'slide-down': { hidden: { y: -100 }, visible: { y: 0 } },
  'slide-left': { hidden: { x: 100 }, visible: { x: 0 } },
  'slide-right': { hidden: { x: -100 }, visible: { x: 0 } },

  // Zoom animations
  'zoom-in': {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
  'zoom-out': {
    hidden: { scale: 1.5, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
  'zoom-in-up': {
    hidden: { scale: 0.5, y: 30, opacity: 0 },
    visible: { scale: 1, y: 0, opacity: 1 },
  },
  'zoom-in-down': {
    hidden: { scale: 0.5, y: -30, opacity: 0 },
    visible: { scale: 1, y: 0, opacity: 1 },
  },
  'zoom-in-left': {
    hidden: { scale: 0.5, x: 30, opacity: 0 },
    visible: { scale: 1, x: 0, opacity: 1 },
  },
  'zoom-in-right': {
    hidden: { scale: 0.5, x: -30, opacity: 0 },
    visible: { scale: 1, x: 0, opacity: 1 },
  },
  'zoom-out': {
    hidden: { scale: 1.5, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
  'zoom-out-up': {
    hidden: { scale: 1.5, y: 30, opacity: 0 },
    visible: { scale: 1, y: 0, opacity: 1 },
  },
  'zoom-out-down': {
    hidden: { scale: 1.5, y: -30, opacity: 0 },
    visible: { scale: 1, y: 0, opacity: 1 },
  },
  'zoom-out-left': {
    hidden: { scale: 1.5, x: 30, opacity: 0 },
    visible: { scale: 1, x: 0, opacity: 1 },
  },
  'zoom-out-right': {
    hidden: { scale: 1.5, x: -30, opacity: 0 },
    visible: { scale: 1, x: 0, opacity: 1 },
  },
};
