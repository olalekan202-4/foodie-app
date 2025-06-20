import { motion } from 'framer-motion';
import { useRef } from 'react';

function PantryInput({ ingredients, setIngredients, input, setInput, suggestions, setSuggestions }) {
  const inputRef = useRef(null);

  const addIngredient = () => {
    if (input.trim() && !ingredients.includes(input.trim())) {
      setIngredients([...ingredients, input.trim()]);
      setInput('');
      setSuggestions([]);
      inputRef.current.focus();
    }
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter((item) => item !== ingredient));
  };

  const clearAll = () => {
    setIngredients([]);
    setInput('');
    setSuggestions([]);
  };

  const selectSuggestion = (suggestion) => {
    if (!ingredients.includes(suggestion)) {
      setIngredients([...ingredients, suggestion]);
    }
    setInput('');
    setSuggestions([]);
    inputRef.current.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white rounded-2xl shadow-2xl p-8 mb-6 border-2 border-gradient-to-r from-orange-500 to-pink-500"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-4 bg-clip-text bg-gradient-to-r from-teal-500 to-lime-500">
        Build Your Pantry
      </h2>
      <div className="relative flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add ingredient (e.g., tomato)"
          className="flex-1 p-4 border-2 border-gradient-to-r from-orange-400 to-pink-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-300 transition duration-200 bg-gray-50 text-gray-800"
          onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
        />
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            onClick={addIngredient}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-pink-600 transition duration-200 shadow-md hover:shadow-lg"
          >
            Add
          </button>
          {ingredients.length > 0 && (
            <button
              onClick={clearAll}
              className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-xl hover:from-gray-500 hover:to-gray-600 transition duration-200 shadow-md hover:shadow-lg"
            >
              Clear All
            </button>
          )}
        </div>
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full sm:w-1/2 bg-white border-2 border-teal-300 rounded-xl shadow-lg mt-2 z-20 max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => selectSuggestion(suggestion)}
                className="p-3 flex items-center space-x-2 hover:bg-gradient-to-r hover:from-teal-100 hover:to-lime-100 cursor-pointer transition duration-150"
              >
                <span className="text-lime-500">🍴</span>
                <span className="text-gray-800">{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {ingredients.map((ingredient, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-r from-lime-200 to-teal-200 text-gray-800 px-4 py-2 rounded-full flex items-center shadow-md hover:scale-105 transition duration-150"
          >
            {ingredient}
            <button
              onClick={() => removeIngredient(ingredient)}
              className="ml-2 text-red-500 hover:text-red-700 transition duration-150"
            >
              ×
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default PantryInput;