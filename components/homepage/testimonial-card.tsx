"use client"

import { motion, useInView } from "motion/react"
import { useRef } from "react"
import Image from "next/image"
import { Quote } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  avatarUrl: string
}

export default function TestimonialCard({ quote, author, role, avatarUrl }: TestimonialCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Quote className="h-5 w-5" />
      </div>
      <p className="mb-4 text-muted-foreground">{quote}</p>
      <div className="flex items-center gap-4">
        <Image
          src={avatarUrl || "/placeholder.svg"}
          alt={author}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <h4 className="text-sm font-medium">{author}</h4>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  )
}

