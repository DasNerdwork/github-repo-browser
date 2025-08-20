import SearchInput from './SearchInput';
import { useState } from 'react';

export default {
  title: 'Components/SearchInput',
  component: SearchInput,
};

export const Default = () => {
  const [value, setValue] = useState('');
  return (
    <SearchInput
      username={value}
      onChange={setValue}
      onSearch={() => alert('Search: ' + value)}
    />
  );
};
