import React, { useState } from 'react';
import { searchPlaces } from '../../utils/map';
import searchIcon from '../../assets/taxi/search.png';

const Search = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  setLatitude,
  setLongitude,
}) => {
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async () => {
    if (value.trim()) {
      try {
        const searchResults = await searchPlaces(value);
        setResults(searchResults);
        setShowDropdown(true);
      } catch (error) {
        console.error('검색 오류:', error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSelect = (place) => {
    onChange({ target: { name, value: place.place_name } });
    setLatitude(place.y);
    setLongitude(place.x);
    setShowDropdown(false);
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="my-2 relative w-full">
      <div className="flex flex-col w-full">
        <span className="mb-2 text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center justify-start w-full">
          <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            onClick={handleFocus}
            className="w-full py-2 pl-3 text-sm text-gray-800 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent h-10"
          />
          <button
            className="flex items-center justify-center w-10 h-10 text-white bg-main rounded-r-md hover:bg-main-dark"
            onClick={handleSearch}
          >
            검색
          </button>
        </div>
      </div>
      {showDropdown && (
        <ul className="absolute z-10 w-full mt-2 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
          {results.map((place) => (
            <li
              key={place.id}
              className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(place)}
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
