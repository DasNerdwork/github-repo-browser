// Header.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../components/Header"; // adjust path

// Meta configuration for Storybook
const meta: Meta<typeof Header> = {
  title: "Components/Header", // Sidebar path in Storybook
  component: Header,
};

export default meta;

// Type for stories
type Story = StoryObj<typeof Header>;

// Default story
export const Default: Story = {
  args: {
    currentLanguage: "en",
    setCurrentLanguage: (lang: "de" | "en" | "es" | "fr") => {
      console.log("Language changed to:", lang);
    },
  },
};

// Story for German selected
export const German: Story = {
  args: {
    currentLanguage: "de",
    setCurrentLanguage: (lang: "de" | "en" | "es" | "fr") => {
      console.log("Language changed to:", lang);
    },
  },
};

// Story for French selected
export const French: Story = {
  args: {
    currentLanguage: "fr",
    setCurrentLanguage: (lang: "de" | "en" | "es" | "fr") => {
      console.log("Language changed to:", lang);
    },
  },
};
