"use client"

import React, { useEffect, useState } from 'react'
import style from './Header.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { Archive, CircleUser } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as UserService from '@/services/UserService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const Header = () => {
    const router = useRouter();
    const { user, setUser } = useUser();
    const userId = user?.id;
    const [ isOpen, setIsOpen ] = useState(false);
    const handleSelectProfile = () => {
        router.push('/signin');
    }
    const queryClient = useQueryClient();

    const { data: currentUser, isLoading } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => UserService.getDetailUser(userId!).then(res => res.data),
        enabled: !!userId,
      });

    const handleSelectCourse = () => {
        router.push('/course');
    }

    const handleBack = () => {
        router.push('/');
    }

    const handleProfile = () => {
        router.push('/profile');
    }

    const handleAccess = () => {
        router.push('/profile');
    }

    const logoutMutation = useMutation({
        mutationFn: () => UserService.logoutUser(),
        onSuccess: () => {
            queryClient.clear()
            if (user) setUser(null)
            router.push('/signin');
        },
        onError: (err) => console.log("error", err),
    })

    return (
        <header className={style.headerContainer}>
            <div className={style.logo} onClick={handleBack}>
                <Link href="/">
                    <Image src="/logo.png" alt='logo' height={50} width={50} />
                </Link>
            </div>
            <NavigationMenu className={style.navMenu}>
                <NavigationMenuList className={style.navList}>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Subjects</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="w-40">
                                <ListItem href="/docs" title="Math">
                                    Math
                                </ListItem>
                                <ListItem href="/docs/installation" title="Physical">
                                    Physical
                                </ListItem>
                                <ListItem href="/docs/primitives/typography" title="Chemistry">
                                    Chemistry
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Tutors</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="w-40">
                                <ListItem href="/docs" title="Math">
                                    Primary School
                                </ListItem>
                                <ListItem href="/docs/installation" title="Physical">
                                    Middle School
                                </ListItem>
                                <ListItem href="/docs/primitives/typography" title="Chemistry">
                                    High School
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>School</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="w-40">
                                <ListItem href="/docs" title="Math">
                                    Primary School
                                </ListItem>
                                <ListItem href="/docs/installation" title="Physical">
                                    Middle School
                                </ListItem>
                                <ListItem href="/docs/primitives/typography" title="Chemistry">
                                    High School
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div className={style.userAction}>
                <div className={style.actionItem} onClick={handleSelectCourse}><Archive />Courses</div>
                <DropdownMenu open={isOpen}>
                    <DropdownMenuTrigger>
                    <div 
                        className={style.actionItem} 
                        onClick={(e) => {
                        if (!user) {
                            e.preventDefault(); // Nếu chưa login -> Chặn mở menu
                            handleSelectProfile(); // Gọi hàm login
                        } else {
                            setIsOpen(!isOpen); // Đã login -> Bật/Tắt menu
                        }
                        }}
                    >
                        <CircleUser />
                        {currentUser ? currentUser?.name || currentUser?.email : "User"}
                    </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="bottom" sideOffset={10} className="w-45">
                        <DropdownMenuGroup>
                        <DropdownMenuItem onClick={handleProfile}>
                            <BadgeCheckIcon />
                            Account
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <CreditCardIcon />
                            Billing
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <BellIcon />
                            Notifications
                        </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onClick={() => logoutMutation.mutate()}
                            disabled={logoutMutation.isPending}>
                        <LogOutIcon />
                        {logoutMutation?.isPending ? "Đang đăng xuất..." : "Sign-out"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink render={<Link href={href}><div className="flex flex-col gap-1 text-sm">
                <div className="leading-none font-medium">{title}</div>
                <div className="line-clamp-2 text-muted-foreground">{children}</div>
            </div></Link>} />
        </li>
    )
}

export default Header