import Image from "next/image"
import { Star } from "lucide-react"

export default function TrustBadges() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="flex items-center">
          <Image
            src="/icons/google.png"
            alt="Google Reviews"
            width={24}
            height={24}
            className="mr-2"
          />
          <span className="font-medium">Google Reviews</span>
          <span className="mx-2 font-bold">4.8</span>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <Image src="/icons/trustpilot.png" alt="Trustpilot" width={24} height={24} className="mr-2" />
          <span className="font-medium">Trustpilot</span>
          <span className="mx-2 font-bold">4.7</span>
          <div className="flex text-green-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>
      </div>

      <p className="text-center font-medium">
        <span className="text-muted-foreground">Trusted by over</span> <span className="font-bold">100,000+</span>{" "}
        <span className="text-primary font-bold">professionals</span> <span className="text-muted-foreground">and</span>{" "}
        <span className="text-primary font-bold">teams</span>. <span className="font-bold">5,000,000+</span>{" "}
        <span className="text-muted-foreground">headshots generated to date.</span>
      </p>
    </div>
  )
}

