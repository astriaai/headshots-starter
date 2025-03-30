import { Badge } from "@/components/ui/badge"
import FAQAccordion from "@/components/homepage/faq-section"

export default function FAQSection() {
  return (
    <section id="faq" className="py-10 md:py-22">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <Badge variant="outline" className="mb-2">
            FAQ
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Everything you need to know about our AI headshot service.
          </p>
        </div>
        <div className="mt-16">
          <FAQAccordion />
        </div>
      </div>
    </section>
  )
}