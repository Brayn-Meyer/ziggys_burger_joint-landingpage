import { useMemo, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import { siteConfig } from "@/siteConfig";
import { SocialIcons } from "./SocialIcons";
import { CartButton } from "./ui/CartButton";  // 👈 new import
import { createImagePlaceholder, setImageFallback } from "@/lib/utils";

type SubLink = { label: string; to: string; hash?: string };
type NavItem = { label: string; to: string; subs: SubLink[] };

function getNavItems() {
  const homeSubs: SubLink[] = [
    siteConfig.sections.about && { label: "Our Story", to: "/", hash: "our-story" },
    siteConfig.sections.todaysSpecial && { label: "Today's Special", to: "/", hash: "tonights-special" },
    siteConfig.sections.reviews && { label: "Reviews", to: "/", hash: "reviews" },
    siteConfig.sections.pressFeatures && { label: "Press", to: "/", hash: "press-features" },
    siteConfig.sections.newsletter && { label: "Get Updates", to: "/", hash: "stay-updated" },
  ].filter(Boolean) as SubLink[];

  const menuSubs: SubLink[] = [
    siteConfig.sections.menuSpecial && siteConfig.sections.todaysSpecial && { label: "Today's Special", to: "/menu", hash: "tonights-special" },
    siteConfig.sections.menuGrid && { label: "Grills", to: "/menu", hash: "grills" },
    siteConfig.sections.menuGrid && { label: "Combos", to: "/menu", hash: "combos" },
    siteConfig.sections.menuGrid && { label: "Burgers", to: "/menu", hash: "burgers" },
    siteConfig.sections.menuGrid && { label: "Smash Burgers", to: "/menu", hash: "smash-burgers" },
    siteConfig.sections.menuGrid && { label: "Starters", to: "/menu", hash: "starters" },
    siteConfig.sections.menuGrid && { label: "Light Meals", to: "/menu", hash: "light-meals" },
    siteConfig.sections.menuGrid && { label: "Junior Favourites", to: "/menu", hash: "junior-favourites" },
    siteConfig.sections.menuGrid && { label: "Drinks", to: "/menu", hash: "drinks" },
  ].filter(Boolean) as SubLink[];

  const socialsSubs: SubLink[] = [
    siteConfig.sections.upcomingEvents && { label: "Upcoming Events", to: "/socials", hash: "upcoming-events" },
    siteConfig.sections.photoGallery && { label: "Gallery", to: "/socials", hash: "gallery" },
    siteConfig.sections.privateHire && { label: "Private Hire", to: "/socials", hash: "private-hire" },
  ].filter(Boolean) as SubLink[];

  const hasFindUsContent = siteConfig.sections.locationMap || siteConfig.sections.hours || siteConfig.sections.location;
  const contactSubs: SubLink[] = [
    siteConfig.sections.contactDetails && { label: "Hit Us Up", to: "/contact", hash: "get-in-touch" },
    siteConfig.sections.eventsForm && { label: "Group Booking Enquiry", to: "/contact", hash: "socials" },
    hasFindUsContent && { label: "Find Us", to: "/contact", hash: "find-us" },
  ].filter(Boolean) as SubLink[];

  const navItems: NavItem[] = [];
  if (homeSubs.length > 0) navItems.push({ label: "Home", to: "/", subs: homeSubs });
  if (menuSubs.length > 0) navItems.push({ label: "Menu", to: "/menu", subs: menuSubs });
  if (siteConfig.sections.socials && socialsSubs.length > 0) navItems.push({ label: "Socials", to: "/socials", subs: socialsSubs });
  if (contactSubs.length > 0) navItems.push({ label: "Contact", to: "/contact", subs: contactSubs });
  return navItems;
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accordion, setAccordion] = useState<string | null>(null);
  const location = useLocation();
  const navItems = useMemo(() => getNavItems(), []);
  const logoFallback = createImagePlaceholder(siteConfig.restaurantName, 300, 96);

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--ui-panel) 92%, transparent)", borderBottom: "1px solid var(--ui-border-strong)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5">
        <Link to="/" className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full" onClick={() => setMobileOpen(false)}>
          <img
            src={siteConfig.branding.logo}
            alt={siteConfig.branding.logoAlt}
            className="block h-full w-full rounded-full object-cover"
            onError={(event) => setImageFallback(event, logoFallback)}
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <div key={item.label} className="relative group">
                <Link
                  to={item.to}
                  className="inline-flex h-9 items-center gap-1 rounded-full px-4 text-sm font-bold uppercase tracking-[0.18em] transition-colors"
                  style={{
                    color: isActive ? "var(--brand-primary)" : "var(--ui-text)",
                    background: isActive ? "var(--brand-primary-opaque-12)" : "transparent",
                  }}
                >
                  {item.label}
                  <ChevronDown size={14} className="opacity-60 transition-transform group-hover:translate-y-px group-hover:opacity-100" />
                </Link>
                <div className="absolute left-0 top-full min-w-56 translate-y-1 pt-2 invisible opacity-0 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div
                    className="overflow-hidden rounded-xl shadow-2xl"
                    style={{ background: "var(--ui-panel)", border: "1px solid var(--ui-border-strong)" }}
                  >
                    {item.subs.map((s) => (
                      <Link
                        key={s.label}
                        to={s.to}
                        hash={s.hash}
                        className="block px-4 py-3 text-sm font-medium uppercase tracking-[0.08em] transition-colors hover:bg-[var(--brand-primary-opaque-12)]"
                        style={{ color: "var(--ui-text-muted)" }}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="hidden h-9 shrink-0 items-center gap-3 lg:flex">
          <SocialIcons variant="color" size={18} />
          <CartButton />   {/* 👈 added */}
        </div>

        <button
          className="flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-full border lg:hidden"
          style={{ borderColor: "var(--ui-border-strong)", color: "var(--ui-text)" }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          type="button"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t" style={{ borderColor: "var(--ui-border-strong)", background: "var(--ui-panel)" }}>
          <div className="max-h-[80vh] overflow-y-auto px-4 py-2">
            {navItems.map((item) => {
              const open = accordion === item.label;
              return (
                <div key={item.label} className="border-b" style={{ borderColor: "var(--ui-border)" }}>
                  <div className="flex items-center justify-between">
                    <Link
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 py-3 text-sm font-bold uppercase tracking-[0.12em]"
                      style={{ color: location.pathname === item.to ? "var(--brand-primary)" : "var(--ui-text)" }}
                    >
                      {item.label}
                    </Link>
                    <button
                      onClick={() => setAccordion(open ? null : item.label)}
                      className="min-h-11 min-w-11 p-3"
                      aria-label={`Toggle ${item.label} sub-menu`}
                      type="button"
                    >
                      <ChevronDown size={18} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
                    </button>
                  </div>
                  {open && (
                    <div className="pb-2 pl-3">
                      {item.subs.map((s) => (
                        <Link
                          key={s.label}
                          to={s.to}
                          hash={s.hash}
                          onClick={() => { setMobileOpen(false); setAccordion(null); }}
                          className="block py-2.5 text-sm uppercase tracking-[0.08em]"
                          style={{ color: "var(--ui-text-muted)" }}
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: "var(--ui-border)", background: "var(--ui-panel-alt)" }}>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--ui-text-muted)" }}>Socials</p>
              <SocialIcons variant="color" size={20} />
              <p className="mt-3 text-xs uppercase tracking-[0.08em]" style={{ color: "var(--ui-text-subtle)" }}>{siteConfig.socials.handle}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}