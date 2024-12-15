import React, { useState } from 'react';

export const CheckboxList = (
  { attributes, title, onChange }: 
  { attributes: string[], title: string, onChange: (selected: string[]) => void }
) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleCheckboxChange = (attribute: string) => {
    const updatedCheckedItems = checkedItems.includes(attribute)
      ? checkedItems.filter(item => item !== attribute)
      : [...checkedItems, attribute];
    setCheckedItems(updatedCheckedItems);
    onChange(updatedCheckedItems);
  };

  return (
    <div className="mb-4">
      <div>{title}</div>
      <div className="flex space-x-4 flex-wrap">
        {attributes.map((attribute) => {
          return (
            <div key={attribute}>
              <input 
                type="checkbox" 
                id={attribute} 
                name={attribute} 
                checked={checkedItems.includes(attribute)} 
                onChange={() => handleCheckboxChange(attribute)} 
              />
              <label htmlFor={attribute}>{attribute}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Button = (
  { onClick, title }: { onClick: () => void, title: string }
) => (
  <button
    onClick={onClick}
    className="bg-blue-500 text-white px-1 py-1 rounded-md mt-2"
  >
    {title}
  </button>
);
