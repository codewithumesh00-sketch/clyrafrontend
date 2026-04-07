"use client";

type FooterLink = {
  label: string;
  href: string;
};

type Props = {
  brand?: string;
  description?: string;
  links?: FooterLink[];
  copyright?: string;
};

export default function Footer({
  brand = "ClyraUI",
  description = "AI-generated websites with premium layouts, reusable blocks, and lightning-fast rendering.",
  links = [
    { label: "Home", href: "#" },
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Contact", href: "#" },
  ],
  copyright = `© ${new Date().getFullYear()} ClyraUI. All rights reserved.`,
}: Props) {
  return (
    <footer className="bg-black text-white py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Top */}
        <div className="grid md:grid-cols-2 gap-10 pb-10 border-b border-gray-800">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold">{brand}</h2>
            <p className="text-gray-400 mt-4 leading-7 max-w-md">
              {description}
            </p>
          </div>

          {/* Links */}
          <div className="flex md:justify-end gap-6 flex-wrap">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-gray-300 hover:text-white transition"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 text-sm text-gray-500">
          {copyright}
        </div>
      </div>
    </footer>
  );
}