"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"

export default function HeroAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sample before/after pairs
  const transformations = [
    {
      before: "/placeholder.svg?height=400&width=400",
      after: "/homepage/example0001.jpeg",
      label: "Professional LinkedIn",
    },
    {
      before: "/placeholder.svg?height=400&width=400",
      after: "/homepage/example0002.jpeg",
      label: "Corporate Style",
    },
    {
      before: "/placeholder.svg?height=400&width=400",
      after: "/homepage/example0003.jpeg",
      label: "Creative Portfolio",
    },
  ]

  useEffect(() => {
    setIsVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - left) / width - 0.5
      const y = (e.clientY - top) / height - 0.5

      containerRef.current.style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Auto-rotate through transformations only when not hovering
    const interval = setInterval(() => {
      if (!isHovering) {
        setActiveIndex((prev) => (prev + 1) % transformations.length)
      }
    }, 3000)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearInterval(interval)
    }
  }, [transformations.length, isHovering])

  return (
    <div
      ref={containerRef}
      className="relative transition-transform duration-200 ease-out"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative h-[400px] w-full md:h-[500px] rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/5 to-primary/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-md">
            {/* Glowing background effect */}
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 opacity-75 blur-xl"></div>

            {/* Main transformation card */}
            <div
              className="relative flex rounded-xl bg-background/90 backdrop-blur-sm shadow-xl overflow-hidden"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`before-${activeIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-1/2 relative"
                >
                  <div className="absolute top-2 left-2 z-10 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full">
                    Before
                  </div>
                  <Image
                    src={transformations[activeIndex].before || "/placeholder.svg"}
                    alt="Before transformation"
                    width={250}
                    height={300}
                    className="h-full w-full object-cover"
                  />

                  {/* Overlay with arrow indicating transformation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, x: 0 }}
                      animate={{ opacity: isHovering ? 0.7 : 0, x: isHovering ? 20 : 0 }}
                      className="bg-primary/20 backdrop-blur-sm rounded-full p-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-foreground"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  key={`after-${activeIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-1/2 relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 z-10 bg-primary/80 text-primary-foreground backdrop-blur-sm text-xs px-2 py-1 rounded-full">
                    After
                  </div>
                  <motion.div
                    animate={{
                      scale: isHovering ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full"
                  >
                    <Image
                      src={transformations[activeIndex].after || "/placeholder.svg"}
                      alt="After transformation"
                      width={250}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>

                  {/* Animated particles effect */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-primary"
                        initial={{
                          x: -10,
                          y: Math.random() * 300,
                          opacity: 0,
                          scale: 0,
                        }}
                        animate={{
                          x: 250,
                          y: Math.random() * 300,
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: Math.random() * 2,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>

                  {/* Radial glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/30 mix-blend-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovering ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Transformation label */}
            <motion.div
              key={`label-${activeIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg"
              style={{ transform: "translateZ(60px) translateX(-50%)" }}
            >
              {transformations[activeIndex].label}
            </motion.div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`float-${i}`}
              className="absolute rounded-full bg-primary/20 backdrop-blur-md"
              style={{
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
              }}
              animate={{
                y: [0, -15, 0],
                x: [0, Math.random() * 10 - 5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {transformations.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex ? "bg-primary w-6" : "bg-primary/30"
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

