import LanguageFilter from './LanguageFilter';
import { useState } from 'react';

export default {
  title: 'Components/LanguageFilter',
  component: LanguageFilter,
};

export const Default = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const langs = ['JavaScript', 'Python', 'TypeScript', 'Go'];

  return (
    <LanguageFilter
      languages={langs}
      selectedLanguage={selected}
      onSelectLanguage={setSelected}
    />
  );
};
