// src/components/News/NewsItem.tsx
import { NewsArticle } from '../../types';

interface NewsItemProps {
  article: NewsArticle;
  className?: string;
}

const NewsItem: React.FC<NewsItemProps> = ({ article, className }) => {
  return (
    <div className={`card ${className}`}>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 text-base sm:text-lg font-medium transition-colors"
        aria-label={`Read news article: ${article.title} from ${article.source}`}
      >
        {article.title}
      </a>
      <p className="text-gray-600 text-xs sm:text-sm mt-2">{article.description}</p>
      <p className="text-gray-500 text-xs sm:text-sm mt-2">
        Source: {article.source} | Published: {new Date(article.pubDate).toLocaleDateString()}
      </p>
    </div>
  );
};

export default NewsItem;