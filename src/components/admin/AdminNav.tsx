"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cx, springSnappy } from "@/lib/motion";

const links = [
  { href: "/admin", label: "概览" },
  { href: "/admin/news", label: "赛事动态" },
  { href: "/admin/qa", label: "Q&A" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="后台导航">
      <ul className="flex items-center gap-1">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <li key={link.href} className="relative">
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "block px-3 py-3 text-[0.875rem] transition-colors duration-300",
                  active ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {link.label}
              </Link>
              {active && (
                <motion.span
                  layoutId="admin-nav"
                  className="absolute inset-x-2 -bottom-px h-px bg-cap"
                  transition={springSnappy}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
