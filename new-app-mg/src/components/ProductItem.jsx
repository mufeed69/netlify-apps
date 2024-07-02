import React from 'react';
import InputField from './InputField';

const ProductItem = ({ index, product, cost, handleProductChange, handleCostChange }) => {
  return (
    <div className="flex space-y-4 items-center flex-col">
      <InputField
        type="text"
        placeholder="Product"
        value={product}
        onChange={(e) => handleProductChange(index, e.target.value)}
      />
      <InputField
        type="number"
        placeholder="Cost"
        value={cost}
        onChange={(e) => handleCostChange(index, e.target.value)}
      />
    </div>
  );
};

export default ProductItem;
