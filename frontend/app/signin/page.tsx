import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F7F8]">
      <div className="w-[410px] bg-white rounded-lg shadow-lg border border-[#5093B4] p-10 flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-[#5093B4] mb-2">Account</h1>
        <Input type="text" placeholder="Firstname" className="border border-[#A2D2E2] bg-white text-base px-4 py-3 rounded-md" />
        <Input type="text" placeholder="Lastname" className="border border-[#A2D2E2] bg-white text-base px-4 py-3 rounded-md" />
        <Input type="email" placeholder="Email" className="border border-[#A2D2E2] bg-white text-base px-4 py-3 rounded-md" />
        <Input type="password" placeholder="Password" className="border border-[#A2D2E2] bg-white text-base px-4 py-3 rounded-md" />
        <div className="flex flex-col gap-2 mt-4">
          <Button className="rounded-xl h-10 text-white bg-[#5093B4] hover:bg-[#5093B4]/90">Sign In</Button>
          <Button className="rounded-xl h-10 text-white bg-[#5093B4] hover:bg-[#5093B4]/90">Register</Button>
          <Button className="rounded-xl h-10 text-white bg-[#5093B4] hover:bg-[#5093B4]/90">Connect Google Account</Button>
        </div>
      </div>
    </div>
  );
}