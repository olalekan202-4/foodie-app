import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id || id === 'undefined') {
        setError('Invalid product ID.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/food/products/${id}`,
          {
            params: { apiKey: 'e9fc8273c3734091b5866f2040949683' },
          }
        );
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (isLoading) return <p className="text-center text-gray-500 animate-pulse py-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-gradient-to-r from-orange-500 to-pink-500"
    >
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4 bg-clip-text bg-gradient-to-r from-teal-500 to-lime-500">
        {product?.title || 'Product'}
      </h2>
      <div className="mb-6 bg-gradient-to-r from-orange-50 to-pink-100 p-4 sm:p-6 rounded-xl shadow-md">
        {product?.image && (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-40 sm:h-64 object-cover rounded-xl mb-4"
          />
        )}
        <p className="text-gray-700 mb-2 text-sm sm:text-base">
          <strong>Brand:</strong> {product?.brand || 'N/A'}
        </p>
        <p className="text-gray-700 mb-2 text-sm sm:text-base">
          <strong>Price:</strong> {product?.price ? `$${product.price}` : 'N/A'}
        </p>
        <p className="text-gray-700 mb-2 text-sm sm:text-base">
          <strong>Nutrition:</strong>{' '}
          {product?.nutrition?.calories ? `${product.nutrition.calories} kcal` : 'N/A'}
        </p>
        <p className="text-gray-700 text-sm sm:text-base">
          <strong>Description:</strong> {product?.description || 'N/A'}
        </p>
      </div>
    </motion.div>
  );
}

export default ProductDetails;