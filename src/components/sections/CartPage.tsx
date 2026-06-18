import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCart } from '@/hooks/useCart';
import { siteConfig } from '@/siteConfig';
import { formatWhatsAppOrder } from '@/lib/whatsapp';
import { Trash2, Plus, Minus } from 'lucide-react';

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    items,
    totalQuantity,
    totalPrice,
    note,
    customerName,
    removeItem,
    updateQuantity,
    clearCart,
    setNote,
    setCustomerName,
  } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if cart is empty
  if (totalQuantity === 0) {
    window.dispatchEvent(
      new CustomEvent('cart-toast', {
        detail: { message: 'Your cart is empty. Browse the menu first.' },
      })
    );
    navigate({ to: '/menu' });
    return null;
  }

  const handleOrder = () => {
    setIsSubmitting(true);

    const message = formatWhatsAppOrder(items, note, totalPrice, customerName);
    const encoded = encodeURIComponent(message);
    const whatsappNumber = siteConfig.contact.whatsapp?.replace(/[^0-9]/g, '') || '';
    const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;

    clearCart();

    window.open(url, '_blank');

    setTimeout(() => {
      setIsSubmitting(false);
      navigate({ to: '/' });
    }, 500);
  };

  return (
    <section className="px-4 py-12 max-w-3xl mx-auto">
      <h1
        className="text-4xl font-bold mb-8"
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--brand-primary)',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
        }}
      >
        Your Cart
      </h1>

      {/* Pickup location (read-only) */}
      <div className="mb-6 p-4 rounded-xl border" style={{ borderColor: 'var(--ui-border-strong)' }}>
        <p className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--ui-text-muted)' }}>
          Pickup Location
        </p>
        <p className="mt-1" style={{ color: 'var(--ui-text)' }}>
          {siteConfig.location.address}
        </p>
        <a
          href={siteConfig.location.googleMapsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-sm font-bold uppercase tracking-wide hover:underline"
          style={{ color: 'var(--brand-primary)' }}
        >
          Open in Maps →
        </a>
      </div>

      {/* 👇 Customer Name field */}
      <div className="mb-6">
        <label
          className="block text-sm font-bold uppercase tracking-wide mb-2"
          style={{ color: 'var(--ui-text-muted)', fontFamily: 'var(--font-heading)' }}
        >
          Your Name (optional)
        </label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full p-3 border-2 rounded-xl outline-none"
          style={{
            background: 'var(--ui-panel)',
            borderColor: 'var(--ui-border-strong)',
            color: 'var(--ui-text)',
            fontFamily: 'var(--font-body)',
          }}
          placeholder="Enter your name so we know who to thank..."
        />
      </div>

      {/* Cart items */}
      <div className="space-y-4 mb-6">
        {items.map(({ item, quantity }) => (
          <div
            key={item.name}
            className="flex items-center justify-between border-b border-dashed py-3"
            style={{ borderColor: 'var(--ui-border)' }}
          >
            <div className="flex-1">
              <h3 className="font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {item.name}
              </h3>
              <p className="text-sm" style={{ color: 'var(--ui-text-muted)' }}>
                {item.price}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.name, quantity - 1)}
                className="p-1 border-2 rounded-full"
                style={{
                  borderColor: 'var(--brand-primary)',
                  color: 'var(--brand-primary)',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--brand-primary)';
                  e.currentTarget.style.color = 'var(--brand-on-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--brand-primary)';
                }}
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <button
                onClick={() => updateQuantity(item.name, quantity + 1)}
                className="p-1 border-2 rounded-full"
                style={{
                  borderColor: 'var(--brand-primary)',
                  color: 'var(--brand-primary)',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--brand-primary)';
                  e.currentTarget.style.color = 'var(--brand-on-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--brand-primary)';
                }}
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => removeItem(item.name)}
                className="p-1 ml-2"
                style={{ color: 'var(--ui-text-muted)', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ui-text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ui-text-muted)')}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order note */}
      <div className="mb-6">
        <label
          className="block text-sm font-bold uppercase tracking-wide mb-2"
          style={{ color: 'var(--ui-text-muted)', fontFamily: 'var(--font-heading)' }}
        >
          Order Note (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full p-3 border-2 rounded-xl outline-none"
          style={{
            background: 'var(--ui-panel)',
            borderColor: 'var(--ui-border-strong)',
            color: 'var(--ui-text)',
            fontFamily: 'var(--font-body)',
          }}
          placeholder="Add any special requests..."
        />
      </div>

      {/* Total & actions */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t-2 pt-4"
        style={{ borderColor: 'var(--ui-border-strong)' }}
      >
        <div>
          <p className="text-sm" style={{ color: 'var(--ui-text-muted)' }}>
            Total
          </p>
          <p
            className="text-2xl font-bold"
            style={{
              color: 'var(--brand-primary)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            R{totalPrice.toFixed(2)}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="text-sm font-bold uppercase tracking-wide underline"
            style={{
              color: 'var(--ui-text-muted)',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ui-text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ui-text-muted)')}
          >
            Clear Cart
          </button>
          <button
            onClick={handleOrder}
            disabled={isSubmitting}
            className="rounded-full px-6 py-3 font-bold uppercase tracking-[0.12em]"
            style={{
              background: 'var(--brand-primary)',
              color: 'var(--brand-on-primary)',
              border: 'none',
              cursor: 'pointer',
              opacity: isSubmitting ? 0.6 : 1,
              transition: 'opacity 0.15s',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Order via WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};