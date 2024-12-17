import React, { useState } from 'react';
import { SelectProps } from '@/types';

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
  { onClick, title, isLoading }:
  { onClick: () => void, title: string, isLoading: boolean }
) => (
  <button
    onClick={onClick}
    className={`bg-blue-500 text-white px-1 py-1 rounded-md mt-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    disabled={isLoading}
  >
    {isLoading ? 'Loading...' : title}
  </button>
);

export const Select = (
  { options, value, onChange, title, id }: SelectProps
) => {
  const isValueNumber = typeof value === 'number';
  return (
    <div>
      <label htmlFor={id}>{title}: </label>
      <select
        id={id}
        value={value}
        onChange={
          (event) => onChange(
            isValueNumber ? Number(event.target.value) : event.target.value
          )
      }
      className="border border-gray-300 px-2 py-1 mt-5"
    >
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
      </select>
    </div>
  )
};

export const InputText = (
  { inputType, value, onChange, title, id }: 
  { 
    inputType: string,
    value: string | number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    title: string,
    id: string
  }
) => (
  <div className="flex items-center ">
    <label htmlFor={id} className="mr-4 mt-4">{title}: </label>
    <input
      type={inputType}
      value={value}
      onChange={onChange}
      id={id}
      className="border border-gray-300 px-2 py-1 mt-5"
    />
  </div>
)