import { useState } from 'react';
import RestaurantSearchModal from '../components/RestaurantSearchModal.jsx';
import { motion } from 'framer-motion';

function Restaurants({ setError }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-clip-text bg-gradient-to-r from-teal-500 to-lime-500">
        Discover Restaurants
      </h2>
      <button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-pink-600 transition duration-200 shadow-md hover:shadow-lg"
      >
        Search Restaurants
      </button>
      {showModal && <RestaurantSearchModal setShowModal={setShowModal} setErrorModal={setError} />}
    </motion.div>
  );
}

export default Restaurants;