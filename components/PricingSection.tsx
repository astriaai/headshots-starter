import Link from "next/link";
import { Button } from "./ui/button";

export default function PricingSection() {
  return (
    <div className="w-full max-w-6xl mt-16 mb-16 p-8 rounded-lg space-y-8">
      <h2 className="text-3xl font-bold text-center mb-8">Pricing</h2>
      <div className="flex flex-wrap justify-center lg:space-x-4 space-y-4 lg:space-y-0 items-stretch">
        {pricingOptions.map((option, index) => (
          <div
            key={index}
            className={`flex flex-col border rounded-lg p-4 w-full lg:w-1/4 ${option.bgColor}`}
          >
            <div className="flex-grow space-y-4">
              <h3 className="text-2xl font-semibold text-center">
                {option.title}
              </h3>
              <p className="text-xl font-bold text-center mb-2">
                {option.price}
              </p>
              <p className="text-sm text-gray-600 text-center">
                {option.description}
              </p>
              <ul className="space-y-2 mb-4 pl-4">
                {option.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center space-x-2">
                    <span className="text-green-500">✔</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 text-center">
              <Link href="/login">
                {" "}
                <Button className="w-3/4">{option.buttonText}</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const pricingOptions = [
  {
    title: "Starter",
    price: "1 Credit",
    description:
      "Perfect for individuals looking to enhance their online presence.",
    features: [
      "4 AI Headshots",
    ],
    buttonText: "Choose Starter",
    bgColor: "bg-white",
  },
  {
    title: "Basic",
    price: "3 Credits",
    description:
      "Ideal for professionals requiring frequent updates to their profiles.",
    features: [
      "12 AI Headshots",
    ],
    buttonText: "Choose Basic",
    bgColor: "bg-blue-50",
  },
  {
    title: "Premium",
    price: "5 Credits",
    description: "The best value with unlimited possibilities.",
    features: [
      "20 AI Headshots",
    ],
    buttonText: "Choose Premium",
    bgColor: "bg-white",
  },
];
