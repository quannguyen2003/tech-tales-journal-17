
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getArticles } from '@/utils/api';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import ArticleCard from '@/components/articles/ArticleCard';
import { Search } from 'lucide-react';

const Articles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch all articles
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['articles', 'all'],
    queryFn: () => getArticles({ limit: 50 }),
  });

  // Extract unique categories from articles
  const categories = articles
    ? [...new Set(articles.map(article => article.category))]
    : [];

  // Filter articles based on search term and selected category
  const filteredArticles = articles
    ? articles.filter(article => {
        const matchesSearch = searchTerm
          ? article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        
        const matchesCategory = selectedCategory
          ? article.category === selectedCategory
          : true;
        
        return matchesSearch && matchesCategory;
      })
    : [];

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container py-12 max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Articles</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover our latest articles on technology, programming, and digital innovation
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Search and filter section */}
        <div className="w-full md:w-1/4 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Search</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search articles..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              <button
                className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedCategory === null ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </button>
              
              {categories.map(category => (
                <button
                  key={category}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === category ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles grid */}
        <div className="w-full md:w-3/4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[360px] bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-12 text-destructive">
              Error loading articles. Please try again.
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed border-muted-foreground/20 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map(article => (
                <ArticleCard 
                  key={article.id} 
                  article={article}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;
