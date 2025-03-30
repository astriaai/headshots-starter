"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown } from "lucide-react"

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
  index: number
}

function FAQItem({ question, answer, isOpen, onClick, index }: FAQItemProps) {
  return (
    <motion.div
      className="border-b last:border-b-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:text-primary"
      >
        <span>{question}</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-muted-foreground">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How does AI headshot generation work?",
      answer:
        "Our AI technology analyzes your uploaded selfies to understand your facial features, expressions, and style. It then generates professional headshots that maintain your likeness while enhancing quality, lighting, and background. The entire process takes about 20 minutes from upload to delivery.",
    },
    {
      question: "What kind of photos should I upload?",
      answer:
        "For best results, upload at least 4 high-quality selfies with good lighting. Photos should be front-facing with only one person in the frame. Avoid wearing glasses or hats, and try to capture different expressions and angles for more variety in your results.",
    },
    {
      question: "Can I use these headshots professionally?",
      answer:
        "All our plans include commercial usage rights. You can use your AI-generated headshots for LinkedIn profiles, company websites, social media, resumes, portfolios, and any other professional purpose.",
    },
    {
      question: "How many different styles can I get?",
      answer:
        "The number of styles depends on your plan. Basic and Premium plans include multiple style options such as professional, corporate, creative, casual, and industry-specific looks. You can preview all available styles before making your final selection.",
    },
    {
      question: "What if I'm not satisfied with the results?",
      answer:
        "We stand behind our AI technology and want you to be completely satisfied. If you're not happy with your headshots, contact our support team within 7 days of delivery, and we'll work with you to improve the results or provide a refund.",
    },
    {
      question: "How quickly will I receive my headshots?",
      answer:
        "Standard processing time is approximately 20 minutes. Premium plan users receive priority processing. Once your headshots are ready, you'll receive an email notification with a link to view and download your images.",
    },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto">
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
          index={index}
        />
      ))}
    </div>
  )
}

