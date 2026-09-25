"use client";

import Link from "next/link";
import { motion } from "motion/react";

/** next/link as a Motion component (variants drive the text roll). */
export const MotionLink = motion.create(Link);
