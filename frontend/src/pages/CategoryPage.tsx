import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getCategories } from "../api/client";
import ProductCard from "../components/ProductCard";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", slug],
    queryFn: () => getProducts(slug),
  });

  const category = categories?.find(c => c.slug === slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{category?.name ?? slug}</h1>
      <p className="text-gray-500 mb-6">{products?.length ?? 0} products found</p>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-gray-100" />)}
        </div>
      ) : products?.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No products found in this category.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products?.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
