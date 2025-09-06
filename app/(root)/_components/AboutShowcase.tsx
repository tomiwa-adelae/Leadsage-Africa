"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export const AboutShowcase = () => {
  return (
    <div className="mb-16 text-center">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-4 flex justify-center"
        >
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 rounded-full px-4 py-1 text-sm font-medium"
          >
            <Sparkles className="text-primary mr-1 h-3.5 w-3.5" />
            About Us
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="from-foreground to-foreground/70 bg-gradient-to-b bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl"
        >
          About Leadsage
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-muted-foreground mt-4 text-base md:text-lg"
        >
          We’re building Nigeria’s most trusted housing platform — connecting
          people with verified homes, landlords, and agents.
        </motion.p>
      </div>
    </div>
  );
};
