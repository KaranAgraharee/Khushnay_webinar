export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const fadeDown = {
  hidden: {
    opacity: 0,
    y: -60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const fadeRight = {
  hidden: {
    opacity: 0,
    x: 80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
export const cardReveal = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
export const staggerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};
export const speakerReveal = {
  hidden: {
    opacity: 0,
    x: -100,
    rotate: -3,
  },

  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,

    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
export const floatingPoster = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 0.5, 0],
  },

  transition: {
    duration: 6,
    repeat: Infinity,
    ease: [0.42, 0, 0.58, 1],
  },
};
export const ctaPulse = {
  animate: {
    scale: [1, 1.05, 1],
  },

  transition: {
    duration: 2,
    repeat: Infinity,
  },
};
export const buttonHover = {
  whileHover: {
    scale: 1.05,
    boxShadow:
      "0px 0px 30px rgba(233,30,99,.5)",
  },

  whileTap: {
    scale: 0.95,
  },
};
export const textReveal = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.7,
    },
  },
};
export const navbarReveal = {
  hidden: {
    y: -100,
    opacity: 0,
  },

  visible: {
    y: 0,
    opacity: 1,

    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};