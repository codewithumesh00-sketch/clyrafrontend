import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Star, 
  Instagram, 
  Facebook, 
  Twitter, 
  Menu as MenuIcon, 
  X,
  Award,
  Users
} from 'lucide-react';
export const template4Meta = {
  id: "business/template1",
  name: "Clyra Modern Ecommerce",
  image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
};
/**
 * Template 4: Restaurant Hub
 * Style: Luxury / Elegant
 * Features: Menu Management, Reservation CTA, Chef Showcase
 */

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [scrolled, setScrolled] = useState(false);

  // Mock data representing the "editableData" from the backend
  const [data, setData] = useState({
    navbar: {
      brand: "L'ARTISAN",
      links: [
        { label: "Home", id: "home" },
        { label: "Our Menu", id: "menu" },
        { label: "Our Story", id: "about" },
        { label: "Reservation", id: "reservation" }
      ]
    },
    hero: {
      title: "Culinary Excellence Redefined",
      subtitle: "Experience the fusion of traditional techniques and modern flavors in the heart of the city.",
      ctaText: "Book Your Table",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1600"
    },
    menu: [
      { id: 1, name: "Truffle Risotto", price: "$32", category: "Main", description: "Arborio rice, black truffle shavings, 24-month aged parmesan.", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=400" },
      { id: 2, name: "Seared Scallops", price: "$28", category: "Appetizer", description: "Jumbo scallops, cauliflower purée, crispy pancetta.", image: "https://images.unsplash.com/photo-1533777324565-a040eb52facd?auto=format&fit=crop&q=80&w=400" },
      { id: 3, name: "Wagyu Ribeye", price: "$85", category: "Main", description: "A5 Grade Wagyu, roasted bone marrow, red wine jus.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400" },
      { id: 4, name: "Valrhona Soufflé", price: "$18", category: "Dessert", description: "Dark chocolate, Grand Marnier, Tahitian vanilla bean ice cream.", image: "https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?auto=format&fit=crop&q=80&w=400" },
      { id: 5, name: "Octopus Carpaccio", price: "$24", category: "Appetizer", description: "Thinly sliced octopus, capers, lemon zest, extra virgin olive oil.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=400" },
      { id: 6, name: "Lobster Thermidor", price: "$65", category: "Main", description: "Atlantic lobster, cognac cream, gruyère crust.", image: "https://images.unsplash.com/photo-1533682805518-48d1f5b8cd3a?auto=format&fit=crop&q=80&w=400" },
    ],
    chef: {
      name: "Julian Vane",
      title: "Executive Chef",
      bio: "With three Michelin stars under his belt, Chef Julian brings a philosophical approach to every plate, sourcing only the finest seasonal ingredients.",
      image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&q=80&w=800"
    }
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = ['All', ...new Set(data.menu.map(item => item.category))];
  const filteredMenu = activeCategory === 'All' 
    ? data.menu 
    : data.menu.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#D4AF37] selection:text-black font-serif">
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/90 py-4 backdrop-blur-md border-b border-[#D4AF37]/20' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-[0.2em] text-[#D4AF37]">
            {data.navbar.brand}
          </div>
          
          <div className="hidden md:flex gap-10">
            {data.navbar.links.map(link => (
              <a 
                key={link.id} 
                href={`#${link.id}`} 
                className="text-sm uppercase tracking-widest hover:text-[#D4AF37] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <button className="hidden md:block px-6 py-2 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 text-xs uppercase tracking-widest">
            Reservations
          </button>

          <button className="md:hidden text-[#D4AF37]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-8 md:hidden">
          {data.navbar.links.map(link => (
            <a 
              key={link.id} 
              href={`#${link.id}`} 
              className="text-2xl uppercase tracking-widest" 
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button className="mt-4 px-10 py-4 bg-[#D4AF37] text-black uppercase tracking-widest font-bold">
            Reservations
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={data.hero.image} 
            alt="Hero" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0a0a0a]"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <p className="text-[#D4AF37] uppercase tracking-[0.4em] mb-6 animate-fade-in-up text-sm font-sans">Fine Dining Experience</p>
          <h1 className="text-5xl md:text-8xl font-light mb-8 leading-tight animate-fade-in-up delay-100">
            {data.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-sans font-light leading-relaxed animate-fade-in-up delay-200">
            {data.hero.subtitle}
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center animate-fade-in-up delay-300">
            <button className="px-10 py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 group">
              {data.hero.ctaText}
              <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </button>
            <button className="px-10 py-5 border border-white/30 backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest">
              View Menu
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-[#D4AF37] to-transparent"></div>
        </div>
      </section>

      {/* Features/Stats */}
      <section className="py-20 bg-[#0f0f0f] border-y border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <Award className="text-[#D4AF37] mb-4" size={40} />
            <h3 className="text-xl mb-2">3 Michelin Stars</h3>
            <p className="text-gray-500 font-sans text-sm">Awarded for culinary excellence and consistency.</p>
          </div>
          <div className="flex flex-col items-center">
            <Users className="text-[#D4AF37] mb-4" size={40} />
            <h3 className="text-xl mb-2">Private Dining</h3>
            <p className="text-gray-500 font-sans text-sm">Exclusive spaces for your most intimate celebrations.</p>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="text-[#D4AF37] mb-4" size={40} />
            <h3 className="text-xl mb-2">Craft Cocktails</h3>
            <p className="text-gray-500 font-sans text-sm">Signature mixology available until late night.</p>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[#D4AF37] uppercase tracking-widest text-sm mb-4 font-sans">Exquisite Selection</h2>
            <h3 className="text-4xl md:text-6xl font-light">The Seasonal Menu</h3>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-10 mb-16 border-b border-white/10 pb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`uppercase tracking-[0.2em] text-sm transition-all relative py-2 ${activeCategory === cat ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-white'}`}
              >
                {cat}
                {activeCategory === cat && <div className="absolute bottom-0 left-0 w-full h-px bg-[#D4AF37]"></div>}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredMenu.map(item => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative overflow-hidden mb-6 aspect-square">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                  />
                  <div className="absolute top-4 right-4 bg-black/80 px-4 py-2 text-[#D4AF37] font-bold border border-[#D4AF37]/30 backdrop-blur-md">
                    {item.price}
                  </div>
                </div>
                <div className="flex justify-between items-end mb-2">
                  <h4 className="text-2xl font-light group-hover:text-[#D4AF37] transition-colors">{item.name}</h4>
                </div>
                <p className="text-gray-500 font-sans text-sm leading-relaxed italic">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chef Section */}
      <section id="about" className="py-32 bg-[#050505] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 border-t border-l border-[#D4AF37]/30"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b border-r border-[#D4AF37]/30"></div>
            <img 
              src={data.chef.image} 
              alt="Chef" 
              className="w-full aspect-[4/5] object-cover relative z-10 shadow-2xl"
            />
          </div>
          <div>
            <h2 className="text-[#D4AF37] uppercase tracking-widest text-sm mb-4 font-sans">The Visionary</h2>
            <h3 className="text-4xl md:text-6xl font-light mb-8">Meet Chef {data.chef.name}</h3>
            <p className="text-gray-400 text-lg font-sans leading-relaxed mb-10">
              {data.chef.bio}
            </p>
            <div className="grid grid-cols-2 gap-8 mb-12 border-l-2 border-[#D4AF37] pl-8">
              <div>
                <span className="block text-3xl font-light">15+</span>
                <span className="text-xs uppercase tracking-widest text-gray-500">Years Experience</span>
              </div>
              <div>
                <span className="block text-3xl font-light">Michelin</span>
                <span className="text-xs uppercase tracking-widest text-gray-500">Certified Artist</span>
              </div>
            </div>
            <button className="px-10 py-5 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 uppercase tracking-widest text-sm">
              Read Full Story
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-2 mb-8">
            {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="#D4AF37" color="#D4AF37" />)}
          </div>
          <blockquote className="text-2xl md:text-4xl italic font-light mb-10 leading-relaxed">
            "An unparalleled dining experience. The attention to detail in every bite of the Wagyu was something I've only found in the finest kitchens of Paris."
          </blockquote>
          <cite className="text-[#D4AF37] uppercase tracking-widest not-italic font-sans text-sm">— James Sterling, Food Critic</cite>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-20 px-6 border-t border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-bold tracking-[0.2em] text-[#D4AF37] mb-8">{data.navbar.brand}</h2>
            <p className="text-gray-500 max-w-sm font-sans mb-8">
              A sanctuary for gastronomes. We believe that dining is an art form, and every guest is a collector of moments.
            </p>
            <div className="flex gap-6">
              <Instagram className="text-gray-500 hover:text-[#D4AF37] cursor-pointer" />
              <Facebook className="text-gray-500 hover:text-[#D4AF37] cursor-pointer" />
              <Twitter className="text-gray-500 hover:text-[#D4AF37] cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h4 className="text-[#D4AF37] uppercase tracking-widest text-xs font-sans mb-6">Location</h4>
            <div className="flex gap-3 text-gray-400 mb-4 font-sans text-sm">
              <MapPin size={18} className="shrink-0 text-[#D4AF37]" />
              <span>124 Gourmet Plaza,<br />Culinary District, NY 10001</span>
            </div>
            <div className="flex gap-3 text-gray-400 font-sans text-sm">
              <Clock size={18} className="shrink-0 text-[#D4AF37]" />
              <span>Mon - Sun: 5:00 PM - 11:00 PM</span>
            </div>
          </div>

          <div>
            <h4 className="text-[#D4AF37] uppercase tracking-widest text-xs font-sans mb-6">Join Our Table</h4>
            <p className="text-gray-500 mb-6 font-sans text-sm">Subscribe for seasonal menu previews and event invites.</p>
            <div className="flex">
              <input type="text" placeholder="Email" className="bg-white/5 border border-white/10 px-4 py-2 w-full focus:outline-none focus:border-[#D4AF37] font-sans" />
              <button className="bg-[#D4AF37] text-black px-4 py-2 hover:bg-white transition-colors">
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center text-gray-600 font-sans text-xs tracking-widest uppercase">
          &copy; 2026 {data.navbar.brand}. Crafted with passion for fine cuisine.
        </div>
      </footer>

      {/* Tailwind and Animations Support */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s linear infinite alternate;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}} />
    </div>
  );
};

export default App;