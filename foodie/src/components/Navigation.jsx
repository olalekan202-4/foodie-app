import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 shadow-lg"
    >
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-lime-300">
          FoodieFlash
        </h1>
        <ul className="flex space-x-6">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full ${isActive ? 'bg-teal-500' : 'hover:bg-teal-600'} transition duration-200`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full ${isActive ? 'bg-teal-500' : 'hover:bg-teal-600'} transition duration-200`
              }
            >
              Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/restaurants"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full ${isActive ? 'bg-teal-500' : 'hover:bg-teal-600'} transition duration-200`
              }
            >
              Restaurants
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full ${isActive ? 'bg-teal-500' : 'hover:bg-teal-600'} transition duration-200`
              }
            >
              Search
            </NavLink>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
}

export default Navigation;