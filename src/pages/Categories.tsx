
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getArticles } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Folder } from 'lucide-react';

const Categories = () => {
  // Fetch all articles to extract categories
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(),
  });

  // Extract unique categories and count articles per category
  const categoryData = React.useMemo(() => {
    const categories = articles.reduce((acc, article) => {
      const { category } = article;
      if (!acc[category]) {
        acc[category] = {
          name: category,
          count: 0,
        };
      }
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { name: string; count: number }>);

    return Object.values(categories).sort((a, b) => a.name.localeCompare(b.name));
  }, [articles]);

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 pb-20">
      <div className="content-container">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Categories</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our articles by topic to find the information you're looking for.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} className="h-36" />
            ))}
          </div>
        ) : categoryData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryData.map((category) => (
              <Link
                key={category.name}
                to={`/category/${encodeURIComponent(category.name)}`}
                className="flex flex-col items-center justify-center text-center p-6 bg-background border border-border rounded-lg hover:bg-accent/30 transition-colors duration-200 group h-36"
              >
                <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:bg-primary/20 transition-colors">
                  <Folder className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.count} {category.count === 1 ? 'article' : 'articles'}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-6">
              There are no categories available at the moment.
            </p>
            <Button asChild>
              <Link to="/articles">Browse all articles</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
