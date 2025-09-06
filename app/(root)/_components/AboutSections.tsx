"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LineChart, Zap } from "lucide-react";
export const AboutSections = () => {
  const aboutRef = useRef(null);
  const timelineRef = useRef(null);

  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 });
  const timelineInView = useInView(timelineRef, { once: true, amount: 0.2 });
  return (
    <>
      {/* About Content Section */}
      <div ref={aboutRef} className="relative pb-8 container">
        <div className="grid gap-16 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="relative space-y-6"
          >
            <div className="from-primary/80 to-primary/60 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg">
              <Zap className="h-6 w-6" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight">Our Mission</h2>

            <p className="text-muted-foreground text-base leading-relaxed">
              At Leadsage, our mission is to transform how people find and
              manage homes. We’re committed to building a platform that empowers
              tenants to discover safe, verified properties, helps landlords
              reach the right tenants, and gives agents the tools to work more
              efficiently. Every feature we create is designed to make the
              housing journey — from search to signing — seamless, secure, and
              stress-free.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="relative space-y-6"
          >
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/80 to-blue-500/60 text-white shadow-lg">
              <LineChart className="h-6 w-6" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight">Our Vision</h2>

            <p className="text-muted-foreground text-base leading-relaxed">
              Our vision is to be more than just a listings platform. We want to
              create an ecosystem where housing is transparent, affordable, and
              accessible to everyone — from young professionals renting their
              first apartment to families looking for their forever home. As we
              grow, we aim to set the standard for real estate in Africa by
              combining technology, trust, and human-centered design to simplify
              the housing experience for millions.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};
