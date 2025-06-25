import { motion } from 'framer-motion';

function RecipeList({ recipes, isLoading, favorites, toggleFavorite, setSelectedRecipe, fetchMoreRecipes, hasMore, showFavorites }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-0"> {/* Added max-w-4xl and horizontal padding */}
      {isLoading ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-700 text-lg sm:text-xl font-medium animate-pulse py-8"
        >
          Loading recipes...
        </motion.p>
      ) : (
        <div>
          {recipes.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-700 text-lg sm:text-xl font-medium py-8"
            >
              No recipes found. Add ingredients to start!
            </motion.p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {recipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl shadow-2xl p-4 sm:p-6 mb-6 hover:scale-105 transition duration-300 border-2 border-teal-300"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6"> {/* Responsive flex */}
                    {/* Image placeholder - consider making it an actual image from recipe.image */}
                    <div className="w-full h-32 sm:w-20 sm:h-20 bg-gradient-to-r from-lime-300 to-teal-300 rounded-xl flex-shrink-0 shadow-md" />
                    <div className="flex-1 w-full"> {/* Ensure it takes full width on small screens */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-0"> {/* Responsive title and favorite */}
                        <h3
                          className="text-lg sm:text-xl font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition duration-150 mb-2 sm:mb-0"
                          onClick={() => setSelectedRecipe(recipe)}
                        >
                          {recipe.title}
                        </h3>
                        <button
                          onClick={() => toggleFavorite(recipe)}
                          className={`text-3xl ${
                            favorites.some((fav) => fav.id === recipe.id)
                              ? 'text-red-500'
                              : 'text-gray-400'
                          } hover:text-red-600 transition duration-150`}
                        >
                          {favorites.some((fav) => fav.id === recipe.id) ? '♥' : '♡'}
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        Time: {recipe.readyInMinutes || 'N/A'} mins
                      </p>
                      <p className="text-gray-600 text-sm">
                        Dietary: {recipe.diets?.length > 0 ? recipe.diets.join(', ') : 'N/A'}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Cuisine: {recipe.cuisines?.length > 0 ? recipe.cuisines.join(', ') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {hasMore && !showFavorites && (
                <button
                  onClick={fetchMoreRecipes}
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl transition duration-200 shadow-md hover:shadow-lg mt-6 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-orange-600 hover:to-pink-600'
                  }`}
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

export default RecipeList;