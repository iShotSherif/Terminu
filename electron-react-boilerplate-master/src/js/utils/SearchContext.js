import React, { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const value = {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};