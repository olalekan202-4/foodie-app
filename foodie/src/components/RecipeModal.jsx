import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

function RecipeModal({ recipe, setSelectedRecipe, ingredients }) {
  const [detailedRecipe, setDetailedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [amounts, setAmounts] = useState({});
  const [substitutes, setSubstitutes] = useState({});
  const [targetUnit, setTargetUnit] = useState({});

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${recipe.id}/information`,
          {
            params: { apiKey: 'e9fc8273c3734091b5866f2040949683' },
          }
        );
        setDetailedRecipe(response.data);

        const substitutePromises = recipe.missedIngredients?.map(async (ing) => {
          try {
            const subRes = await axios.get(
              `https://api.spoonacular.com/food/ingredients/substitutes`,
              {
                params: {
                  ingredientName: ing.name,
                  apiKey: 'e9fc8273c3734091b5866f2040949683',
                },
              }
            );
            return { name: ing.name, substitutes: subRes.data.substitutes || [] };
          } catch {
            return { name: ing.name, substitutes: [] };
          }
        }) || [];
        const subs = await Promise.all(substitutePromises);
        setSubstitutes(subs.reduce((acc, sub) => ({ ...acc, [sub.name]: sub.substitutes }), {}));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch recipe details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipe.id, recipe.missedIngredients]);

  const convertAmount = async (ingredientId, amount, sourceUnit, target, ingName) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/food/ingredients/${ingredientId}/amount`,
        {
          params: {
            sourceAmount: amount,
            sourceUnit,
            targetUnit: target,
            apiKey: 'e9fc8273c3734091b5866f2040949683',
          },
        }
      );
      setAmounts((prev) => ({
        ...prev,
        [ingName]: response.data.target.amount,
      }));
      setTargetUnit((prev) => ({
        ...prev,
        [ingName]: target,
      }));
    } catch (err) {
      setError('Failed to convert amount.');
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        onClick={() => setSelectedRecipe(null)}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-gradient-to-r from-orange-500 to-pink-500"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4 bg-clip-text bg-gradient-to-r from-teal-500 to-lime-500">
            {recipe.title}
          </h2>
          {isLoading ? (
            <p className="text-gray-700 text-center animate-pulse">Loading recipe details...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <>
              <div className="mb-6 bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-xl">
                <p className="text-gray-700 flex items-center space-x-2">
                  <span className="text-lime-500">⏰</span>
                  <span>
                    <strong>Time:</strong>{' '}
                    {detailedRecipe?.readyInMinutes || recipe.readyInMinutes || 'N/A'} mins
                  </span>
                </p>
                <p className="text-gray-700 flex items-center space-x-2">
                  <span className="text-lime-500">🥗</span>
                  <span>
                    <strong>Dietary:</strong>{' '}
                    {detailedRecipe?.diets?.length > 0
                      ? detailedRecipe.diets.join(', ')
                      : recipe.diets?.length > 0
                      ? recipe.diets.join(', ')
                      : 'N/A'}
                  </span>
                </p>
                <p className="text-gray-700 flex items-center space-x-2">
                  <span className="text-lime-500">🌍</span>
                  <span>
                    <strong>Cuisine:</strong>{' '}
                    {detailedRecipe?.cuisines?.length > 0
                      ? detailedRecipe.cuisines.join(', ')
                      : recipe.cuisines?.length > 0
                      ? recipe.cuisines.join(', ')
                      : 'N/A'}
                  </span>
                </p>
                {detailedRecipe?.servings && (
                  <p className="text-gray-700 flex items-center space-x-2">
                    <span className="text-lime-500">🍽️</span>
                    <span>
                      <strong>Servings:</strong> {detailedRecipe.servings}
                    </span>
                  </p>
                )}
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
                  <span className="text-orange-500">📋</span>
                  <span>Ingredients</span>
                </h3>
                {detailedRecipe?.extendedIngredients?.length > 0 ? (
                  <ul className="list-disc pl-6 text-gray-700">
                    {detailedRecipe.extendedIngredients.map((ing, index) => (
                      <li key={index} className="mb-2">
                        <div className="flex flex-col">
                          <span>
                            {ing.amount} {ing.unit} {ing.name}{' '}
                            {amounts[ing.name] && `(${amounts[ing.name]} ${targetUnit[ing.name]})`}
                          </span>
                          {ingredients.includes(ing.name) ? (
                            <span className="text-green-500 text-sm">✔️ In Pantry</span>
                          ) : (
                            <>
                              {substitutes[ing.name]?.length > 0 && (
                                <span className="text-gray-500 text-sm">
                                  Substitutes: {substitutes[ing.name].join(', ')}
                                </span>
                              )}
                              <div className="flex space-x-2 mt-1">
                                <select
                                  onChange={(e) =>
                                    setTargetUnit((prev) => ({
                                      ...prev,
                                      [ing.name]: e.target.value,
                                    }))
                                  }
                                  className="p-1 border-2 border-teal-300 rounded-md text-sm"
                                >
                                  <option value="">Convert to...</option>
                                  <option value="gram">Gram</option>
                                  <option value="cup">Cup</option>
                                  <option value="tablespoon">Tablespoon</option>
                                  <option value="teaspoon">Teaspoon</option>
                                </select>
                                <button
                                  onClick={() =>
                                    convertAmount(
                                      ing.id || ing.aisle.split('|')[0], // Fallback for ID
                                      ing.amount,
                                      ing.unit,
                                      targetUnit[ing.name],
                                      ing.name
                                    )
                                  }
                                  className="bg-teal-500 text-white px-2 py-1 rounded-md text-sm hover:bg-teal-600 transition duration-150"
                                  disabled={!targetUnit[ing.name]}
                                >
                                  Convert
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-700 font-semibold flex items-center space-x-2">
                        <span className="text-green-500">✔️</span>
                        <span>Available</span>
                      </p>
                      <ul className="list-disc pl-6 text-gray-700 mt-1">
                        {recipe.usedIngredients?.map((ing, index) => (
                          <li key={index}>{ing.name}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold flex items-center space-x-2">
                        <span className="text-red-500">❌</span>
                        <span>Missing</span>
                      </p>
                      <ul className="list-disc pl-6 text-gray-500 mt-1">
                        {recipe.missedIngredients?.map((ing, index) => (
                          <li key={index}>
                            {ing.name}
                            {substitutes[ing.name]?.length > 0 && (
                              <span className="text-gray-500 text-sm">
                                {' '}
                                (Substitutes: {substitutes[ing.name].join(', ')})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
                  <span className="text-pink-500">🍽️</span>
                  <span>Instructions</span>
                </h3>
                {detailedRecipe?.analyzedInstructions?.length > 0 ? (
                  <ol className="list-decimal pl-6 text-gray-700">
                    {detailedRecipe.analyzedInstructions[0].steps.map((step, index) => (
                      <li key={index} className="mb-2">
                        {step.step}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-700">
                    No detailed instructions available. Check the recipe source for more details.
                  </p>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => alert('Share recipe (to be implemented)')}
                  className="flex-1 bg-gradient-to-r from-lime-500 to-teal-500 text-white py-3 rounded-xl hover:from-lime-600 hover:to-teal-600 transition duration-200 shadow-md hover:shadow-lg"
                >
                  Share
                </button>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 rounded-xl hover:from-gray-500 hover:to-gray-600 transition duration-200 shadow-md hover:shadow-lg"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default RecipeModal;