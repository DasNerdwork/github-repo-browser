# GitHub Repo Browser

A React + Vite + TypeScript project to browse GitHub repositories for a given user.  
Displays repository details, top programming languages, and allows filtering by languages. Includes a theme toggle and multiple UI language support (i18next).

## Features
- Search GitHub repositories by username
- Filter repositories by programming languages
- Dark/light mode toggle
- Multilingual UI support (`en`, `de`, `es`, `fr`)
- Repository cards with top language breakdown
- Netlify Function to securely query GitHub GraphQL API

## Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn
- GitHub personal access token for GraphQL API (stored in `.env` as `GITHUB_TOKEN`)

### Installation
Clone the repository:
```bash
git clone <repo-url>
cd github-repo-browser
```

Install dependencies:
```bash
npm install
```

Create a .env file in the root directory:
```bash
GITHUB_TOKEN=your_personal_github_token
```

### Running the Project

Start the development server:
```bash
npm run dev
```
or if deployed via netfliy
```bash
netlify dev
```

The app will be available at http://localhost:5173, https://localhost:8888
(or the port Vite/Netlify shows).

### Running Storybook

Storybook is set up for component development:
```bash
npm run storybook
```
Open the Storybook interface in your browser to view all components and interact with them in isolation, usually on https://localhost:6006

### Running Tests

The project uses Vitest + Testing Library for unit and integration tests:
```bash
npm run test
```
This will run all tests in the `src/components/__tests__` folder and output results to the terminal.

### Project Structure

```
src/
  components/ # React components
  stories/ # Storybook stories
  types.ts # TypeScript type definitions
  apollo/ # Apollo client
  App.tsx # Main app
  netlify/functions/ # Netlify graphql
  index.css # Tailwind input & config
  locales/ # Translations
```

### Future Improvements

- Improve filter dropdown hover behavior so it doesn’t interfere with repository cards below
- Redesign the intro section to be more visually appealing
- Add more detailed information on repository cards (stars, forks, last updated, etc.)
- Support pagination for users with more than 100 repositories
- Add animations and better mobile responsiveness