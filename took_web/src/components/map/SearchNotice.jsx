import React, { useState } from 'react';
import { searchPlaces } from '../../utils/map';

const SearchNotice = ({
  label,
  name,
  value,
  setTempLocation,
  placeholder,
  setLatitude,
  setLongitude,
  setLocation,
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
    setTempLocation({ target: { name, value: place.place_name } });
    setLocation(place.place_name);
    setLatitude(place.y);
    setLongitude(place.x);
    setShowDropdown(false);
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="p-2 mt-8">
      <div className="text-base font-bold leading-8 text-neutral-600">
        {label}
      </div>
      <div className="flex items-center mb-4 border-b border-gray-300">
        <input
          type="text"
          name={name}
          value={value}
          onChange={setTempLocation}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onClick={handleFocus}
          className="flex-grow bg-transparent py-2 placeholder-gray-300 focus:outline-none focus:border-[#FF7F50]"
        />
        <button
          className="text-white bg-neutral-400/75 mb-1 px-3 py-1.5 rounded-full text-sm font-bold ml-2"
          onClick={handleSearch}
        >
          검색
        </button>
      </div>
      {showDropdown && (
        <ul className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
          {results.map((place) => (
            <li
              key={place.id}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
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

export default SearchNotice;
