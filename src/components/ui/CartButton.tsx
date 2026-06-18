import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart } from 'lucide-react';

export const CartButton = () => {
  const navigate = useNavigate();
  const { totalQuantity } = useCart();

  const handleClick = () => {
    if (totalQuantity === 0) {
      window.dispatchEvent(
        new CustomEvent('cart-toast', {
          detail: { message: 'Your cart is empty. Browse the menu first.' },
        })
      );
      navigate({ to: '/menu' });
    } else {
      navigate({ to: '/cart' });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex items-center justify-center"
      style={{
        width: '2.5rem',
        height: '2.5rem',
        border: '2px solid var(--brand-primary)',
        borderRadius: '9999px',
        background: 'transparent',
        color: 'var(--brand-primary)',
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
      <ShoppingCart size={18} />
      {totalQuantity > 0 && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center min-w-[1.2rem] h-[1.2rem] px-1 text-[0.6rem] font-black"
          style={{
            background: 'var(--brand-primary)',
            color: 'var(--brand-on-primary)',
            borderRadius: '9999px',
            border: '1px solid var(--ui-panel)',
          }}
        >
          {totalQuantity > 99 ? '99+' : totalQuantity}
        </span>
      )}
    </button>
  );
};