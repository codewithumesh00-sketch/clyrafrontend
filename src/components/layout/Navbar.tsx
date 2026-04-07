"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useMemo, useState } from "react";

type NavbarProps = {
  logo?: string;
  links?: string[];
  pages?: { page: string }[];
  ctaText?: string;
};

export default function Navbar({
  logo = "ClyraUI",
  links,
  pages = [],
  ctaText = "Start Free",
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const finalLinks = useMemo(() => {
    if (pages.length > 0) {
      return pages.map((p) =>
        p.page.charAt(0).toUpperCase() + p.page.slice(1)
      );
    }

    return (
      links || ["Home", "Features", "Pricing", "About", "Contact"]
    );
  }, [pages, links]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold tracking-tight text-white"
        >
          {logo}
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {finalLinks.map((link) => (
            <Link
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <button className="rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-105">
            {ctaText}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 px-6 py-4">
          <div className="flex flex-col gap-4">
            {finalLinks.map((link) => (
              <Link
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-zinc-300 hover:text-white"
              >
                {link}
              </Link>
            ))}

            <button className="mt-4 rounded-xl bg-white px-4 py-2 font-semibold text-black">
              {ctaText}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}