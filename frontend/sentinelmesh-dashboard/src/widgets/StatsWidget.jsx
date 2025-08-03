import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card.jsx';
import AnimatedCounter from '../components/AnimatedCounter.jsx';

const StatsWidget = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  hoverText, 
  isHovered, 
  onHover, 
  onHoverEnd,
  className = ""
}) => {
  return (
    <motion.div
      onHoverStart={onHover}
      onHoverEnd={onHoverEnd}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={className}
    >
      <Card className={`relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br ${color} text-white cursor-pointer`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">{title}</p>
              <p className="text-3xl font-bold">
                <AnimatedCounter value={value} />
              </p>
              {isHovered && hoverText && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-white/70 mt-1"
                >
                  {hoverText}
                </motion.p>
              )}
            </div>
            <motion.div
              animate={isHovered ? { rotate: 360 } : {}}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-8 w-8 text-white/70" />
            </motion.div>
          </div>
          <motion.div 
            className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
            layoutId="cardHover"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsWidget;

