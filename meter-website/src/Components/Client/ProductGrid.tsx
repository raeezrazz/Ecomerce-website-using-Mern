import React , {useState} from 'react'
import { ShoppingCart, Star } from 'lucide-react'
import SortAndViewControls from './SortAndViewControls';
import Pagination from '../Common/Pagination';


const products = [
  {
    id: 1,
    name: "Pulsar 220 Digital Speedometer",
    price: 1200,
    image: "/images/speedometer.jpg",
    isNew: true,
  },
  {
    id: 2,
    name: "Yamaha Fz Digital Speedometer",
    price: 2200,
    image: "/images/cluster.jpg",
    discount: "20% Off",
  },
  {
    id: 2,
    name: "Yamaha R15 Digital Speedometer",
    price: 2200,
    image: "/images/cluster.jpg",
    discount: "20% Off",
  },
  {
    id: 2,
    name: "Hero Glamour Digital Speedometer",
    price: 2200,
    image: "/images/cluster.jpg",
    discount: "20% Off",
  },
];

const ProductGrid = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 3;

    
     const totalPages = Math.ceil(products.length / productsPerPage);
     const paginatedProducts = products.slice(
        (currentPage - 1) * productsPerPage,
         currentPage * productsPerPage
  );
  return (
    <div className="md:w-3/4 w-full">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      <SortAndViewControls/>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedProducts.map((product) => (
          <div key={product.id} className="border rounded-lg shadow p-4 relative">
            {product.isNew && (
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">New</span>
            )}
            {product.discount && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">{product.discount}</span>
            )}
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded" />
            <h3 className="mt-4 font-semibold">{product.name}</h3>
            <p className="text-blue-600 font-bold">₹{product.price}</p>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`w-4 h-4 ${i <= 3 ? "text-yellow-500" : "text-gray-300"}`} />
              ))}
            </div>
            <button className="mt-4 bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default ProductGrid;
