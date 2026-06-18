import { CartItem } from '@/context/CartContext';
import { siteConfig } from '@/siteConfig';

const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};

export const formatWhatsAppOrder = (
  items: CartItem[],
  note: string,
  totalPrice: number,
  customerName?: string   // 👈 added optional param
): string => {
  const lines: string[] = [];
  lines.push('🍔 *NEW ORDER* 🍔');
  lines.push('');

  // 👇 If customer name is provided, add it
  if (customerName && customerName.trim()) {
    lines.push(`👤 *Name:* ${customerName.trim()}`);
    lines.push('');
  }

  items.forEach(({ item, quantity }) => {
    const price = parsePrice(item.price);
    const total = price * quantity;
    lines.push(`• ${item.name} x${quantity} — R${total.toFixed(2)}`);
  });

  lines.push('');
  lines.push(`📍 *Pickup:* ${siteConfig.location.address}`);

  if (note.trim()) {
    lines.push(`📝 *Note:* ${note.trim()}`);
  }

  lines.push('');
  lines.push(`💰 *Total:* R${totalPrice.toFixed(2)}`);
  lines.push('');
  lines.push(`Send this order to Ziggy's on WhatsApp.`);

  return lines.join('\n');
};