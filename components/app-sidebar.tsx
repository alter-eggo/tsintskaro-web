"use client";

import * as React from "react";
import {
  House,
  Users,
  History,
  Users2,
  Image,
  BookOpen,
  Languages,
} from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

const navigation: {
  name: string;
  href: string;
  icon: typeof House;
  children?: { name: string; href: string }[];
}[] = [
  { name: "Главная", href: "/", icon: House },
  {
    name: "История",
    href: "/history",
    icon: History,
    children: [{ name: "Люди и судьбы", href: "/history/people" }],
  },
  { name: "Культура и досуг", href: "/gallery", icon: Image },
  { name: "Общество", href: "/society", icon: Users2 },
  { name: "Обычаи и традиции", href: "/traditions", icon: BookOpen },
  { name: "Фамилии", href: "/families", icon: Users },
  {
    name: "Язык",
    href: "/language",
    icon: Languages,
    children: [
      { name: "Материалы для изучения", href: "/language/materials" },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpenMobile, isMobile } = useSidebar();
  const pathname = usePathname();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" onClick={handleNavClick}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20">
                  <span className="text-lg font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                    Ц
                  </span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Цинцкаро</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Мы вместе!
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const active =
                  isActive(item.href) &&
                  !item.children?.some((child) => isActive(child.href));

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.name}
                      className={`transition-colors ${
                        active
                          ? "text-primary bg-primary/10"
                          : "text-foreground/60 hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <Link
                        href={item.href}
                        onClick={handleNavClick}
                        aria-current={active ? "page" : undefined}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.children ? (
                      <SidebarMenuSub>
                        {item.children.map((child) => (
                          <SidebarMenuSubItem key={child.href}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(child.href)}
                              className="h-auto min-h-9 py-2 [&>span:last-child]:whitespace-normal"
                            >
                              <Link
                                href={child.href}
                                onClick={handleNavClick}
                                aria-current={
                                  isActive(child.href)
                                    ? pathname === child.href
                                      ? "page"
                                      : "location"
                                    : undefined
                                }
                              >
                                <span>{child.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
