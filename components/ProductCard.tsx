type ProductCardProps = {
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({ name, price, image }: ProductCardProps) {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h2 className="font-bold text-xl">{name}</h2>
      <p className="text-gray-700">${price}</p>
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Buy Now
      </button>
    </div>
  );
}
