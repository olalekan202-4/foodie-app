import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProductSearch({ setSelectedProduct, setError }) {
  const [searchInput, setSearchInput] = useState('');
  const [productSuggestions, setProductSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductSuggestions = async () => {
      if (searchInput.length < 2) {
        setProductSuggestions([]);
        return;
      }
      try {
        const response = await axios.get(
          'https://api.spoonacular.com/food/products/suggest',
          {
            params: {
              query: searchInput,
              number: 5,
              apiKey: 'e9fc8273c3734091b5866f2040949683',
            },
          }
        );
        if (!Array.isArray(response.data.results)) {
          throw new Error('Invalid API response: Expected an array of product suggestions.');
        }
        setProductSuggestions(response.data.results);
      } catch (err) {
        setProductSuggestions([]);
        setError(err.response?.data?.message || 'Failed to fetch product suggestions.');
        console.error(err);
      }
    };

    const debounce = setTimeout(fetchProductSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchInput, setError]);

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setSearchInput('');
    setProductSuggestions([]);
    navigate(`/products/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 border-2 border-gradient-to-r from-orange-500 to-pink-500"
    >
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4 bg-clip-text bg-gradient-to-r from-teal-500 to-lime-500">
        Find Products
      </h2>
      <div className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for products (e.g., pasta sauce)"
          className="w-full p-3 sm:p-4 border-2 border-gradient-to-r from-orange-400 to-pink-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-300 transition duration-200 bg-gray-50 text-gray-800"
        />
        {productSuggestions.length > 0 && (
          <ul className="absolute w-full bg-white border-2 border-teal-300 rounded-xl shadow-lg mt-2 z-20 max-h-48 overflow-y-auto text-sm sm:text-base"> {/* Adjusted font size */}
            {productSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => selectProduct(suggestion)}
                className="p-3 flex items-center space-x-2 hover:bg-gradient-to-r hover:from-teal-100 hover:to-lime-100 cursor-pointer transition duration-200"
              >
                <span className="text-lime-500">🛒</span>
                <span className="text-gray-800">{suggestion.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export default ProductSearch;