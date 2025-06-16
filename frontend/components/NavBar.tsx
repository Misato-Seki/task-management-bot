import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu"

export default function NavBar() {
    return (
        <nav
            className="w-full flex items-center justify-between bg-[#5093B4] px-[20px] py-[10px]"
            style={{ minHeight: 44 }}
        >
            <span
                className="text-white font-semibold text-[24px] leading-[1.2] tracking-[-0.02em] font-inter"
            >
                TaskBot
            </span>
            <NavigationMenu viewport={false}>
                <NavigationMenuList className="gap-[30px]">
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/" className="text-white hover:text-[#5093B4] text-base font-medium">Home</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/dashboard" className="text-white hover:text-[#5093B4] text-base font-medium">Dashboard</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="#" className="text-white hover:text-[#5093B4] text-base font-medium">Profile</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </nav>
    )
}