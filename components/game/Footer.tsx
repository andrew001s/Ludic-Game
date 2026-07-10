'use client'

import { motion } from 'framer-motion'

export function Footer() {
  return (
    <motion.footer
      className="absolute bottom-0 left-0 right-0 px-6 py-4 flex items-center justify-between text-[10px] text-green-700/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 1.2 }}
      style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
    >

    </motion.footer>
  )
}
