"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@mui/icons-material/Google";

// import { useRouter } from 'next/navigation'
export default function Home() {
  // const router = useRouter();
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] h-screen w-full bg-[#F1F7F8] md:flex-row">
      {/* Hero Image */}
      <div className="flex justify-center items-center h-1/2 md:h-screen w-full md:w-1/2 bg-[#5093B4] py-[70px] md:py-[166px] px-4 md:px-[70px]">
        <div className="relative w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px]">
          <Image
            src="/assets/ellipse-bg.png"
            alt="Ellipse background"
            fill
            className="object-cover rounded-full"
            priority
          />
        </div>
      </div>
      {/* Hero Text */}
      <div className="flex flex-col flex-1 items-center justify-center gap-4">
        <h1 className="text-[2.5rem] sm:text-[4rem] md:text-[4.5rem] font-bold text-[#5093B4] leading-tight tracking-tight font-sans">
          TaskBot
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl font-normal text-[#69B9D8] font-sans">
          productivity hub
        </p>
        <a href={`${process.env.NEXT_PUBLIC_API_URL}`} className="w-full">
          <Button variant="taskbotBlue"><GoogleIcon/>Login with Google</Button>
        </a>
      </div>
    </section>
  );
}
