
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getArticles } from '@/utils/api';
import { ArrowLeft } from 'lucide-react';
import ArticleCard from '@/components/articles/ArticleCard';
import { Button } from '@/components/ui/button';

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const categoryName = slug ? slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') : '';
  
  // Fetch articles for this category
  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles', 'category', slug],
    queryFn: () => getArticles({ category: categoryName }),
  });
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [slug]);

  const getCategoryDescription = (category: string) => {
    const descriptions: {[key: string]: string} = {
      'Artificial Intelligence': 'Explore the latest developments in AI, machine learning, neural networks, and more.',
      'Web Development': 'Discover modern web technologies, frameworks, best practices, and development techniques.',
      'Cybersecurity': 'Learn about security vulnerabilities, encryption, privacy protection, and security best practices.',
      'Quantum Computing': 'Delve into the fascinating world of quantum mechanics and the future of computing.'
    };
    
    return descriptions[category] || `Articles related to ${category}`;
  };
  
  const getCategoryImage = (category: string) => {
    const images: {[key: string]: string} = {
      'Artificial Intelligence': 'https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      'Web Development': 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      'Cybersecurity': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      'Quantum Computing': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
    };
    
    return images[category] || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80';
  };

  return (
    <div>
      {/* Header with background image */}
      <div 
        className="relative h-64 md:h-80 bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${getCategoryImage(categoryName)})`
        }}
      >
        <div className="content-container text-white z-10">
          <Link to="/articles">
            <Button variant="ghost" className="text-white mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{categoryName}</h1>
          <p className="max-w-2xl text-white/80">
            {getCategoryDescription(categoryName)}
          </p>
        </div>
      </div>
      
      {/* Articles grid */}
      <div className="content-container py-12">
        <h2 className="text-2xl font-semibold mb-8">Latest in {categoryName}</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[360px] bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : !articles || articles.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-muted-foreground/20 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              There are no articles in this category yet.
            </p>
            <Button asChild>
              <Link to="/articles">Browse all articles</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
