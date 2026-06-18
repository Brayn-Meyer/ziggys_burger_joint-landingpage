import { Link } from "@tanstack/react-router";
import { Calendar, BookOpen, Phone } from "lucide-react";
import { siteConfig } from "@/siteConfig";
import { CartButton } from "./ui/CartButton";  // 👈 new import

export function MobileBar() {
  if (!siteConfig.sections.mobileBar) return null;

  const showReservations =
    siteConfig.integrations.reservationsEnabled &&
    (siteConfig.sections.reservationForm || siteConfig.sections.privateDining || siteConfig.sections.reservations || siteConfig.sections.gifts);
  const showMenu = siteConfig.sections.menuSpecial || siteConfig.sections.menuGrid;
  const showCall = siteConfig.sections.contactDetails && Boolean(siteConfig.contact.phone);

  if (!showReservations && !showMenu && !showCall) return null;

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex"
      style={{ background: "var(--ui-panel)", borderTop: "1px solid var(--ui-border-strong)" }}
    >
      {showReservations && (
        <Link
          to="/reservations"
          className="flex min-h-[58px] flex-1 flex-col items-center gap-1 py-3 text-xs font-bold uppercase tracking-[0.12em]"
          style={{ color: "var(--ui-text)" }}
        >
          <Calendar size={20} style={{ color: "var(--brand-primary)" }} />
          Book
        </Link>
      )}
      {showMenu && (
        <Link
          to="/menu"
          className="flex min-h-[58px] flex-1 flex-col items-center gap-1 border-x py-3 text-xs font-bold uppercase tracking-[0.12em]"
          style={{ color: "var(--ui-text)", borderColor: "var(--ui-border)" }}
        >
          <BookOpen size={20} style={{ color: "var(--brand-primary)" }} />
          Menu
        </Link>
      )}
      {/* 👇 Cart button added here */}
      <div
        className="flex min-h-[58px] flex-1 flex-col items-center gap-1 border-x py-3"
        style={{ borderColor: "var(--ui-border)" }}
      >
        <CartButton />
        <span className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: "var(--ui-text)" }}>
          Cart
        </span>
      </div>
      {showCall && (
        <a
          href={`tel:${siteConfig.contact.phone}`}
          className="flex min-h-[58px] flex-1 flex-col items-center gap-1 py-3 text-xs font-bold uppercase tracking-[0.12em]"
          style={{ color: "var(--ui-text)" }}
        >
          <Phone size={20} style={{ color: "var(--brand-primary)" }} />
          Call
        </a>
      )}
    </nav>
  );
}