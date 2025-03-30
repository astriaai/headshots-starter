"use client"

import { motion, useInView } from "motion/react"
import { useRef, useState } from "react"
import { Check, MousePointer, Sparkles, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedProcessStepProps {
  number: number
  title: string
  description: string
  animationType: "upload" | "sparkles" | "download"
  icon: React.ReactNode
}

export default function AnimatedProcessStep({
  number,
  title,
  description,
  animationType,
  icon,
}: AnimatedProcessStepProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [isHovered, setIsHovered] = useState(false)

  const getAnimation = () => {
    switch (animationType) {
      case "upload":
        return (
          <div className="relative h-32 w-full max-w-[280px] overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="space-y-2">
                <motion.div
                  className="h-8 w-full rounded-md bg-muted"
                  initial={{ y: 40, opacity: 0 }}
                  animate={isInView && isHovered ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="flex justify-between gap-2">
                  <motion.div
                    className="h-8 w-8 rounded-md bg-muted"
                    initial={{ y: 40, opacity: 0 }}
                    animate={isInView && isHovered ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  />
                  <motion.div
                    className="h-8 w-8 rounded-md bg-muted"
                    initial={{ y: 40, opacity: 0 }}
                    animate={isInView && isHovered ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  />
                  <motion.div
                    className="h-8 w-8 rounded-md bg-muted"
                    initial={{ y: 40, opacity: 0 }}
                    animate={isInView && isHovered ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
            <motion.div
              className="absolute -right-4 -top-4"
              initial={{ x: 20, y: 20 }}
              animate={isInView && isHovered ? { x: 0, y: 0 } : { x: 20, y: 20 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <div className="relative h-8 w-8">
                <MousePointer className="h-5 w-5 text-primary" />
              </div>
            </motion.div>
          </div>
        )

      case "sparkles":
        return (
          <div className="relative h-32 w-full max-w-[280px] overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
                animate={
                  isInView && isHovered
                    ? {
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{
                  duration: 1.5,
                  repeat: isInView && isHovered ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "loop",
                }}
              >
                <Clock className="h-10 w-10 text-primary" />
              </motion.div>
            </div>
            {isInView && isHovered && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                  </motion.div>
                ))}
              </>
            )}
          </div>
        )

      case "download":
        return (
          <div className="relative h-32 w-full max-w-[280px] overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <motion.div
                className="grid grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView && isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              >
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-12 w-12 rounded-lg bg-primary/10"
                    whileHover={{ scale: 1.05 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </motion.div>
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500"
                initial={{ scale: 0 }}
                animate={isInView && isHovered ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <Check className="h-5 w-5 text-white" />
              </motion.div>
            </div>
          </div>
        )
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
      transition={{ duration: 0.5, delay: number * 0.2 }}
      className={cn(
        "group flex flex-col items-center text-center",
        "rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md",
        "cursor-pointer"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-2 ring-primary/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {number}
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-transform duration-200 group-hover:scale-110">
          {icon}
        </div>
      </div>

      {getAnimation()}

      <div className="mt-6 space-y-2">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  )
}

