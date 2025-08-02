import { motion } from 'framer-motion'

const StatusIndicator = ({ status = 'online', size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    warning: 'bg-yellow-500',
    unknown: 'bg-gray-500'
  }

  return (
    <div className="relative flex items-center">
      <motion.div
        className={`${sizeClasses[size]} ${statusColors[status]} rounded-full`}
        animate={status === 'online' ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      {status === 'online' && (
        <motion.div
          className={`absolute ${sizeClasses[size]} ${statusColors[status]} rounded-full opacity-75`}
          animate={{ scale: [1, 2, 1], opacity: [0.75, 0, 0.75] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </div>
  )
}

export default StatusIndicator

