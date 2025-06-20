import { motion } from 'framer-motion';

function Header({ favoritesCount, setShowFavorites, showFavorites }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-gradient-to-r from-orange-600 to-pink-600 p-6 rounded-2xl shadow-2xl mb-6 flex justify-between items-center"
    >
      <h1 className="text-4xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-teal-500 to-lime-500">
        FoodieFlash
      </h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`px-4 py-2 rounded-xl font-medium transition duration-200 ${
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