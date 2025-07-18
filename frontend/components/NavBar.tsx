import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuTrigger,
    NavigationMenuContent
} from "@/components/ui/navigation-menu"
import { Menu, LogOut } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function NavBar() {
    const router = useRouter()

    const handleLogout = async() => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/logout`, {
            method: "POST",
            credentials: "include"
        })
        router.push('/')
    }
    return (
        <nav
            className="relative flex items-center justify-between bg-[#5093B4] px-[20px] py-[10px]"
            style={{ minHeight: 44 }}
        >
            {/* Logo */}
            <Link href='/' className="">
                <span
                    className="text-white font-semibold text-[24px] leading-[1.2] tracking-[-0.02em] font-inter"
                >
                    TaskBot
                </span>
            </Link>

            {/* Desktop Menu */}
            <NavigationMenu viewport={false} className="hidden md:flex">
                <NavigationMenuList className="gap-3">
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/" className="text-white hover:text-[#5093B4] text-base font-medium">Home</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/dashboard" className="text-white hover:text-[#5093B4] text-base font-medium">Dashboard</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/task" className="text-white hover:text-[#5093B4] text-base font-medium">Task</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem onClick={handleLogout} className="cursor-pointer">
                        <NavigationMenuLink className="flex items-center justify-center" style={{ minHeight: 36 }}>
                            <LogOut
                                className="text-white hover:text-[#5093B4] transition-colors duration-200"
                            />
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    
                </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Menu */}
            <NavigationMenu className="flex md:hidden">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-[#5093B4]">
                            <Menu color="white"/>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="">
                            <NavigationMenuLink href="/" className="text-[#5093B4] hover:text-[#A2D2E2] text-base font-medium">Home</NavigationMenuLink>
                            <NavigationMenuLink href="/dashboard" className="text-[#5093B4] hover:text-[#A2D2E2] text-base font-medium">Dashboard</NavigationMenuLink>
                            <NavigationMenuLink href="/task" className="text-[#5093B4] hover:text-[#A2D2E2] text-base font-medium">Task</NavigationMenuLink>
                            <NavigationMenuLink onClick={handleLogout} style={{ minHeight: 36 }}>
                            <LogOut
                                className="text-[#5093B4] hover:text-[#A2D2E2] transition-colors duration-200"
                            />
                        </NavigationMenuLink>
                        </NavigationMenuContent>

                    </NavigationMenuItem>
                    
                </NavigationMenuList>

            </NavigationMenu>
        </nav>
    )
}