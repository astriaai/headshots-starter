"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface GalleryItem {
  before: string
  after: string
  label: string
}

export default function ThreeDBeforeAfterGallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right
  const containerRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  // Real headshot examples
  const galleryItems: GalleryItem[] = [
    {
      before: "/homepage/before0001.png",
      after: "/homepage/example0001.png",
      label: "Professional Corporate",
    },
    {
      before: "/homepage/before0002.png",
      after: "/homepage/example0002.png",
      label: "Executive Style",
    },
    {
      before: "/homepage/before0001.png",
      after: "/homepage/example0004.png",
      label: "Professional Pattern",
    },
    {
      before: "/homepage/before0001.png",
      after: "/homepage/example0005.png",
      label: "Urban Professional",
    },
    {
      before: "/homepage/before0002.png",
      after: "/homepage/example0006.png",
      label: "Formal Business",
    },
    {
      before: "/homepage/before0002.png",
      after: "/homepage/example0007.png",
      label: "Executive Portrait",
    },
    {
      before: "/homepage/before0001.png",
      after: "/homepage/example0008.png",
      label: "Modern Business",
    },
    {
      before: "/homepage/before0002.png",
      after: "/homepage/example0009.png",
      label: "Formal Event",
    },
  ]

  const nextSlide = () => {
    if (isFlipping) return
    setDirection(1)
    setIsFlipping(true)
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % galleryItems.length)
      setIsFlipping(false)
    }, 600)
  }

  const prevSlide = () => {
    if (isFlipping) return
    setDirection(-1)
    setIsFlipping(true)
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)
      setIsFlipping(false)
    }, 600)
  }

  // 3D effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || isFlipping) return

      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - left) / width - 0.5
      const y = (e.clientY - top) / height - 0.5

      containerRef.current.style.transform = `
        perspective(1000px) 
        rotateY(${x * 5}deg) 
        rotateX(${-y * 5}deg)
      `
    }

    const handleMouseLeave = () => {
      if (!containerRef.current) return
      containerRef.current.style.transform = `
        perspective(1000px) 
        rotateY(0deg) 
        rotateX(0deg)
      `
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      container.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [isFlipping])

  // Autoplay
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      if (!isFlipping) {
        nextSlide()
      }
    }, 5000)

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [isFlipping])

  return (
    <div className="relative mx-auto max-w-4xl py-10">
      <div
        ref={containerRef}
        className="relative h-[550px] w-full transition-transform duration-300 ease-out"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-3xl">

            {/* Main card container */}
            <div className="relative flex h-[500px] md:h-[550px] rounded-xl bg-background/90 backdrop-blur-sm shadow-xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`container-${activeIndex}`}
                  className="flex w-full"
                  initial={{
                    rotateY: direction * 90,
                    opacity: 0,
                  }}
                  animate={{
                    rotateY: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotateY: direction * -90,
                    opacity: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    opacity: { duration: 0.2 },
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Before image */}
                  <div className="w-1/2 relative">
                    <div className="absolute top-2 left-2 z-10 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full">
                      Before
                    </div>
                    <div className="h-full w-full overflow-hidden">
                      <Image
                        src={galleryItems[activeIndex].before || "/placeholder.svg"}
                        alt={`Before ${galleryItems[activeIndex].label}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Overlay with arrow */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 0.7 }}
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
                  </div>

                  {/* After image */}
                  <div className="w-1/2 relative overflow-hidden">
                    <div className="absolute top-2 right-2 z-10 bg-primary/80 text-primary-foreground backdrop-blur-sm text-xs px-2 py-1 rounded-full">
                      After
                    </div>
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="h-full w-full"
                    >
                      <Image
                        src={galleryItems[activeIndex].after || "/placeholder.svg"}
                        alt={`After ${galleryItems[activeIndex].label}`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    {/* AI Generated badge */}
                    <div className="absolute bottom-2 right-2 rounded-full bg-primary px-3 py-1 text-xs text-white">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-white"></span>
                        AI Generated
                      </span>
                    </div>
                  </div>
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
            >
              {galleryItems[activeIndex].label}
            </motion.div>
          </div>
        </div>

      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-md hover:bg-white transition-all hover:scale-110"
        aria-label="Previous slide"
        disabled={isFlipping}
      >
        <ChevronLeft className={cn("h-6 w-6", isFlipping && "opacity-50")} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-md hover:bg-white transition-all hover:scale-110"
        aria-label="Next slide"
        disabled={isFlipping}
      >
        <ChevronRight className={cn("h-6 w-6", isFlipping && "opacity-50")} />
      </button>

      {/* Indicators */}
      <div className="mt-8 flex justify-center gap-2">
        {galleryItems.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isFlipping) return
              setDirection(index > activeIndex ? 1 : -1)
              setIsFlipping(true)
              setTimeout(() => {
                setActiveIndex(index)
                setIsFlipping(false)
              }, 600)
            }}
            className={`h-2 transition-all ${
              index === activeIndex ? "w-8 bg-primary" : "w-2 bg-gray-300"
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
            disabled={isFlipping}
          />
        ))}
      </div>
    </div>
  )
}

