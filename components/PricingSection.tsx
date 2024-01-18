import Link from "next/link";
import { Button } from "./ui/button";

export default function PricingSection() {
  return (
    <div className="w-full max-w-6xl p-8 mt-16 mb-16 space-y-8 rounded-lg">
      <h2 className="mb-8 text-3xl font-bold text-center">Pricing</h2>
      <div className="flex flex-wrap items-stretch justify-center space-y-4 lg:space-x-4 lg:space-y-0">
        {pricingOptions.map((option, index) => (
          <div
            key={index}
            className={`flex flex-col border rounded-lg p-4 w-full lg:w-1/4 ${option.bgColor}`}
          >
            <div className="flex-grow space-y-4">
              <h3 className="text-2xl font-semibold text-center">
                {option.title}
              </h3>
              <p className="mb-2 text-xl font-bold text-center">
                {option.price}
              </p>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                {option.description}
              </p>
              <ul className="pl-4 mb-4 space-y-2">
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
    bgColor: "bg-white dark:bg-gray-800",
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
    bgColor: "bg-blue-50 dark:bg-gray-700",
  },
  {
    title: "Premium",
    price: "5 Credits",
    description: "The best value with unlimited possibilities.",
    features: [
      "20 AI Headshots",
    ],
    buttonText: "Choose Premium",
    bgColor: "bg-white dark:bg-gray-800",
  },
];
