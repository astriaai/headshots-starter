import Image from "next/image"

export default function CompanyLogos() {
const companies = [
  { name: "Google", logo: "/logos/google.svg" },
  { name: "Microsoft", logo: "/logos/microsoft.svg" },
  { name: "Amazon", logo: "/logos/amazon.svg" },
  { name: "Meta", logo: "/logos/meta.svg" },
  { name: "LinkedIn", logo: "/logos/linkedin.png" },
];

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
      {companies.map((company) => (
        <div key={company.name} className="flex flex-col items-center">
          <Image
            src={company.logo || "/placeholder.svg"}
            alt={company.name}
            width={100}
            height={40}
            className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
          />
        </div>
      ))}
    </div>
  )
}


