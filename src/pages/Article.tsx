
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, ArrowLeft, MessageCircle, Heart, Share2, Bookmark, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BlurImage from '@/components/ui/BlurImage';
import { getArticleBySlug, getArticles, formatDate } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import ArticleCard from '@/components/articles/ArticleCard';

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasLiked, setHasLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Fetch article data
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => getArticleBySlug(slug || ''),
    enabled: !!slug,
  });
  
  // Fetch related articles
  const { data: relatedArticles } = useQuery({
    queryKey: ['articles', 'related', article?.category],
    queryFn: () => getArticles({ limit: 3 }),
    enabled: !!article,
  });
  
  // Handle like action
  const handleLike = () => {
    setHasLiked(!hasLiked);
    toast({
      title: hasLiked ? 'Removed like' : 'Article liked',
      description: hasLiked ? 'You have removed your like from this article' : 'Thank you for liking this article!',
      duration: 3000,
    });
  };
  
  // Handle bookmark action
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? 'Removed from bookmarks' : 'Article bookmarked',
      description: isBookmarked 
        ? 'This article has been removed from your bookmarks' 
        : 'This article has been added to your bookmarks',
      duration: 3000,
    });
  };
  
  // Handle share action
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      })
      .catch(() => {
        // Fallback if sharing failed or was cancelled
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copied to clipboard',
          description: 'You can now share this article with others',
          duration: 3000,
        });
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied to clipboard',
        description: 'You can now share this article with others',
        duration: 3000,
      });
    }
  };
  
  useEffect(() => {
    // Scroll to top when article loads
    window.scrollTo(0, 0);
    
    // Handle 404 if article not found
    if (error) {
      navigate('/not-found');
    }
  }, [error, navigate]);
  
  if (isLoading) {
    return (
      <div className="content-container py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-3/4 mx-auto"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!article) {
    return null; // Let the useEffect handle navigation
  }

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="w-full aspect-[21/9] md:aspect-[3/1] relative animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent z-10"></div>
        <BlurImage
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute top-0 left-0 w-full h-full flex items-end z-20">
          <div className="content-container pb-8 md:pb-16">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-6 hover:bg-background/50"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            
            <div className="flex flex-wrap gap-3 mb-3">
              <span className="bg-primary/10 backdrop-blur-sm text-primary text-xs font-medium px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span className="bg-background/70 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full flex items-center">
                <Clock size={12} className="mr-1" />
                {article.readTime} min read
              </span>
              <span className="bg-background/70 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full flex items-center">
                <Calendar size={12} className="mr-1" />
                {formatDate(article.createdAt)}
              </span>
              <span className="bg-background/70 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full flex items-center">
                <Eye size={12} className="mr-1" />
                {article.views} views
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-balance max-w-4xl">
              {article.title}
            </h1>
          </div>
        </div>
      </section>
      
      <div className="content-container max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Social Sharing Sidebar */}
          <aside className="md:w-16 order-2 md:order-1">
            <div className="md:sticky md:top-32 flex md:flex-col items-center gap-4 py-6 md:py-0">
              <Button 
                variant="outline" 
                size="icon" 
                className={`rounded-full transition-all ${hasLiked ? 'bg-red-100 border-red-200 text-red-500 hover:bg-red-100 hover:text-red-500' : ''}`}
                onClick={handleLike}
              >
                <Heart size={18} className={hasLiked ? 'fill-red-500' : ''} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full"
                onClick={() => window.location.href = '#comments'}
              >
                <MessageCircle size={18} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className={`rounded-full transition-all ${isBookmarked ? 'bg-primary/10 text-primary' : ''}`}
                onClick={handleBookmark}
              >
                <Bookmark size={18} className={isBookmarked ? 'fill-primary' : ''} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full"
                onClick={handleShare}
              >
                <Share2 size={18} />
              </Button>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 order-1 md:order-2">
            {/* Author Section */}
            <div className="flex items-center space-x-4 my-8">
              <Avatar className="h-12 w-12">
                <AvatarImage 
                  src={article.authorAvatar} 
                  alt={article.authorName} 
                />
                <AvatarFallback>
                  {article.authorName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{article.authorName}</p>
                <p className="text-sm text-muted-foreground">
                  Published {formatDate(article.createdAt)}
                </p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            {/* Article Content */}
            <article className="prose prose-lg dark:prose-invert max-w-none pb-8">
              <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
            </article>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 my-8">
              {article.tags.map((tag) => (
                <Link 
                  key={tag} 
                  to={`/tag/${tag.toLowerCase()}`} 
                  className="bg-secondary px-3 py-1 rounded-full text-sm hover:bg-secondary/70 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            
            <Separator className="my-8" />
            
            {/* Comments Section */}
            <section id="comments" className="pt-4 pb-8">
              <h2 className="text-2xl font-semibold mb-6">Comments</h2>
              
              <Card className="p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Leave a comment</h3>
                <textarea 
                  className="w-full p-3 rounded-md border border-border bg-background min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Share your thoughts..."
                ></textarea>
                <div className="flex justify-end mt-4">
                  <Button>Post Comment</Button>
                </div>
              </Card>
              
              <div className="space-y-6">
                {[1, 2, 3].map((commentId) => (
                  <Card key={commentId} className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${commentId}`} />
                        <AvatarFallback>U{commentId}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">User {commentId}</h4>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(new Date(2023, 11, 20 - commentId).toISOString())}
                          </span>
                        </div>
                        <p className="mt-2">
                          This is a great article! I learned a lot about {article.category}. 
                          Looking forward to more content like this.
                        </p>
                        <Button variant="ghost" size="sm" className="mt-2">
                          <MessageCircle size={14} className="mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
      
      {/* Related Articles */}
      <section className="bg-secondary py-12 mt-12">
        <div className="content-container">
          <h2 className="text-2xl font-semibold mb-8">Related Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles?.filter(a => a.id !== article.id).slice(0, 3).map((relatedArticle) => (
              <ArticleCard 
                key={relatedArticle.id} 
                article={relatedArticle} 
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Article;
