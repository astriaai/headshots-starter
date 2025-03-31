"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "motion/react"
import { Camera, Download, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const processSteps = [
  {
    number: 1,
    title: "Upload Your Photos",
    description: "Upload 4+ high-quality selfies: front facing, 1 person in frame, no glasses or hats.",
    icon: <Camera className="h-5 w-5" />,
    images: ["/example1.png", "/example2.png", "/example3.png"]
  },
  {
    number: 2,
    title: "Our AI Gets to Work",
    description: "The AI magic takes ~20 minutes. You'll get an email when it's ready!",
    icon: <Sparkles className="h-5 w-5" />,
    processingImage: "/blur.png"
  },
  {
    number: 3,
    title: "Get Amazing Headshots",
    description: "Once your model is trained, we'll give you amazing headshots!",
    icon: <Download className="h-5 w-5" />,
    resultImages: ["/result1.png", "/result2.png", "/result3.png"]
  }
]

function ProcessStep({ step, isActive, index }: { step: typeof processSteps[0], isActive: boolean, index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const renderVisual = () => {
    if (index === 0) {
      return (
        <div className="grid grid-cols-3 gap-2 p-4">
          {step.images?.map((img, i) => (
            <motion.div
              key={`upload-${i}`}
              className="aspect-square rounded-lg overflow-hidden bg-muted"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 10 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <img src={img} alt="Upload example" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      )
    }

    if (index === 1) {
      return (
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0.5 }}
        >
          <img src={step.processingImage} alt="AI processing" className="rounded-lg w-full" />
          {isInView && (
            <motion.div 
              className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-lg"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </motion.div>
          )}
        </motion.div>
      )
    }

    return (
      <div className="grid grid-cols-3 gap-2 p-4">
        {step.resultImages?.map((img, i) => (
          <motion.div
            key={`result-${i}`}
            className="aspect-square rounded-lg overflow-hidden bg-muted"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0.5, scale: 0.95 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <img src={img} alt="Result example" className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className={cn(
        "group flex flex-col items-center text-center",
        "rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md",
        isActive && "border-primary"
      )}
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-2 ring-primary/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {step.number}
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-transform duration-200 group-hover:scale-110">
          {step.icon}
        </div>
      </div>

      {renderVisual()}

      <div className="mt-6 space-y-2">
        <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
        <p className="text-sm text-muted-foreground">{step.description}</p>
      </div>
    </motion.div>
  )
}

export default function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <Badge variant="outline" className="mb-2">
            Simple Process
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Our AI-powered platform transforms your selfies into professional headshots in just three simple steps.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-12">
          {processSteps.map((step, index) => (
            <ProcessStep
              key={step.number}
              step={step}
              isActive={activeStep === index}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
