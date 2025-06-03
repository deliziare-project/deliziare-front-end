import React, { useState } from 'react';

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  suggestions: string[];
  error?:string;
}

const AutocompleteInput = ({ label, name, value, onChange, placeholder, suggestions,error }: Props) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter((item) =>
    item.toLowerCase().startsWith(value.toLowerCase())
  );

  return (
    <div className="relative mb-4">
      <label htmlFor={name} className="block mb-1 font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        
        onChange={(e) => {
          onChange(e);
          setShowSuggestions(true);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              onMouseDown={() =>
                onChange({ target: { name, value: suggestion } } as React.ChangeEvent<HTMLInputElement>)
              }
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
