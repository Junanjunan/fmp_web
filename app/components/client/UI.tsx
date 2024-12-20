import React, { useState } from 'react';
import { SelectProps } from '@/types';

export const CheckboxList = (
  { attributes, title, defaultChecked, onChange }: 
  {
    attributes: string[],
    title: string,
    defaultChecked: string[],
    onChange: (selected: string[]) => void,
  }
) => {
  const [checkedItems, setCheckedItems] = useState<string[]>(defaultChecked);

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

export const CheckboxObjectList = (
  { attributes, title, defaultChecked, onChange }:
  {
    attributes: {
      id: string,
      infoArray: { id: string, name: string }[]
    }[],
    title: string,
    defaultChecked: string[],
    onChange: (selected: string[]) => void,
  }
) => {
  const [checkedItems, setCheckedItems] = useState<string[]>(defaultChecked);
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  const handleCheckboxChange = (id: string) => {
    const updatedCheckedItems = checkedItems.includes(id)
      ? checkedItems.filter(item => item !== id)
      : [...checkedItems, id];
    setCheckedItems(updatedCheckedItems);
    onChange(updatedCheckedItems);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center">
        <span>{title}</span>
        <Button
          onClick={() => setToggleMenu(!toggleMenu)}
          title={toggleMenu ? 'Hide' : 'Show'}
          isLoading={false}
        />
      </div>
      <SymbolCardList items={checkedItems} onClick={handleCheckboxChange} />
      <div className={`space-x-4 flex-wrap ${toggleMenu ? '' : 'hidden'}`}>
        {attributes.map(attribute => {
          return (
            <div key={attribute.id} className="border border-gray-300 p-2">
              <span>{attribute.id}</span>
              <div className="flex">
                {attribute.infoArray.map(info => {
                  return (
                    <div key={info.id} className="flex items-center ml-2">
                      <input
                        type="checkbox"
                        id={info.id}
                        name={info.id}
                        checked={checkedItems.includes(info.id)}
                        onChange={() => handleCheckboxChange(info.id)}
                      />
                      <label htmlFor={info.id}>{info.id}</label>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export const Button = (
  { onClick, title, isLoading }:
  { onClick: () => void, title: string, isLoading: boolean }
) => (
  <button
    onClick={onClick}
    className={`bg-blue-500 text-white px-1 py-1 rounded-md m-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        className="border border-gray-300 px-2 py-1 mt-5"
        onChange={(event) => onChange(
          isValueNumber ? Number(event.target.value) : event.target.value
        )}
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

export const SymbolCard = (
  { item, onClick }: { item: string, onClick: () => void }
) => (
  <div key={item} className="border border-gray-300 p-2 m-1 text-xs">
    <span>{item}</span>
    <button
      onClick={onClick}
      className="bg-blue-300 text-white ml-2 px-1"
    >
      ✕
    </button>
  </div>
)

export const SymbolCardList = (
  { items, onClick }:
  { items: string[], onClick: (item: string) => void }
) => (
  <div className="flex flex-wrap">
    {items.map(item => (
      <SymbolCard
        key={item}
        item={item}
        onClick={() => onClick(item)}
      />
    ))}
  </div>
)