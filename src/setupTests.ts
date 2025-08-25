import '@testing-library/jest-dom';
import { vi } from 'vitest';

// react-i18next mock
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn() },
  }),
}));

// i18next mock (für t importiert aus 'i18next')
vi.mock('i18next', () => ({
  t: (key: string) => key, // gibt einfach den Key zurück
}));
