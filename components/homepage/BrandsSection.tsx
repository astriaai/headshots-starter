import CompanyLogos from "@/components/homepage/company-logos"

export default function BrandsSection() {
  return (
    <section className="border-y bg-muted/40 py-10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-xl font-medium text-muted-foreground">Trusted by professionals from</h2>
          <CompanyLogos />
        </div>
      </div>
    </section>
  )
}