import React, { useState } from 'react';
import { Search, MapPin, Layers, ArrowRight } from 'lucide-react';
import { mockCategories } from '../../data/mockCategories';
import Button from '../common/Button';

const SearchBar = ({ initialKeyword = '', initialLocation = '', initialCategory = 'all', onSearch }) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword, location, category });
    }
  };

  return (
    <form className="hero-search-bar" onSubmit={handleSubmit}>
      {/* Title / Keyword */}
      <div className="search-field">
        <Search className="search-field-icon" size={20} />
        <input
          type="text"
          placeholder="Job title, keywords, or company"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* Location */}
      <div className="search-field">
        <MapPin className="search-field-icon" size={20} />
        <input
          type="text"
          placeholder="City, state, or 'Remote'"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="search-field">
        <Layers className="search-field-icon" size={20} />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Job Categories</option>
          {mockCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Search Submit */}
      <Button type="submit" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
        Search Jobs
      </Button>
    </form>
  );
};

export default SearchBar;
