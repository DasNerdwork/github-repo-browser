import RepoCard from './RepoCard';

export default {
  title: 'Components/RepoCard',
  component: RepoCard,
};

export const Default = () => {
  const mockRepo = {
    name: 'example-repo',
    languages: {
      totalSize: 100,
      edges: [
        { size: 60, node: { name: 'JavaScript', color: '#f1e05a' } },
        { size: 40, node: { name: 'HTML', color: '#e34c26' } },
      ],
    },
  };

  return <RepoCard repo={mockRepo} />;
};
