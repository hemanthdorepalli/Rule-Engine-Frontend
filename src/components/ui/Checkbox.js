import React from 'react';

const Checkbox = ({ id, checked, onCheckedChange, label }) => {
  const handleCheckboxChange = (e) => {
    onCheckedChange(e.target.checked);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleCheckboxChange}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
      />
      {label && (
        <label htmlFor={id} className="text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
