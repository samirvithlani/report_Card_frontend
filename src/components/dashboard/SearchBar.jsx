import React, { useState } from 'react';
import { TextField, Box, List, ListItem, ListItemText, Paper } from '@mui/material';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Example of static data for suggestions
  const staticSuggestions = [
    "React",
    "React Native",
    "Material-UI",
    "JavaScript",
    "Node.js",
    "MongoDB",
    "Express.js",
    "Redux",
    "Axios",
    "Next.js"
  ];

  // Function to handle input change
  const handleInputChange = (e) => {
    const searchText = e.target.value;
    setQuery(searchText);

    // Filter static suggestions based on input
    if (searchText) {
      const filteredSuggestions = staticSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchText.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle selecting a suggestion
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
      {/* Search input */}
      <TextField
        fullWidth
        label="Search"
        value={query}
        onChange={handleInputChange}
        variant="outlined"
      />
      
      {/* Suggestion dropdown */}
      {suggestions?.length > 0 && (
        <Paper sx={{ position: 'absolute', top: '56px', width: '100%', zIndex: 10 }}>
          <List>
            {suggestions?.map((suggestion, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <ListItemText primary={suggestion} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;
