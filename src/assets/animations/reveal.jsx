import { motion } from 'framer-motion'
import {
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,
  cardReveal,
  speakerReveal,
  textReveal,
  navbarReveal,
  staggerContainer,
  floatingPoster,
  ctaPulse,
  buttonHover,
} from './variants.js'

const variantMap = {
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,
  cardReveal,
  speakerReveal,
  textReveal,
  navbarReveal,
}

const viewRevealProps = (animateOnMount) =>
  animateOnMount
    ? { animate: 'visible' }
    : { whileInView: 'visible', viewport: { once: true, amount: 0.12 } }

const staggerViewProps = (animateOnMount) => ({
  variants: staggerContainer,
  initial: 'hidden',
  ...viewRevealProps(animateOnMount),
})

/**
 * Scroll-triggered reveal (default) or mount animation when animateOnMount is true.
 */
export const Reveal = ({
  children,
  variant = 'fadeUp',
  className = undefined,
  animateOnMount = false,
  delay = 0,
}) => {
  const selected = variantMap[variant] ?? fadeUp

  return (
    <motion.div
      className={className}
      variants={selected}
      initial="hidden"
      {...(animateOnMount
        ? { animate: 'visible' }
        : {
            whileInView: 'visible',
            viewport: { once: true, amount: 0.2 },
          })}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

/** Parent wrapper — children should use StaggerItem. */
export const StaggerReveal = ({
  children,
  className = undefined,
  as: Tag = 'div',
  animateOnMount = false,
}) => {
  const props = { className, ...staggerViewProps(animateOnMount) }

  if (Tag === 'ul') {
    return <motion.ul {...props}>{children}</motion.ul>
  }

  return <motion.div {...props}>{children}</motion.div>
}

export const StaggerItem = ({
  children,
  className = undefined,
  variant = 'fadeUp',
  as: Tag = 'div',
}) => {
  const props = { className, variants: variantMap[variant] ?? fadeUp }

  if (Tag === 'li') {
    return <motion.li {...props}>{children}</motion.li>
  }

  return <motion.div {...props}>{children}</motion.div>
}

/** Gentle floating loop — ideal for hero images and posters. */
export const Float = ({ children, className = undefined }) => (
  <motion.div
    className={className}
    animate={floatingPoster.animate}
    transition={floatingPoster.transition}
  >
    {children}
  </motion.div>
)

/** Interactive button with hover/tap feedback and optional pulse. */
export const MotionButton = ({
  children,
  className = undefined,
  pulse = false,
  ...props
}) => (
  <motion.button
    className={className}
    whileHover={buttonHover.whileHover}
    whileTap={buttonHover.whileTap}
    animate={pulse ? ctaPulse.animate : undefined}
    transition={pulse ? ctaPulse.transition : undefined}
    {...props}
  >
    {children}
  </motion.button>
)

export default Reveal
