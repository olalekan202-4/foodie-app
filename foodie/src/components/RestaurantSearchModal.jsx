import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';

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

function RestaurantSearchModal({ setShowModal, setErrorModal }) {
  const [locationInput, setLocationInput] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const searchRestaurants = async () => {
    if (!locationInput.trim()) {
      setError('Please enter a city or location to search.');
      return;
    }
    setIsLoading(true);
    setError('');

    const normalizedInput = locationInput.toLowerCase();
    const isNigerianSearch = normalizedInput.includes('nigeria') ||
                             ['lagos', 'abuja', 'port harcourt'].some((city) => normalizedInput.includes(city));

    try {
      const response = await axios.get(
        'https://api.spoonacular.com/food/restaurants/search',
        {
          params: {
            query: locationInput,
            distance: 5,
            apiKey: 'e9fc8273c3734091b5866f2040949683',
          },
        }
      );

      const apiRestaurants = response.data.restaurants || [];

      if (apiRestaurants.length === 0 && isNigerianSearch) {
        // API returned no results, but it's a Nigerian search, use ALL mock data
        setRestaurants(mockRestaurants); // Display all mock restaurants for Nigerian searches
        setError('Live restaurant data for this region is limited. Displaying sample Nigerian restaurants.');
      } else if (apiRestaurants.length > 0) {
        // API returned results
        setRestaurants(apiRestaurants);
      } else {
        // API returned no results for a non-Nigerian search, or for an unknown Nigerian city
        setRestaurants([]);
        setError('No restaurants found for this location. The API might have limited coverage.');
        setErrorModal('No restaurants found for this location. The API might have limited coverage.');
      }

    } catch (err) {
      console.error(err);
      // Fallback to ALL mock data for Nigeria on API failure
      if (isNigerianSearch) {
        setRestaurants(mockRestaurants); // Display all mock restaurants for Nigerian searches on API error
        setError('Live restaurant data for this region is limited. Displaying sample Nigerian restaurants.');
      } else {
        // Generic error for non-Nigerian searches
        const errMsg = err.response?.data?.message || 'Failed to fetch restaurants. Try a more general location or a known Nigerian city.';
        setError(errMsg);
        setErrorModal(errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        onClick={() => setShowModal(false)}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-6 sm:p-8 max-w-md sm:max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gradient-to-r from-orange-500 to-pink-500"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 bg-clip-text bg-gradient-to-r from-teal-500 to-lime-500">
            Search Restaurants
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 mb-6">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter a city, state, or country (e.g., New York, Lagos)"
              className="flex-1 p-3 sm:p-4 border-2 border-gradient-to-r from-orange-400 to-pink-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-300 transition duration-200 bg-gray-50 text-gray-800"
              onKeyPress={(e) => e.key === 'Enter' && searchRestaurants()}
            />
            <button
              onClick={searchRestaurants}
              className="bg-gradient-to-r from-teal-500 to-lime-500 text-white px-5 py-3 rounded-xl hover:from-teal-600 hover:to-teal-600 transition duration-200 shadow-md hover:shadow-lg"
            >
              Search
            </button>
          </div>
          {isLoading ? (
            <p className="text-gray-500 text-center animate-pulse py-4">Loading restaurants...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-4 text-sm sm:text-base">{error}</p>
          ) : restaurants.length > 0 ? (
            <ul className="list-none">
              {restaurants.map((restaurant, index) => (
                <li
                  key={index}
                  className="mb-4 bg-gradient-to-r from-orange-50 to-pink-100 p-4 rounded-xl text-sm sm:text-base"
                >
                  <h4 className="text-base sm:text-lg font-bold text-gray-800">{restaurant.name}</h4>
                  <p className="text-gray-600">{restaurant.address}</p>
                  <p className="text-gray-600">Rating: {restaurant.rating || 'N/A'}</p>
                  <p className="text-gray-600">
                    Cuisine: {restaurant.cuisines?.join(', ') || 'N/A'}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center py-4 text-sm sm:text-base">Enter a city, state, or country to find restaurants. Try a known Nigerian city for sample data.</p>
          )}
          <button
            onClick={() => setShowModal(false)}
            className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 rounded-xl hover:from-gray-500 hover:to-gray-600 transition duration-200 shadow-md hover:shadow-lg mt-6"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default RestaurantSearchModal;