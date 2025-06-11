"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

export default function Unauthorized() {
    const router = useRouter();
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <SentimentVeryDissatisfiedIcon sx={{fontSize: 200, color: "#5093B4"}}/>
        <p className="text-lg text-gray-700 mb-6">
          You do not have permission to access this page.
        </p>
        <div onClick={() => router.push("/")} className="cursor-pointer">
        <Button variant="taskbotBlue" >
          Back to Home
        </Button>
        </div>
      </div>
    </section>
  );
}