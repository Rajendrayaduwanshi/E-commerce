import ProductCard from "../components/ProductCard";
import { getProducts } from "../lib/apiHelpers";

export default async function HomePage() {
  // Backend se products fetch karo
  const products = await getProducts();

  return (
    <div className="my-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Our Store</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard
            key={product._id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
}
