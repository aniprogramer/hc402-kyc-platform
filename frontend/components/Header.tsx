import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import InstallButton from "@/components/InstallButton";

export default function Header() {
    return (
        <header className="border-b bg-white px-4 py-2 flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-600">HC-402 KYC</h1>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/">Home</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/dashboard">Dashboard</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <InstallButton/>
        </header>
    );
}