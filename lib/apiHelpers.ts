export async function getProducts() {
  try {
    const res = await fetch("http://localhost:3000/api/products", {
      cache: "no-store", // Next.js caching disable
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
