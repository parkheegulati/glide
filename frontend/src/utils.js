/**
 * Format a number as Indian Rupees (₹1,27,400)
 */
export function formatPrice(value) {
  const num = Number(value);
  if (isNaN(num)) return "₹0";
  return "₹" + num.toLocaleString("en-IN");
}
