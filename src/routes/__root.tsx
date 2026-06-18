import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import appCss from "../styles.css?url";
import logoFavicon from "@/assets/png/logo.jpg";

import { Navbar } from "@/components/Navbar";
import { StickyBanner } from "@/components/StickyBanner";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { useHashScroll } from "@/lib/hooks";
import { siteConfig } from "@/siteConfig";
import { getThemeStyleVars } from "@/lib/utils";

// 👇 New imports for cart
import { CartProvider } from "@/context/CartContext";
import { ToastContainer } from "@/components/ui/Toast";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1
          className="text-7xl font-black tracking-[0.02em]"
          style={{ color: "var(--brand-primary)" }}
        >
          404
        </h1>
        <p
          className="mt-4 uppercase tracking-[0.08em]"
          style={{ color: "var(--ui-text-muted)" }}
        >
          This page wandered off the grill.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full px-5 py-2.5 font-bold uppercase tracking-[0.12em]"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-primary), var(--status-warning))",
            color: "var(--brand-on-primary)",
          }}
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-black uppercase tracking-[0.08em]">
          This page didn't load
        </h1>
        <p
          className="mt-2 text-sm uppercase tracking-[0.08em]"
          style={{ color: "var(--ui-text-muted)" }}
        >
          Try again in a sec.
        </p>
        <button
          onClick={() => {
            reset();
          }}
          className="mt-6 rounded-full px-5 py-2.5 font-bold uppercase tracking-[0.12em]"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-primary), var(--status-warning))",
            color: "var(--brand-on-primary)",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: `${siteConfig.restaurantName} | Crafted with Fire, Served with Heart`,
      },
      {
        name: "description",
        content: `Bold burgers, loaded sides, and proper grill energy at ${siteConfig.restaurantName}.`,
      },
      { name: "author", content: siteConfig.restaurantName },
      {
        property: "og:title",
        content: `${siteConfig.restaurantName} | Crafted with Fire, Served with Heart`,
      },
      {
        property: "og:description",
        content: `Big flavors, loud energy, and no-fuss burger nights at ${siteConfig.restaurantName}.`,
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: siteConfig.heroImage },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: logoFavicon },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const themeVars = getThemeStyleVars();
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body style={themeVars}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AppShell() {
  useHashScroll();
  return (
    <div className="min-h-screen flex flex-col pb-16 lg:pb-0">
      <StickyBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileBar />
      <WhatsAppFloat />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <AppShell />
        <ToastContainer />
      </CartProvider>
    </QueryClientProvider>
  );
}