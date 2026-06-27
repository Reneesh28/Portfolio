import React from 'react';
import { motion } from 'framer-motion';

const ComicSpread = ({ children, id, className = '', ...props }) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full min-h-screen flex flex-col py-24 px-4 md:px-12 lg:px-24 ${className}`}
      {...props}
    >
      {children}
    </motion.section>
  );
};

export default ComicSpread;
