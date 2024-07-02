// InputField.js
import React from 'react';

function InputField(props) {
  const { className } = props;
  return (
    <input
      {...props}
      className={`block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className || ''}`}
    />
  );
}

export default InputField;
