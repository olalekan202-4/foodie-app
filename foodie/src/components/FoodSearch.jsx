import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Mock restaurant data for Nigeria
const mockRestaurants = [
  {
    name: 'Lagos Bistro',
    address: '123 Marina St, Lagos, Nigeria',
    rating: 4.5,
    cuisines: ['African', 'Continental'],
    city: 'Lagos',
  },
  {
    name: 'Abuja Grill',
    address: '456 Wuse Zone, Abuja, Nigeria',
    rating: 4.3,
    cuisines: ['Local', 'BBQ'],
    city: 'Abuja',
  },
  {
    name: 'Port Harcourt Seafood Hub',
    address: '789 GRA Phase II, Port Harcourt, Nigeria',
    rating: 4.1,
    cuisines: ['Seafood', 'Nigerian'],
    city: 'Port Harcourt',
  },
];

function FoodSearch({ setError }) {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState({ recipes: [], products: [], restaurants: [] });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const performSearch = async () => {
    if (!searchInput.trim()) {
      setError('Please enter a search term.');
      return;
    }
    setIsLoading(true);
    try {
      // Individual API calls with error handling
      const recipePromise = axios
        .get('https://api.spoonacular.com/recipes/complexSearch', {
          params: {
            query: searchInput,
            number: 5,
            apiKey: 'e9fc8273c3734091b5866f2040949683',
          },
        })
        .catch((err) => ({ error: err, data: { results: [] } }));

      const productPromise = axios
        .get('https://api.spoonacular.com/food/products/search', {
          params: {
            query: searchInput,
            number: 5,
            apiKey: 'e9fc8273c3734091b5866f2040949683',
          },
        })
        .catch((err) => ({ error: err, data: { products: [] } }));

      const restaurantPromise = axios
        .get('https://api.spoonacular.com/food/restaurants/search', {
          params: {
            query: searchInput,
            distance: 5,
            apiKey: 'e9fc8273c3734091b5866f2040949683',
          },
        })
        .catch((err) => ({ error: err, data: { restaurants: [] } }));

      const [recipeRes, productRes, restaurantRes] = await Promise.all([
        recipePromise,
        productPromise,
        restaurantPromise,
      ]);

      let restaurantsToDisplay = restaurantRes.data.restaurants || [];
      const normalizedSearchInput = searchInput.toLowerCase();

      const isNigerianSearch = normalizedSearchInput.includes('nigeria') ||
                               ['lagos', 'abuja', 'port harcourt'].some((city) =>
                                 normalizedSearchInput.includes(city)
                               );

      // Handle restaurant results and mock data fallback
      if (restaurantsToDisplay.length === 0 && (restaurantRes.error || isNigerianSearch)) {
        // If API failed OR it's a Nigerian search (and API returned no results), use mock data
        if (isNigerianSearch) {
          // For Nigerian searches, we now always show all mock data if API fails or is empty
          restaurantsToDisplay = mockRestaurants;
        } else {
          restaurantsToDisplay = []; // For non-Nigerian searches, if API fails/empty, show nothing
        }
      }

      setResults({
        recipes: recipeRes.data.results || [],
        products: productRes.data.products || [],
        restaurants: restaurantsToDisplay,
      });

      const errors = [];
      if (recipeRes.error) errors.push('Failed to fetch recipes.');
      if (productRes.error) errors.push('Failed to fetch products.');

      // Refined error messaging for restaurants
      if (restaurantRes.error && !isNigerianSearch) {
        errors.push('Failed to fetch restaurants. The API might have limited coverage for this location.');
      } else if (restaurantRes.error && isNigerianSearch) {
         // API failed for Nigerian search, but we are displaying mock data
        errors.push('Live restaurant data for this region is limited. Displaying sample Nigerian restaurants.');
      } else if (restaurantsToDisplay.length === 0 && normalizedSearchInput.length > 0 && !isNigerianSearch) {
          // No restaurants found for a non-Nigerian search, and API didn't explicitly error
          errors.push('No restaurants found for this location. The API might have limited coverage.');
      } else if (restaurantsToDisplay.length > 0 && isNigerianSearch && !restaurantRes.error && restaurantRes.data.restaurants?.length === 0) {
          // For Nigerian search, API succeeded but returned empty, so we used mock data.
          errors.push('Live restaurant data for this region is limited. Displaying sample Nigerian restaurants.');
      }


      if (errors.length > 0) setError(errors.join(' '));
    } catch (err) {
      setResults({ recipes: [], products: [], restaurants: [] });
      setError(err.response?.data?.message || 'Failed to fetch search results.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 border-2 border-gradient-to-r from-orange-500 to-pink-500"
    >
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4 bg-clip-text bg-gradient-to-r from-teal-500 to-lime-500">
        Search All Food
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search recipes, products, restaurants (e.g., Lagos, jollof rice, New York)"
          className="flex-1 p-3 sm:p-4 border-2 border-gradient-to-r from-orange-400 to-pink-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-300 transition duration-200 bg-gray-50 text-gray-800"
          onKeyPress={(e) => e.key === 'Enter' && performSearch()}
        />
        <button
          onClick={performSearch}
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-3 rounded-xl hover:from-orange-600 hover:to-pink-600 transition duration-200 shadow-md hover:shadow-lg"
        >
          Search
        </button>
      </div>
      {isLoading ? (
        <p className="text-gray-600 text-center animate-pulse">Loading results...</p>
      ) : (
        <div className="space-y-6">
          {results.recipes.length > 0 && (
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Recipes</h3>
              <ul className="list-disc pl-6">
                {results.recipes.map((recipe, index) => (
                  <li
                    key={recipe.id || index}
                    className="cursor-pointer text-gray-700 hover:text-orange-600 transition duration-150 py-1"
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                  >
                    {recipe.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {results.products.length > 0 && (
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Products</h3>
              <ul className="list-disc pl-6">
                {results.products.map((product, index) => (
                  <li
                    key={product.id || index}
                    className="cursor-pointer text-gray-700 hover:text-orange-600 transition duration-150 py-1"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    {product.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {results.restaurants.length > 0 && (
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Restaurants</h3>
              <ul className="list-disc pl-6">
                {results.restaurants.map((restaurant, index) => (
                  <li key={index} className="text-gray-600 mb-2">
                    {restaurant.name} - {restaurant.address}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!results.recipes.length &&
            !results.products.length &&
            !results.restaurants.length && (
              <p className="text-gray-600 text-center">No results found. Try a different search.</p>
            )}
        </div>
      )}
    </motion.div>
  );
}

export default FoodSearch;