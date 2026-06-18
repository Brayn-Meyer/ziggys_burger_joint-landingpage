// src/routes/cart.tsx
import { createFileRoute } from '@tanstack/react-router';
import { CartPage } from '@/components/sections/CartPage';

export const Route = createFileRoute('/cart')({
  component: CartPage,
});