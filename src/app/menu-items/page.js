'use client'

import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MenuItemsPage() {
    const { loading, data } = useProfile();
    const [menuItems, setMenuItems] = useState([])

    useEffect(() => {
        fetch('/api/menu-items').then(res => {
            res.json().then(data => {
                setMenuItems(data)
            })
        })
    }, [])

    if (loading) {
        return 'Loading user info...';
    }

    if (!data.admin) {
        return 'Not an admin';
    }

    return (
        <section className="mt-8 max-w-2xl mx-auto">
            <UserTabs isAdmin={true} />
            <div className="mt-8">
                <Link href={'/menu-items/new'} className="button flex justify-center gap-2 items-center">
                    Create new menu item
                    <Right />
                </Link>
            </div>
            <div>
                <h2 className="text-sm text-gray-500 mt-8">Edit menu item:</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {menuItems?.length > 0 && menuItems.map(item => (
                        <Link
                            key={item._id}
                            href={'/menu-items/edit/' + item._id}
                            className="bg-gray-200 rounded-lg p-4"
                        >
                            <div className="relative">
                                <Image
                                    className="rounded-md"
                                    src={item.image} alt={'Menu item'} width={200} height={200} />
                            </div>
                            <div className="text-center align-bottom">
                                {item.name}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
