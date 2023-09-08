"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaFemale, FaMale, FaRainbow } from "react-icons/fa";

export function ModelTypeSelector() {
  return (
    <RadioGroup defaultValue="man" className="grid grid-cols-3 gap-4">
      <div>
        <RadioGroupItem
          value="man"
          id="man"
          className="peer sr-only"
          aria-label="man"
        />
        <Label
          htmlFor="man"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <FaMale className="mb-3 h-6 w-6" />
          Man
        </Label>
      </div>

      <div>
        <RadioGroupItem
          value="woman"
          id="woman"
          className="peer sr-only"
          aria-label="woman"
        />
        <Label
          htmlFor="woman"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <FaFemale className="mb-3 h-6 w-6" />
          Woman
        </Label>
      </div>
      <div>
        <RadioGroupItem
          value="person"
          id="person"
          className="peer sr-only"
          aria-label="person"
        />
        <Label
          htmlFor="person"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <FaRainbow className="mb-3 h-6 w-6" />
          Unisex
        </Label>
      </div>
    </RadioGroup>
    //   </CardContent>
    //   <CardFooter>
    //     <Button className="w-full">Continue</Button>
    //   </CardFooter>
    // </Card>
  );
}
