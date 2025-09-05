"use client";

import {
  Users,
  Award,
  Briefcase,
  Code,
  Sparkles,
  Building,
  LineChart,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import CountUp from "react-countup";
import {
  IconFingerprint,
  IconGlobeFilled,
  IconHome,
} from "@tabler/icons-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const stats = [
  {
    value: 10000,
    label: "Happy Tenants",
    icon: <Users className="h-5 w-5" />,
    delay: 0,
    color: "from-rose-500 to-orange-500",
    decimalPlaces: 0,
  },
  {
    value: 1100,
    label: "Verified Listings",
    icon: <IconHome className="h-5 w-5" />,
    delay: 0.1,
    color: "from-blue-500 to-cyan-500",
    decimalPlaces: 0,
  },
  {
    value: 2,
    label: "Cities Covered",
    icon: <IconGlobeFilled className="h-5 w-5" />,
    delay: 0.2,
    color: "from-green-500 to-emerald-500",
    decimalPlaces: 0,
  },
  {
    value: 100,
    label: "Secure Payments",
    icon: <IconFingerprint className="h-5 w-5" />,
    delay: 0.3,
    color: "from-purple-500 to-violet-500",
    decimalPlaces: 0,
  },
];

export const AboutStats = () => {
  const statsRef = useRef(null);

  return (
    <div ref={statsRef} className="mb-20 container">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            value={stat.value}
            label={stat.label}
            icon={stat.icon}
            delay={stat.delay || index * 0.1}
            decimalPlaces={stat.decimalPlaces}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  );
};

interface StatItemProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  delay?: number;
  decimalPlaces?: number;
  color?: string;
}

const StatItem = ({
  value,
  label,
  icon,
  delay = 0,
  decimalPlaces = 0,
  color = "from-primary to-primary/70",
}: StatItemProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { resolvedTheme } = useTheme();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      className={cn(
        "group border-border/30 bg-card relative overflow-hidden rounded-xl border p-6",
        resolvedTheme === "dark"
          ? "shadow-xl shadow-black/5"
          : "shadow-lg shadow-black/[0.03]"
      )}
    >
      <div
        className={cn(
          "absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-30 group-hover:blur-3xl",
          color
        )}
      />

      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white",
            color
          )}
        >
          {icon}
        </div>

        <div className="flex flex-col">
          <h3 className="flex items-baseline text-3xl font-bold tracking-tight">
            <CountUp
              start={0}
              end={value}
              duration={2.25}
              decimal=","
              suffix={"+"}
            />
          </h3>
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};
