export function getCartSummary(items: Array<{ quantity: number }>) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return {
    totalItems,
    itemLabel: totalItems === 1 ? 'item' : 'items',
  };
}
