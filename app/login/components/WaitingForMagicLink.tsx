import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const WaitingForMagicLink = ({
  toggleState,
}: {
  toggleState: () => void;
}) => {
  return (
    <>
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 p-4 rounded-xl max-w-sm w-full">
          <h1 className="text-xl">Check your email to continue</h1>
          <div className="flex flex-col gap-2">
            <p className="text-sm">
              We've emailed you a magic link to access your account.
            </p>
            <p className="text-xs opacity-60">
              Hint: it might be in your spam folder.
            </p>
          </div>
          <div>
            <Button onClick={toggleState} variant="secondary" size="sm">
              <ArrowLeft size={14} />
              Go back
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
