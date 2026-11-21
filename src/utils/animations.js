// Hardware-accelerated easing curves and reusable motion configurations
export const EASINGS = {
  easeOutQuart: [0.25, 1, 0.5, 1],
  smoothOut: [0.16, 1, 0.3, 1],
  springLift: { type: "spring", stiffness: 400, damping: 25 },
};

// Alternating Scroll Reveal (max 0.35s - 0.4s, transform & opacity ONLY)
export const createReveal = (direction = 'up', distance = 20, delay = 0) => ({
  hidden: {
    opacity: 0,
    x: direction === 'left' ? -distance : direction === 'right' ? distance : 0,
    y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.35,
      delay,
      ease: EASINGS.smoothOut,
    },
  },
});

export const revealLeft = createReveal('left', 24);
export const revealRight = createReveal('right', 24);
export const revealUp = createReveal('up', 20);

// Single-trigger viewport configuration
export const viewportOnce = {
  once: true,
  margin: "-40px",
};

// Desktop Magnetic / Lift Hover (transform ONLY, zero box-shadow animation)
export const liftHover = {
  y: -4,
  transition: { duration: 0.2, ease: "easeOut" },
};

export const tapPress = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

// 3D Flip Card Configurations
export const flipCardInner = {
  front: {
    rotateY: 0,
    transition: { duration: 0.45, ease: EASINGS.smoothOut },
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.45, ease: EASINGS.smoothOut },
  },
};

// Single hero status pulse (the ONE allowed subtle infinite accent)
export const singleHeroPulse = {
  scale: [1, 1.25, 1],
  opacity: [0.6, 1, 0.6],
  transition: {
    repeat: Infinity,
    duration: 2.2,
    ease: "easeInOut",
  },
};

// Fade transition for modals
export const modalFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
