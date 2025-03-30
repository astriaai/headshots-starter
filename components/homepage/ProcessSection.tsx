import { Camera, Download, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import AnimatedProcessStep from "@/components/homepage/animated-process-step"

const processSteps = [
  {
    number: 1,
    title: "Upload Your Photos",
    description: "Simply upload your best selfies and let our AI do the magic",
    animationType: "upload" as const,
    icon: <Camera className="h-5 w-5" />
  },
  {
    number: 2,
    title: "Our AI Gets to Work",
    description: "The AI magic takes ~20 minutes. You'll get an email when it's ready!",
    animationType: "sparkles" as const,
    icon: <Sparkles className="h-5 w-5" />
  },
  {
    number: 3,
    title: "Get Amazing Headshots",
    description: "Once your model is trained, we'll give you amazing headshots!",
    animationType: "download" as const,
    icon: <Download className="h-5 w-5" />
  }
]

export default function ProcessSection() {
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
          {processSteps.map((step) => (
            <AnimatedProcessStep
              key={step.number}
              {...step}
            />
          ))}
        </div>
      </div>
    </section>
  )
}