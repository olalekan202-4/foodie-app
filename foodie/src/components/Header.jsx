import { motion } from 'framer-motion';

function Header({ favoritesCount, setShowFavorites, showFavorites }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto bg-gradient-to-r from-orange-600 to-pink-600 p-4 sm:p-6 rounded-2xl shadow-2xl mb-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0" // Responsive flex and spacing
    >
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-teal-500 to-lime-500">
        FoodieFlash
      </h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`px-4 py-2 rounded-xl font-medium text-sm sm:text-base transition duration-200 ${ // Adjusted font size
            showFavorites
              ? 'bg-teal-500 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {showFavorites ? 'All Ingredients' : `My Favorites (${favoritesCount})`}
        </button>
      </div>
    </motion.div>
  );
}

export default Header;