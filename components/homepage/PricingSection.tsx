import { Badge } from "@/components/ui/badge"
import ModernPricing from "@/components/homepage/modern-pricing"

export default function PricingSection() {
  return (
    <section id="pricing" className="border-t py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <Badge variant="outline" className="mb-2">
            Pricing
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Professional-grade headshots for <span className="text-primary">a fraction</span> of the cost
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Professional photographers charge $200-$500 for a session. Our AI creates stunning headshots for much less.
          </p>
        </div>
        <div className="mt-16">
          <ModernPricing />
        </div>
      </div>
    </section>
  )
}