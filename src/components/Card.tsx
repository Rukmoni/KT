import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
}

export const Card = ({ children, className = '', glowOnHover = true, ...props }: CardProps) => {
  return (
    <motion.div
      whileHover={glowOnHover ? { y: -5, scale: 1.02 } : {}}
      className={`glass ${className}`}
      style={{ padding: '2rem' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
