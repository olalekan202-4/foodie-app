import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header.jsx';
import PantryInput from '../components/PantryInput.jsx';
import Filters from '../components/Filters.jsx';
import RecipeList from '../components/RecipeList.jsx';
import RecipeModal from '../components/RecipeModal.jsx';

function Home({ ingredients, setIngredients, input, setInput, suggestions, setSuggestions, setError }) {
  const [dietaryPref, setDietaryPref] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const recipesPerPage = 10;

  useEffect(() => {
    const savedPantryItems = localStorage.getItem('foodieFlashPantry');
    const savedFavorites = localStorage.getItem('foodieFlashFavorites');
    if (savedPantryItems) setIngredients(JSON.parse(savedPantryItems));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, [setIngredients]);

  useEffect(() => {
    localStorage.setItem('foodieFlashPantry', JSON.stringify(ingredients));
    localStorage.setItem('foodieFlashFavorites', JSON.stringify(favorites));
  }, [ingredients, favorites]);

  const fetchRecipes = async (page = 1, append = false) => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(
        'https://api.spoonacular.com/recipes/findByIngredients',
        {
          params: {
            ingredients: ingredients.join(','),
            number: recipesPerPage,
            offset: (page - 1) * recipesPerPage,
            ranking: 1,
            apiKey: 'e9fc8273c3734091b5866f2040949683',
          },
        }
      );
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid API response: Expected an array of recipes.');
      }
      const newRecipes = response.data.filter((recipe) => {
        const timeMatch = !cookingTime || recipe.readyInMinutes <= parseInt(cookingTime);
        const dietMatch = !dietaryPref || recipe.diets?.includes(dietaryPref);
        const cuisineMatch = !cuisine || recipe.cuisines?.includes(cuisine);
        return timeMatch && dietMatch && cuisineMatch;
      });
      setRecipes((prev) => (append ? [...prev, ...newRecipes] : newRecipes));
      setHasMore(newRecipes.length === recipesPerPage);
    } catch (err) {
      const mockRecipes = [
        {
          id: 1,
          title: 'Tomato Pasta',
          readyInMinutes: 20,
          diets: ['vegetarian'],
          cuisines: ['Italian'],
          usedIngredients: [{ name: 'tomato' }, { name: 'pasta' }],
          missedIngredients: [],
        },
        {
          id: 2,
          title: 'Chicken Stir Fry',
          readyInMinutes: 15,
          diets: [],
          cuisines: ['Asian'],
          usedIngredients: [{ name: 'chicken' }, { name: 'rice' }],
          missedIngredients: [{ name: 'soy sauce' }],
        },
      ];
      setRecipes((prev) => (append ? [...prev, ...mockRecipes] : mockRecipes));
      setError(err.response?.data?.message || 'Failed to fetch recipes. Using mock data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoreRecipes = () => {
    setCurrentPage((prev) => prev + 1);
    fetchRecipes(currentPage + 1, true);
  };

  useEffect(() => {
    setCurrentPage(1);
    setRecipes([]);
    fetchRecipes(1, false);
  }, [ingredients, dietaryPref, cookingTime, cuisine]);

  const toggleFavorite = (recipe) => {
    const isFavorited = favorites.some((fav) => fav.id === recipe.id);
    if (isFavorited) {
      setFavorites(favorites.filter((fav) => fav.id !== recipe.id));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Header
        favoritesCount={favorites.length}
        setShowFavorites={setShowFavorites}
        showFavorites={showFavorites}
      />
      <PantryInput
        ingredients={ingredients}
        setIngredients={setIngredients}
        input={input}
        setInput={setInput}
        suggestions={suggestions}
        setSuggestions={setSuggestions}
      />
      <Filters
        dietaryPref={dietaryPref}
        setDietaryPref={setDietaryPref}
        cookingTime={cookingTime}
        setCookingTime={setCookingTime}
        cuisine={cuisine}
        setCuisine={setCuisine}
        fetchRecipes={() => fetchRecipes(1, false)}
      />
      <RecipeList
        recipes={showFavorites ? favorites : recipes}
        isLoading={isLoading}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        setSelectedRecipe={setSelectedRecipe}
        fetchMoreRecipes={fetchMoreRecipes}
        hasMore={hasMore}
        showFavorites={showFavorites}
      />
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
          ingredients={ingredients}
        />
      )}
    </div>
  );
}

export default Home;