"use client";

import React, { useState, useEffect, useMemo } from "react";
import Script from "next/script";
import {
  useWebsiteBuilderStore,
  useRegionValue,
} from "@/store/useWebsiteBuilderStore";
import { useThemeStore } from "@/store/useThemeStore";

// ─────────────────────────────────────────────────────────────
// 📦 TEMPLATE META
// ─────────────────────────────────────────────────────────────
export const template2Meta = {
  id: "ecommerce/nova",
  name: "Nova - Modern Ecommerce",
  description: "Minimalist, media-forward ecommerce template inspired by Shopify Dawn",
  image: "https://images.unsplash.com/photo-1472851294608-41551b116d4e?q=80&w=1600&auto=format&fit=crop",
  type: "ecommerce",
  pages: ["home", "shop", "product", "cart", "contact"],
};

type TemplateProps = {
  editableData?: any;
  isPublished?: boolean;
};

// ─────────────────────────────────────────────────────────────
// 🔧 UTILITIES
// ─────────────────────────────────────────────────────────────
const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

// Mock product data (replace with API in production)
const MOCK_PRODUCTS = [
  {
    id: "1",
    title: "Minimalist Watch",
    price: 149.99,
    compareAtPrice: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop",
    ],
    description: "Crafted with precision. A timeless piece for the modern individual.",
    variants: [
      { id: "v1", name: "Silver / Leather", price: 149.99, available: true },
      { id: "v2", name: "Gold / Leather", price: 169.99, available: true },
      { id: "v3", name: "Black / Steel", price: 159.99, available: false },
    ],
    colors: ["#C0C0C0", "#FFD700", "#1a1a1a"],
    rating: 4.8,
    reviews: 124,
    tags: ["accessories", "watches", "bestseller"],
  },
  {
    id: "2",
    title: "Organic Cotton Tee",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop"],
    description: "Sustainably sourced, incredibly soft. Your new everyday essential.",
    variants: [
      { id: "v1", name: "S / White", price: 39.99, available: true },
      { id: "v2", name: "M / White", price: 39.99, available: true },
      { id: "v3", name: "L / Black", price: 39.99, available: true },
    ],
    colors: ["#ffffff", "#1a1a1a", "#8B7355"],
    rating: 4.9,
    reviews: 289,
    tags: ["apparel", "sustainable", "new"],
  },
  {
    id: "3",
    title: "Leather Crossbody Bag",
    price: 219.99,
    compareAtPrice: 279.99,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop"],
    description: "Handcrafted Italian leather. Functional elegance for every occasion.",
    variants: [
      { id: "v1", name: "Tan", price: 219.99, available: true },
      { id: "v2", name: "Black", price: 219.99, available: true },
    ],
    colors: ["#8B7355", "#1a1a1a"],
    rating: 4.7,
    reviews: 86,
    tags: ["bags", "leather", "featured"],
  },
  {
    id: "4",
    title: "Ceramic Pour-Over Set",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1514469858885-1b7a3a7de68f?w=600&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1514469858885-1b7a3a7de68f?w=600&auto=format&fit=crop"],
    description: "Elevate your morning ritual. Artisan-crafted ceramic for the perfect brew.",
    variants: [
      { id: "v1", name: "Matte White", price: 89.99, available: true },
      { id: "v2", name: "Sage Green", price: 89.99, available: false },
    ],
    colors: ["#f5f5f5", "#9CAF88"],
    rating: 4.6,
    reviews: 52,
    tags: ["home", "kitchen", "gift"],
  },
  {
    id: "5",
    title: "Wireless Earbuds Pro",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop"],
    description: "Immersive sound, all-day battery. Engineered for the discerning listener.",
    variants: [
      { id: "v1", name: "White", price: 179.99, available: true },
      { id: "v2", name: "Black", price: 179.99, available: true },
    ],
    colors: ["#ffffff", "#1a1a1a"],
    rating: 4.5,
    reviews: 312,
    tags: ["tech", "audio", "bestseller"],
  },
  {
    id: "6",
    title: "Linen Throw Blanket",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1581539250439-c9745c6c8e8b?w=600&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1581539250439-c9745c6c8e8b?w=600&auto=format&fit=crop"],
    description: "Breathable, luxurious linen. Cozy comfort that gets softer with every wash.",
    variants: [
      { id: "v1", name: "Natural", price: 129.99, available: true },
      { id: "v2", name: "Charcoal", price: 129.99, available: true },
    ],
    colors: ["#E8DCC4", "#36454F"],
    rating: 4.9,
    reviews: 178,
    tags: ["home", "textiles", "new"],
  },
];

