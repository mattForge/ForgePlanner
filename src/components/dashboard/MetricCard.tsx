import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ElementType;
  delay?: number;
}
export function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  delay = 0
}: MetricCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.4,
        delay
      }}>

      <Card className="hover:shadow-md transition-shadow duration-300 h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            {Icon && <Icon className="w-5 h-5 text-blue-600" />}
          </div>
          {trend &&
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>

              {trend.isPositive ?
            <TrendingUp className="w-3 h-3" /> :

            <TrendingDown className="w-3 h-3" />
            }
              <span>{Math.abs(trend.value)}%</span>
            </div>
          }
        </div>

        <div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </p>
        </div>
      </Card>
    </motion.div>);

}