import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

function Filters({ dietaryPref, setDietaryPref, cookingTime, setCookingTime, cuisine, setCuisine, fetchRecipes }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const resetFilters = () => {
    setDietaryPref('');
    setCookingTime('');
    setCuisine('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 border-2 border-gradient-to-r from-teal-500 to-lime-500"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 text-center sm:text-left">
          Customize Your Recipes
        </h2>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-teal-500 hover:text-teal-600 font-medium transition duration-200 px-4 py-2 rounded-md"
        >
          {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-2 font-semibold text-base sm:text-lg">Dietary Preference</label>
          <select
            value={dietaryPref}
            onChange={(e) => setDietaryPref(e.target.value)}
            className="w-full p-3 sm:p-4 border-2 border-gradient-to-r from-orange-400 to-pink-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-lime-300 transition duration-200 bg-gray-50 text-gray-800"
          >
            <option value="">Any</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="gluten-free">Gluten-Free</option>
            <option value="keto">Keto</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2 font-semibold text-base sm:text-lg">Cooking Time</label>
          <select
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            className="w-full p-3 sm:p-4 border-2 border-gradient-to-r from-orange-400 to-pink-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-lime-300 transition duration-200 bg-gray-50 text-gray-800"
          >
            <option value="">Any</option>
            <option value="15">15 mins or less</option>
            <option value="30">30 mins or less</option>
            <option value="60">60 mins or less</option>
          </select>
        </div>
      </div>
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <label className="block text-gray-700 mb-2 font-semibold text-base sm:text-lg">Cuisine Type</label>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full p-3 sm:p-4 border-2 border-gradient-to-r from-orange-400 to-pink-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-lime-300 transition duration-200 bg-gray-50 text-gray-800"
            >
              <option value="">Any</option>
              <option value="Italian">Italian</option>
              <option value="Asian">Asian</option>
              <option value="Mexican">Mexican</option>
              <option value="American">American</option>
            </select>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
        <button
          onClick={fetchRecipes}
          className="flex-1 bg-gradient-to-r from-teal-500 to-lime-500 text-white py-3 rounded-xl hover:from-teal-600 hover:to-lime-600 transition duration-200 shadow-md hover:shadow-lg"
        >
          Find Recipes
        </button>
        <button
          onClick={resetFilters}
          className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 rounded-xl hover:from-gray-500 hover:to-gray-600 transition duration-200 shadow-md hover:shadow-lg"
        >
          Reset Filters
        </button>
      </div>
    </motion.div>
  );
}

export default Filters;