// ─────────────────────────────────────────────────────────────
// 🎨 MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Template2({ editableData, isPublished = false }: TemplateProps) {
  // ─── State Management ───
  const [activePage, setActivePage] = useState("home");
  const [cart, setCart] = useState<{ id: string; quantity: number; variant?: string }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { theme } = useThemeStore();
  const storeUpdateRegion = useWebsiteBuilderStore((state: any) => state.updateRegion);
  const updateRegion = isPublished ? () => { } : storeUpdateRegion;
  const storeEndpoint = useWebsiteBuilderStore(
    (state: any) => state.schema?.editableData?.formspreeEndpoint
  );
  const formspreeEndpoint = isPublished
    ? editableData?.formspreeEndpoint
    : storeEndpoint || editableData?.formspreeEndpoint;

  // ─── Cart Functions ───
  const addToCart = (productId: string, variantId?: string, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId && item.variant === variantId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId && item.variant === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: productId, variant: variantId, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === productId && item.variant === variantId))
    );
  };

  const updateCartQuantity = (productId: string, variantId: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.variant === variantId ? { ...item, quantity } : item
      )
    );
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === item.id);
      const variant = product?.variants?.find((v) => v.id === item.variant);
      const price = variant?.price || product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // ─── Filtered & Sorted Products ───
  const filteredProducts = useMemo(() => {
    let products = [...MOCK_PRODUCTS];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t: string) => t.toLowerCase().includes(query))
      );
    }

    // Tag filters
    if (selectedFilters.length > 0) {
      products = products.filter((p) =>
        selectedFilters.some((filter) => p.tags.includes(filter))
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        products.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
        products.reverse();
        break;
      default:
        // featured: products with compareAtPrice or "bestseller" tag first
        products.sort((a, b) => {
          const aScore = (a.compareAtPrice ? 1 : 0) + (a.tags.includes("bestseller") ? 1 : 0);
          const bScore = (b.compareAtPrice ? 1 : 0) + (b.tags.includes("bestseller") ? 1 : 0);
          return bScore - aScore;
        });
    }

    return products;
  }, [searchQuery, selectedFilters, sortBy]);

  // ─── 🖼️ IMAGE UPLOAD HANDLER (Editor-only) ───
  const handleImageUpload = (regionKey: string) => {
    if (isPublished) return;
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("clyraweb-open-image-upload", { detail: { regionKey } })
      );
    }
  };

  // ─── ✏️ EDITABLE TEXT COMPONENT ───
  const EditableText = ({
    regionKey,
    fallback,
    as: Tag = "span",
    className = "",
    ...props
  }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);

    if (isPublished) {
      const content = dataValue ?? fallback;
      return (
        <Tag className={className} {...props}>
          {content}
        </Tag>
      );
    }

    const content = hookValue ?? dataValue ?? fallback;
    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        onBlur={(e: React.FocusEvent<HTMLElement>) => {
          const val = e.currentTarget.innerText;
          if (val !== content) updateRegion(regionKey, val);
        }}
        onDoubleClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          (e.currentTarget as HTMLElement).focus();
        }}
        className={`focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition-all ${className}`}
        {...props}
      >
        {content}
      </Tag>
    );
  };

  // ─── 🖼️ EDITABLE IMAGE COMPONENT ───
  const EditableImg = ({
    regionKey,
    fallback,
    className = "",
    alt = "image",
    style = {},
    ...props
  }: any) => {
    const hookValue = useRegionValue(regionKey);
    const dataValue = getNestedValue(editableData, regionKey);

    if (isPublished) {
      const src = dataValue ?? fallback;
      return <img src={src} alt={alt} style={style} className={className} {...props} />;
    }

    const src = hookValue ?? dataValue ?? fallback;
    return (
      <img
        src={src}
        alt={alt}
        style={style}
        className={`cursor-pointer transition-opacity hover:opacity-90 ${className}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleImageUpload(regionKey);
        }}
        {...props}
      />
    );
  };

  // ─── 📦 SECTION LAYOUT ───
  const Section = ({ children, id, bgType = "primary", className = "" }: any) => (
    <section
      id={id}
      style={{
        padding: `${theme.sectionSpacing}px 24px`,
        backgroundColor: bgType === "primary" ? theme.backgroundColor : theme.secondaryColor,
        color: theme.textColor,
      }}
      className={`w-full flex justify-center overflow-hidden ${className}`}
    >
      <div className="w-full max-w-7xl">{children}</div>
    </section>
  );

  // ─── 🧭 NAVBAR (Sticky Header - Dawn-inspired) ───
  const Navbar = () => (
    <nav
      className="sticky top-0 w-full z-50 backdrop-blur-md border-b transition-all"
      style={{
        backgroundColor: `${theme.backgroundColor}E6`,
        borderColor: `${theme.textColor}15`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          <EditableImg
            regionKey="global.logo"
            fallback="https://images.unsplash.com/photo-1549463591-14cc5bd1f008?w=100&h=100&fit=crop"
            className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg flex-shrink-0"
          />
          <EditableText
            regionKey="global.brand"
            fallback="Nova"
            className="font-bold text-lg sm:text-xl tracking-tight whitespace-nowrap"
          />
        </div>

        {/* Desktop Navigation - Mega Menu Style */}
        <div className="hidden md:flex items-center gap-8">
          {["Home", "Shop", "Collections", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => {
                setActivePage(page.toLowerCase());
                if (page.toLowerCase() === "shop") setSelectedProduct(null);
              }}
              className={`text-sm font-medium transition-colors hover:opacity-100 ${activePage === page.toLowerCase() ? "" : "opacity-60"
                }`}
              style={{ color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor }}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Actions: Search, Cart, Account */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Enhanced Search - Dawn-inspired */}
          <div className="relative hidden sm:block">
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 lg:w-56 pl-9 pr-4 py-2 text-sm bg-transparent border-b outline-none focus:border-blue-500 transition-colors"
              style={{ borderColor: `${theme.textColor}30` }}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Cart Button with Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:opacity-80 transition-opacity"
            aria-label="Open cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartItemCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {cartItemCount}
              </span>
            )}
          </button>

          {/* CTA Button */}
          <button
            className="hidden sm:flex px-5 py-2.5 font-semibold text-sm transition-transform active:scale-95"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`,
            }}
            onClick={() => setActivePage("shop")}
          >
            <EditableText regionKey="global.navCta" fallback="Shop Now" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-3" style={{ borderColor: `${theme.textColor}15` }}>
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-transparent border rounded-lg outline-none focus:ring-2"
              style={{ borderColor: `${theme.textColor}30` }}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Mobile Nav Links */}
          {["Home", "Shop", "Collections", "About", "Contact"].map((page) => (
            <button
              key={page}
              onClick={() => {
                setActivePage(page.toLowerCase());
                setIsMobileMenuOpen(false);
                if (page.toLowerCase() === "shop") setSelectedProduct(null);
              }}
              className={`block w-full text-left py-2 text-sm font-medium ${activePage === page.toLowerCase() ? "font-semibold" : "opacity-70"
                }`}
              style={{ color: activePage === page.toLowerCase() ? theme.primaryColor : theme.textColor }}
            >
              {page}
            </button>
          ))}

          <button
            className="w-full mt-2 px-5 py-3 font-semibold text-sm"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
              borderRadius: `${theme.borderRadius}px`,
            }}
            onClick={() => {
              setActivePage("shop");
              setIsMobileMenuOpen(false);
            }}
          >
            <EditableText regionKey="global.navCta" fallback="Shop Now" />
          </button>
        </div>
      )}
    </nav>
  );

  // ─── 🛒 CART DRAWER (Quick View - Dawn-inspired) ───
  const CartDrawer = () => {
    if (!isCartOpen) return null;

    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />

        {/* Drawer */}
        <div
          className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform"
          style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: `${theme.textColor}15` }}>
              <h2 className="text-lg font-bold">Your Cart ({cartItemCount})</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:opacity-70 transition-opacity"
                aria-label="Close cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 opacity-60">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="font-medium">Your cart is empty</p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setActivePage("shop");
                    }}
                    className="mt-4 text-sm font-semibold underline"
                    style={{ color: theme.primaryColor }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const product = MOCK_PRODUCTS.find((p) => p.id === item.id);
                  const variant = product?.variants?.find((v) => v.id === item.variant);
                  if (!product) return null;

                  return (
                    <div key={`${item.id}-${item.variant}`} className="flex gap-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        style={{ borderRadius: `${theme.borderRadius}px` }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{product.title}</h4>
                        {variant && (
                          <p className="text-xs opacity-60 mt-0.5">{variant.name}</p>
                        )}
                        <p className="font-semibold mt-1">
                          ${((variant?.price || product.price) * item.quantity).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.variant, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center border rounded text-sm"
                            style={{ borderColor: `${theme.textColor}30` }}
                          >
                            −
                          </button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.variant, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center border rounded text-sm"
                            style={{ borderColor: `${theme.textColor}30` }}
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id, item.variant)}
                            className="ml-auto text-xs opacity-50 hover:opacity-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t space-y-4" style={{ borderColor: `${theme.textColor}15` }}>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <p className="text-xs opacity-60">Shipping & taxes calculated at checkout</p>
                <button
                  className="w-full py-4 font-bold uppercase tracking-wider text-sm"
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: "#fff",
                    borderRadius: `${theme.borderRadius}px`,
                  }}
                >
                  Checkout
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 text-sm font-medium opacity-70 hover:opacity-100"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // ─── 🦶 FOOTER ───
  const Footer = () => (
    <footer
      className="py-16 px-6 border-t"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        borderColor: `${theme.textColor}10`,
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <EditableImg
              regionKey="global.logo"
              fallback="https://images.unsplash.com/photo-1549463591-14cc5bd1f008?w=100&h=100&fit=crop"
              className="w-8 h-8 rounded-lg"
            />
            <EditableText regionKey="global.brand" fallback="Nova" className="font-bold text-lg" />
          </div>
          <EditableText
            as="p"
            regionKey="footer.desc"
            fallback="Minimalist ecommerce, reimagined."
            className="text-sm opacity-60 leading-relaxed"
          />
        </div>

        {/* Shop Links */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm uppercase tracking-wider opacity-70">Shop</h4>
          {["All Products", "New Arrivals", "Best Sellers", "Sale"].map((link) => (
            <button key={link} className="block text-sm opacity-70 hover:opacity-100 transition-opacity">
              {link}
            </button>
          ))}
        </div>

        {/* Company Links */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm uppercase tracking-wider opacity-70">Company</h4>
          {["About", "Contact", "FAQ", "Shipping"].map((link) => (
            <button key={link} className="block text-sm opacity-70 hover:opacity-100 transition-opacity">
              {link}
            </button>
          ))}
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm uppercase tracking-wider opacity-70">Contact</h4>
          <EditableText regionKey="footer.email" fallback="hello@nova.store" className="text-sm block opacity-70" />
          <EditableText regionKey="footer.copy" fallback="© 2024 Nova. All rights reserved." className="text-xs opacity-40 block pt-4" />
        </div>
      </div>
    </footer>
  );

  // ─── 🏠 HOME VIEW (Dawn-inspired Hero + Collections) ───
  const HomeView = () => (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section - Media-forward */}
      <Section id="hero" className="py-12 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <EditableText
              as="h1"
              regionKey="hero.title"
              fallback="Elevate Your Everyday"
              className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
            />
            <EditableText
              as="p"
              regionKey="hero.subtitle"
              fallback="Discover thoughtfully crafted products designed for modern living."
              className="text-base sm:text-lg opacity-70 leading-relaxed max-w-lg"
            />
            <div className="flex flex-wrap gap-3">
              <button
                className="px-8 py-4 font-semibold text-sm uppercase tracking-wider"
                style={{
                  backgroundColor: theme.primaryColor,
                  color: "#fff",
                  borderRadius: `${theme.borderRadius}px`,
                }}
                onClick={() => setActivePage("shop")}
              >
                <EditableText regionKey="hero.btn1" fallback="Shop Collection" />
              </button>
              <button
                className="px-8 py-4 font-semibold text-sm uppercase tracking-wider border"
                style={{
                  borderColor: `${theme.textColor}30`,
                  borderRadius: `${theme.borderRadius}px`,
                }}
                onClick={() => {
                  setActivePage("shop");
                  setSelectedFilters(["new"]);
                }}
              >
                <EditableText regionKey="hero.btn2" fallback="New Arrivals" />
              </button>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <EditableImg
              regionKey="hero.img"
              fallback="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
              className="w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] object-cover shadow-lg"
              style={{ borderRadius: `${theme.borderRadius * 2}px` }}
            />
            {/* Promo Badge - Dawn-inspired */}
            <div
              className="absolute top-4 left-4 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: theme.primaryColor, borderRadius: `${theme.borderRadius}px` }}
            >
              <EditableText regionKey="hero.badge" fallback="Free Shipping" />
            </div>
          </div>
        </div>
      </Section>

      {/* Featured Collection - Dynamic Product Grid */}
      <Section id="featured" bgType="secondary" className="py-12 sm:py-20">
        <div className="text-center mb-10 sm:mb-16">
          <EditableText
            as="h2"
            regionKey="featured.title"
            fallback="Featured Collection"
            className="text-2xl sm:text-3xl font-bold tracking-tight mb-3"
          />
          <EditableText
            as="p"
            regionKey="featured.subtitle"
            fallback="Curated picks for the season"
            className="text-sm sm:text-base opacity-60"
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {MOCK_PRODUCTS.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10 sm:mt-12">
          <button
            onClick={() => setActivePage("shop")}
            className="px-6 py-3 text-sm font-semibold border inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{
              borderColor: `${theme.textColor}30`,
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            View All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </Section>

      {/* Value Props - Dawn-inspired Icons */}
      <Section id="values" className="py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {[
            { icon: "🚚", title: "Free Shipping", desc: "On orders over $100" },
            { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
            { icon: "🔒", title: "Secure Payment", desc: "100% protected" },
            { icon: "💬", title: "24/7 Support", desc: "We're here to help" },
          ].map((item, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="text-3xl">{item.icon}</div>
              <h4 className="font-semibold text-sm">{item.title}</h4>
              <p className="text-xs opacity-60">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  // ─── 🛍️ PRODUCT CARD COMPONENT (Dawn-inspired) ───
  const ProductCard = ({ product }: { product: any }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          setSelectedProduct(product);
          setActivePage("product");
        }}
      >
        {/* Image Container with Hover Effects */}
        <div className="relative aspect-square overflow-hidden mb-3 sm:mb-4" style={{ borderRadius: `${theme.borderRadius}px` }}>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Quick Add Button - Dawn-inspired Quick Buy */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product.id);
            }}
            className={`absolute bottom-3 left-3 right-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all transform ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            style={{
              backgroundColor: theme.primaryColor,
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            Quick Add
          </button>

          {/* Sale Badge */}
          {product.compareAtPrice && (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider"
              style={{ backgroundColor: "#ef4444", borderRadius: `${theme.borderRadius / 2}px` }}
            >
              Sale
            </span>
          )}

          {/* Color Swatches Preview - Dawn-inspired */}
          <div className="absolute bottom-3 right-3 flex gap-1">
            {product.colors?.slice(0, 3).map((color: string, i: number) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.colors?.length > 3 && (
              <span className="w-4 h-4 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center text-[8px]">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <h3 className="font-medium text-sm sm:text-base line-clamp-1">{product.title}</h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-xs opacity-50 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          {/* Rating Stars */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-amber-400" : "opacity-20"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs opacity-50">({product.reviews})</span>
          </div>
        </div>
      </div>
    );
  };

  // ─── 🛒 SHOP VIEW (Product Listing with Filters) ───
  const ShopView = () => (
    <div className="animate-in fade-in duration-500">
      <Section id="shop" className="py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <EditableText
            as="h1"
            regionKey="shop.title"
            fallback="All Products"
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
          />
          <p className="opacity-60">{filteredProducts.length} products</p>
        </div>

        {/* Filters & Sort - Dawn-inspired */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b" style={{ borderColor: `${theme.textColor}15` }}>
          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {["all", "new", "bestseller", "sale"].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilters(filter === "all" ? [] : [filter]);
                }}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-wider border transition-all ${(filter === "all" && selectedFilters.length === 0) || selectedFilters.includes(filter)
                    ? "font-semibold"
                    : "opacity-60 hover:opacity-100"
                  }`}
                style={{
                  borderColor: `${theme.textColor}30`,
                  backgroundColor: (filter === "all" && selectedFilters.length === 0) || selectedFilters.includes(filter) ? `${theme.primaryColor}15` : "transparent",
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 text-sm border bg-transparent outline-none cursor-pointer"
            style={{ borderColor: `${theme.textColor}30`, borderRadius: `${theme.borderRadius}px` }}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
          </select>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 opacity-60">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 text-sm font-semibold border hover:opacity-80 transition-opacity" style={{ borderColor: `${theme.textColor}30`, borderRadius: `${theme.borderRadius}px` }}>
            Load More
          </button>
        </div>
      </Section>
    </div>
  );

  // ─── 📦 PRODUCT VIEW (Media-Forward - Dawn-inspired) ───
  const ProductView = () => {
    if (!selectedProduct) {
      return (
        <Section className="py-20 text-center">
          <p>Product not found</p>
          <button onClick={() => setActivePage("shop")} className="mt-4 underline">Back to Shop</button>
        </Section>
      );
    }

    const [selectedVariant, setSelectedVariant] = useState(selectedProduct.variants?.[0]?.id);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    const variant = selectedProduct.variants?.find((v: any) => v.id === selectedVariant);
    const price = variant?.price || selectedProduct.price;
    const available = variant?.available ?? true;

    return (
      <div className="animate-in fade-in duration-500">
        <Section id="product" className="py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav className="text-xs opacity-50 mb-6 sm:mb-8">
            <button onClick={() => setActivePage("shop")} className="hover:underline">Shop</button>
            <span className="mx-2">/</span>
            <span>{selectedProduct.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery - Dawn-inspired Media-Forward */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden" style={{ borderRadius: `${theme.borderRadius * 2}px` }}>
                <img
                  src={selectedProduct.images[activeImage]}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover transition-opacity"
                />
              </div>
              {/* Thumbnails */}
              {selectedProduct.images.length > 1 && (
                <div className="flex gap-3">
                  {selectedProduct.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 overflow-hidden border-2 transition-all ${activeImage === i ? "border-current" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      style={{ borderRadius: `${theme.borderRadius}px` }}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <EditableText
                  as="h1"
                  regionKey="product.title"
                  fallback={selectedProduct.title}
                  className="text-2xl sm:text-3xl font-bold tracking-tight"
                />
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? "text-amber-400" : "opacity-20"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm opacity-60">{selectedProduct.reviews} reviews</span>
                </div>
              </div>

              {/* Price */}
              <div className="text-2xl font-bold">
                ${price.toFixed(2)}
                {selectedProduct.compareAtPrice && (
                  <span className="ml-2 text-lg opacity-50 line-through">${selectedProduct.compareAtPrice.toFixed(2)}</span>
                )}
              </div>

              {/* Description */}
              <EditableText
                as="p"
                regionKey="product.desc"
                fallback={selectedProduct.description}
                className="opacity-70 leading-relaxed"
              />

              {/* Color Swatches - Dawn-inspired */}
              {selectedProduct.colors && (
                <div className="space-y-3">
                  <span className="text-sm font-medium">Color</span>
                  <div className="flex gap-2">
                    {selectedProduct.colors.map((color: string, i: number) => (
                      <button
                        key={i}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${i === 0 ? "border-current scale-105" : "border-transparent hover:scale-105"
                          }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Variant Selector */}
              {selectedProduct.variants && selectedProduct.variants.length > 1 && (
                <div className="space-y-3">
                  <span className="text-sm font-medium">Option</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants.map((v: any) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v.id)}
                        disabled={!v.available}
                        className={`px-4 py-2.5 text-sm border transition-all ${selectedVariant === v.id
                            ? "font-semibold border-current"
                            : "opacity-60 hover:opacity-100"
                          } ${!v.available ? "opacity-30 cursor-not-allowed line-through" : ""}`}
                        style={{
                          borderColor: `${theme.textColor}30`,
                          borderRadius: `${theme.borderRadius}px`,
                        }}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex gap-4 pt-4">
                <div className="flex items-center border" style={{ borderColor: `${theme.textColor}30`, borderRadius: `${theme.borderRadius}px` }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-12 flex items-center justify-center text-lg"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-12 flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => addToCart(selectedProduct.id, selectedVariant, quantity)}
                  disabled={!available}
                  className={`flex-1 py-4 font-semibold uppercase tracking-wider text-sm transition-all ${available ? "hover:opacity-90 active:scale-[0.99]" : "opacity-50 cursor-not-allowed"
                    }`}
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: "#fff",
                    borderRadius: `${theme.borderRadius}px`,
                  }}
                >
                  {available ? "Add to Cart" : "Sold Out"}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-4 pt-4 text-xs opacity-60">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Free shipping
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  30-day returns
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* Recommended Products - Dawn-inspired Cross-selling */}
        <Section id="recommended" bgType="secondary" className="py-12 sm:py-16">
          <div className="text-center mb-10">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">You May Also Like</h3>
            <p className="opacity-60 text-sm">Complete your look</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {MOCK_PRODUCTS.filter(p => p.id !== selectedProduct.id).slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Section>
      </div>
    );
  };

  // ─── 🛒 CART PAGE VIEW ───
  const CartPageView = () => (
    <div className="animate-in fade-in duration-500">
      <Section id="cart-page" className="py-12 sm:py-20">
        <EditableText
          as="h1"
          regionKey="cart.title"
          fallback="Your Cart"
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-8 sm:mb-12 text-center"
        />

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-20 h-20 mx-auto mb-6 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-lg font-medium mb-2">Your cart is empty</p>
            <p className="opacity-60 mb-6">Add some products to get started</p>
            <button
              onClick={() => setActivePage("shop")}
              className="px-8 py-4 font-semibold uppercase tracking-wider text-sm"
              style={{
                backgroundColor: theme.primaryColor,
                color: "#fff",
                borderRadius: `${theme.borderRadius}px`,
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const product = MOCK_PRODUCTS.find((p) => p.id === item.id);
                const variant = product?.variants?.find((v) => v.id === item.variant);
                if (!product) return null;

                return (
                  <div key={`${item.id}-${item.variant}`} className="flex gap-4 p-4 border rounded-lg" style={{ borderColor: `${theme.textColor}15`, borderRadius: `${theme.borderRadius}px` }}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-24 h-24 object-cover flex-shrink-0"
                      style={{ borderRadius: `${theme.borderRadius}px` }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <div>
                          <h4 className="font-medium">{product.title}</h4>
                          {variant && <p className="text-sm opacity-60 mt-0.5">{variant.name}</p>}
                        </div>
                        <button onClick={() => removeFromCart(item.id, item.variant)} className="text-sm opacity-50 hover:opacity-100">Remove</button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border" style={{ borderColor: `${theme.textColor}30`, borderRadius: `${theme.borderRadius}px` }}>
                          <button onClick={() => updateCartQuantity(item.id, item.variant, item.quantity - 1)} className="w-9 h-10 flex items-center justify-center">−</button>
                          <span className="w-10 text-center text-sm">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, item.variant, item.quantity + 1)} className="w-9 h-10 flex items-center justify-center">+</button>
                        </div>
                        <span className="font-semibold">${((variant?.price || product.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 border rounded-lg space-y-4" style={{ borderColor: `${theme.textColor}15`, borderRadius: `${theme.borderRadius * 2}px` }}>
                <h3 className="font-bold text-lg">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-60">Subtotal</span>
                    <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Shipping</span>
                    <span className="opacity-60">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Taxes</span>
                    <span className="opacity-60">Calculated at checkout</span>
                  </div>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg" style={{ borderColor: `${theme.textColor}15` }}>
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  className="w-full py-4 font-semibold uppercase tracking-wider text-sm"
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: "#fff",
                    borderRadius: `${theme.borderRadius}px`,
                  }}
                >
                  Proceed to Checkout
                </button>
                <p className="text-xs opacity-50 text-center">Secure checkout • SSL encrypted</p>
              </div>
            </div>
          </div>
        )}
      </Section>
    </div>
  );

  // ─── 📬 CONTACT VIEW ───
  const ContactView = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formspreeEndpoint) {
        alert("⚠️ Form is not connected. Please add your Formspree endpoint in the editor.");
        return;
      }
      setStatus("loading");
      try {
        const res = await fetch(formspreeEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setStatus("success");
          setFormData({ name: "", email: "", message: "" });
          setTimeout(() => setStatus("idle"), 5000);
        } else {
          throw new Error();
        }
      } catch {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    };

    return (
      <div className="animate-in fade-in duration-500">
        <Section id="contact" className="py-12 sm:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <EditableText as="h1" regionKey="contact.title" fallback="Get in Touch" className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" />
            <EditableText as="p" regionKey="contact.subtitle" fallback="We'd love to hear from you" className="opacity-60 mb-12" />

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Contact Info */}
              <div className="text-left space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-2">Email</h4>
                  <EditableText regionKey="contact.email" fallback="hello@nova.store" className="font-medium block" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-2">Location</h4>
                  <EditableText regionKey="contact.address" fallback="123 Commerce St, New York, NY" className="font-medium block" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-2">Hours</h4>
                  <EditableText regionKey="contact.hours" fallback="Mon-Fri: 9am-6pm EST" className="font-medium block" />
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <input
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full p-4 bg-transparent border-b outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: `${theme.textColor}20` }}
                  required
                  disabled={status === "loading"}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Your Email"
                  className="w-full p-4 bg-transparent border-b outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: `${theme.textColor}20` }}
                  required
                  disabled={status === "loading"}
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your Message"
                  rows={4}
                  className="w-full p-4 bg-transparent border-b outline-none focus:border-blue-500 transition-colors resize-none"
                  style={{ borderColor: `${theme.textColor}20` }}
                  required
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  disabled={status === "loading" || !formspreeEndpoint}
                  className={`w-full py-4 font-semibold uppercase tracking-wider text-sm transition-all ${status === "loading" || !formspreeEndpoint ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
                    }`}
                  style={{ backgroundColor: theme.primaryColor, color: "#fff", borderRadius: `${theme.borderRadius}px` }}
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
                {status === "success" && <p className="text-green-500 text-sm">✓ Message sent!</p>}
                {status === "error" && <p className="text-red-500 text-sm">❌ Something went wrong</p>}
              </form>
            </div>
          </div>
        </Section>
      </div>
    );
  };

  // ─── 🎬 MAIN RENDER ───
  return (
    <main
      className="min-h-screen selection:bg-blue-500 selection:text-white"
      style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}
    >
      {/* Editor-only Cloudinary script */}
      {!isPublished && (
        <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />
      )}

      {/* Production: Disable editable behavior */}
      {isPublished && (
        <style>{`
          [contenteditable] {
            pointer-events: none !important;
            user-select: none !important;
            outline: none !important;
            -webkit-user-modify: read-only !important;
          }
        `}</style>
      )}

      <Navbar />
      <CartDrawer />

      <div className="flex flex-col w-full">
        {activePage === "home" && <HomeView />}
        {activePage === "shop" && <ShopView />}
        {activePage === "product" && <ProductView />}
        {activePage === "cart" && <CartPageView />}
        {activePage === "contact" && <ContactView />}
      </div>

      <Footer />

      {/* Animations & Styles */}
      <style>{`
        html { scroll-behavior: smooth; }
        ${!isPublished ? `[contenteditable]:focus { outline: none; background: rgba(0,0,0,0.02); }` : ""}
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-in { animation-duration: 0.5s; animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </main>
  );
}