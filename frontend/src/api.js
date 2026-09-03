const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function fetchProducts({ category, search } = {}) {
  const params = new URLSearchParams();
  if (category && category !== "All") params.append("category", category);
  if (search && search.trim()) params.append("search", search.trim());

  const queryString = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`${API_BASE}/api/products${queryString}`);
  if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
  return res.json();
}

export async function fetchProduct(slug) {
  const res = await fetch(`${API_BASE}/api/products/${slug}`);
  if (res.status === 404) throw new Error("Product not found");
  if (!res.ok) throw new Error(`Failed to fetch product (${res.status})`);
  return res.json();
}

export async function fetchEmiPlans(slug, variantId) {
  const res = await fetch(
    `${API_BASE}/api/products/${slug}/variants/${variantId}/emi-plans`
  );
  if (!res.ok) throw new Error(`Failed to fetch EMI plans (${res.status})`);
  return res.json();
}

export async function sendChatMessage(message) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error(`Chat error (${res.status})`);
  return res.json();
}
