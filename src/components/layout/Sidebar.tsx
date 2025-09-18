"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BarChart2, Star } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Market Overview", href: "/", icon: BarChart2 },
    { name: "Favorites", href: "/favorites", icon: Star },
  ];

  return (
    <aside className="w-64 flex flex-col border-r border-slate-800">
      {/* Logo */}
      <div className="flex items-center justify-center font-bold mb-12 mt-2">
        <Image src={"/nc-mascot.png"} alt="Picture of NC mascot" width={45} height={45} />
        <p className="text-xl">NextCoin</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {links.map(({ name, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-2 transition-colors ${
                active
                  ? "bg-blue-900 border border-blue-600"
                  : "text-gray-500 hover:bg-blue-900 hover:border hover:border-blue-600"
              }`}
            >
              <Icon size={20} />
              {name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
