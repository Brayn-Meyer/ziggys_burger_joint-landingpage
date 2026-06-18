import React from 'react';
import { useCart } from '@/hooks/useCart';
import { MenuEntry } from '@/siteConfig';

interface Props {
  item: MenuEntry;
  className?: string;
}

export const AddToCartButton = ({ item, className = '' }: Props) => {
  const { addItem } = useCart();

  const handleClick = () => {
    addItem(item);
    window.dispatchEvent(
      new CustomEvent('cart-toast', { detail: { message: `${item.name} added to cart` } })
    );
  };

  return (
    <button
      onClick={handleClick}
      className={`${className}`}
      style={{
        display: 'inline-block',
        background: 'transparent',
        color: 'var(--brand-primary)',
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        fontSize: '0.7rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '0.4rem 1rem',
        border: '2px solid var(--brand-primary)',
        borderRadius: '9999px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
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
      Add to Cart
    </button>
  );
};