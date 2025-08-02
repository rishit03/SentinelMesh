import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

const AnimatedCounter = ({ value, duration = 1 }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)

  useEffect(() => {
    const animation = animate(count, value, { duration })
    return animation.stop
  }, [value, duration, count])

  return <motion.span>{rounded}</motion.span>
}

export default AnimatedCounter

