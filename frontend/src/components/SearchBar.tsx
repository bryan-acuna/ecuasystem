import { useState } from 'react';
import { TextField, IconButton } from '@radix-ui/themes';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = query.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/');
  };

  return (
    <TextField.Root
      placeholder="Search products..."
      value={query}
      onChange={e => setQuery(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && handleSearch()}
      aria-label="Search products"
    >
      <TextField.Slot side="right">
        <IconButton size="1" variant="ghost" onClick={handleSearch} aria-label="Search">
          <Search size={14} />
        </IconButton>
      </TextField.Slot>
    </TextField.Root>
  );
};

export default SearchBar;
