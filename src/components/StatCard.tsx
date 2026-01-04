import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  delay?: number;
  isPercentage?: boolean;
  prefix?: string;
  suffix?: string;
  color?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  delay = 0,
  isPercentage = false,
  prefix = "",
  suffix = "",
  color = "blue",
}: StatCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (typeof value === "number") {
      if (isPercentage) {
        return latest.toFixed(1);
      }
      return Math.round(latest).toLocaleString();
    }
    return value;
  });

  useEffect(() => {
    if (typeof value === "number") {
      const controls = animate(count, value, {
        duration: 2,
        delay,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [value, delay]);

  const colorClasses =
    {
      blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
      purple: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
      green: "from-green-500/20 to-emerald-500/20 border-green-500/30",
      orange: "from-orange-500/20 to-yellow-500/20 border-orange-500/30",
      red: "from-red-500/20 to-rose-500/20 border-red-500/30",
    }[color] ?? "from-blue-500/20 to-cyan-500/20 border-blue-500/30";

  const iconColorClasses =
    {
      blue: "text-blue-400",
      purple: "text-purple-400",
      green: "text-green-400",
      orange: "text-orange-400",
      red: "text-red-400",
    }[color] || "text-blue-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`glass glass-hover rounded-2xl p-6 bg-gradient-to-br ${colorClasses} card-glow relative overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider">
            {title}
          </h3>
          <div className={`p-2 rounded-lg bg-white/5 ${iconColorClasses}`}>
            <Icon size={20} />
          </div>
        </div>

        <div className="space-y-1">
          <motion.div className="text-3xl font-bold text-white">
            {typeof value === "number" ? (
              <>
                {prefix}
                <motion.span>{rounded}</motion.span>
                {suffix}
                {isPercentage && "%"}
              </>
            ) : (
              value
            )}
          </motion.div>
          {subtitle && <p className="text-white/40 text-sm">{subtitle}</p>}
        </div>
      </div>

      {/* Animated gradient line */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${
          color === "blue"
            ? "from-blue-500 to-cyan-500"
            : color === "purple"
            ? "from-purple-500 to-pink-500"
            : color === "green"
            ? "from-green-500 to-emerald-500"
            : color === "orange"
            ? "from-orange-500 to-yellow-500"
            : "from-red-500 to-rose-500"
        }`}
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1, delay: delay + 0.5 }}
      />
    </motion.div>
  );
}
