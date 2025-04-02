import { NewsArticle } from '../../types';

interface NewsItemProps {
  article: NewsArticle;
}

const NewsItem: React.FC<NewsItemProps> = ({ article }) => {
  return (
    <div className="mb-4">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-lg font-medium"
      >
        {article.title}
      </a>
      <p className="text-gray-600 text-sm mt-1">{article.description}</p>
      <p className="text-gray-500 text-sm mt-1">
        Source: {article.source} | Published: {new Date(article.pubDate).toLocaleDateString()}
      </p>
    </div>
  );
};

export default NewsItem;