
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getArticles, deleteArticle, Article } from '@/utils/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Pencil, Trash2, Eye, Plus } from 'lucide-react';
import { formatDate } from '@/utils/api';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    // Fetch user's articles
    fetchUserArticles();
  }, [isAuthenticated, navigate]);

  const fetchUserArticles = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const allArticles = await getArticles();
      const userArticles = allArticles.filter(article => article.authorId === user.id);
      setArticles(userArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load your articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteArticle(articleId);
      // Refresh the article list
      fetchUserArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your articles and account</p>
        </div>
        <Button asChild>
          <Link to="/create-article" className="flex items-center gap-2">
            <Plus size={16} />
            Create New Article
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Articles</CardTitle>
            <CardDescription>
              {articles.length === 0 
                ? "You haven't published any articles yet." 
                : `You have published ${articles.length} article${articles.length !== 1 ? 's' : ''}.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Loading your articles...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="py-8 text-center">
                <p className="mb-4">Start sharing your knowledge with the world!</p>
                <Button asChild>
                  <Link to="/create-article">Create Your First Article</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <React.Fragment key={article.id}>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{article.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">
                            {article.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Published {formatDate(article.createdAt)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {article.views} views
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 self-end md:self-center">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/article/${article.slug}`}>
                            <Eye size={16} className="mr-1" /> View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/edit-article/${article.slug}`}>
                            <Pencil size={16} className="mr-1" /> Edit
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-white"
                          onClick={() => handleDeleteArticle(article.id)}
                        >
                          <Trash2 size={16} className="mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                    <Separator />
                  </React.Fragment>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
