import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navigation from './components/Navigation.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetails from './components/ProductDetails.jsx';
import Restaurants from './pages/Restaurants.jsx';
import FoodSearchPage from './pages/FoodSearchPage.jsx';

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axios.get(
          'https://api.spoonacular.com/food/ingredients/search',
          {
            params: {
              query: input,
              number: 5,
              apiKey: 'e9fc8273c3734091b5866f2040949683',
            },
          }
        );
        if (!response.data.results || !Array.isArray(response.data.results)) {
          throw new Error('Invalid API response: Expected an array of suggestions.');
        }
        setSuggestions(response.data.results.map((item) => item.name));
      } catch (err) {
        setSuggestions([]);
        setError(err.response?.data?.message || 'Failed to fetch ingredient suggestions.');
        console.error(err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [input]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        {error && (
          <div className="w-full max-w-4xl mx-auto bg-red-200 text-red-800 p-4 rounded-xl mb-6 shadow-lg animate-pulse">
            {error}
          </div>
        )}
        <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                  input={input}
                  setInput={setInput}
                  suggestions={suggestions}
                  setSuggestions={setSuggestions}
                  setError={setError}
                />
              }
            />
            <Route path="/products" element={<Products setError={setError} />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/restaurants" element={<Restaurants setError={setError} />} />
            <Route path="/search" element={<FoodSearchPage setError={setError} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;