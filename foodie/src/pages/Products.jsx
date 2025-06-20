import { useState } from 'react';
import ProductSearch from '../components/ProductSearch.jsx';
import ProductDetails from '../components/ProductDetails.jsx';

function Products({ setError }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div>
      <ProductSearch setSelectedProduct={setSelectedProduct} setError={setError} />
      {selectedProduct && <ProductDetails />}
    </div>
  );
}

export default Products;