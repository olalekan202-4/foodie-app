import { useState } from 'react';
import ProductSearch from '../components/ProductSearch.jsx';
import ProductDetails from '../components/ProductDetails.jsx';

function Products({ setError }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6"> {/* Added max-w-4xl and padding */}
      <ProductSearch setSelectedProduct={setSelectedProduct} setError={setError} />
      {selectedProduct && <ProductDetails />}
    </div>
  );
}

export default Products;