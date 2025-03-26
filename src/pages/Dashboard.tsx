
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { getArticles } from '@/utils/api';
import ArticleCard from '@/components/articles/ArticleCard';
import { PlusCircle, FileText, BookOpen, Heart, Bookmark, Settings, User } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Fetch user's articles (mock data for now)
  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(),
    enabled: isAuthenticated,
  });
  
  if (isLoading) {
    return (
      <div className="content-container py-16 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Let the useEffect handle redirection
  }

  return (
    <div className="content-container py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        
        <Button>
          <PlusCircle size={16} className="mr-2" />
          Create New Article
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                <img 
                  src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.name}`} 
                  alt={user?.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium text-lg">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full mt-2">
                {user?.role.toUpperCase()}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full" size="sm">
                <User size={14} className="mr-2" />
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
          
          <div className="bg-background rounded-lg border border-border overflow-hidden">
            <nav className="flex flex-col">
              {[
                { name: 'My Articles', icon: FileText, count: 4 },
                { name: 'Bookmarks', icon: Bookmark, count: 7 },
                { name: 'Reading History', icon: BookOpen, count: 12 },
                { name: 'Liked Articles', icon: Heart, count: 9 },
                { name: 'Settings', icon: Settings },
              ].map((item, index) => (
                <button
                  key={index}
                  className="flex items-center justify-between px-4 py-3 hover:bg-secondary transition-colors text-left"
                >
                  <span className="flex items-center text-sm font-medium">
                    <item.icon size={16} className="mr-3" />
                    {item.name}
                  </span>
                  {item.count && (
                    <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="articles" className="space-y-6">
            <TabsList className="w-full bg-background border-b border-border rounded-none p-0 h-auto">
              {['articles', 'drafts', 'analytics', 'comments'].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab}
                  className="rounded-none px-6 py-3 text-sm capitalize data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-auto"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="articles" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Your Articles</h2>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    Sort
                  </Button>
                </div>
              </div>
              
              {articlesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Featured Article */}
                  {articles && articles.length > 0 && (
                    <Card className="mb-6 overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 relative aspect-video md:aspect-auto">
                          <img
                            src={articles[0].coverImage}
                            alt={articles[0].title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                              Featured
                            </span>
                          </div>
                        </div>
                        <div className="p-6 md:w-2/3 flex flex-col">
                          <h3 className="text-xl font-semibold mb-2">{articles[0].title}</h3>
                          <p className="text-muted-foreground mb-4 line-clamp-2">{articles[0].excerpt}</p>
                          <div className="flex items-center justify-between mt-auto text-sm text-muted-foreground">
                            <div>
                              <span>Published: {new Date(articles[0].createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex space-x-4">
                              <span className="flex items-center">
                                <Heart size={14} className="mr-1" />
                                {articles[0].views}
                              </span>
                              <span className="flex items-center">
                                <BookOpen size={14} className="mr-1" />
                                {articles[0].readTime} min
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                  
                  {/* Article Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles?.slice(1).map((article) => (
                      <ArticleCard 
                        key={article.id} 
                        article={article} 
                      />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="drafts">
              <Card>
                <CardHeader>
                  <CardTitle>Drafts</CardTitle>
                  <CardDescription>
                    View and edit your draft articles.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-12 border-2 border-dashed border-border rounded-lg">
                    <div className="text-center">
                      <PlusCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No drafts yet</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Get started by creating a new article
                      </p>
                      <Button className="mt-4">Create New Article</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    View performance metrics for your articles.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                      { title: "Total Views", value: "1,234", change: "+12.3%" },
                      { title: "Comments", value: "56", change: "+5.2%" },
                      { title: "Avg. Read Time", value: "4:32", change: "-1.5%" },
                    ].map((stat, i) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </p>
                          <div className="flex items-end justify-between mt-2">
                            <p className="text-3xl font-semibold">{stat.value}</p>
                            <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                              {stat.change}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="h-60 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Analytics chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>
                    Manage comments on your articles.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 border border-border rounded-lg">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <img 
                              src={`https://i.pravatar.cc/150?u=${i}`} 
                              alt="User" 
                              className="w-8 h-8 rounded-full mr-2"
                            />
                            <div>
                              <p className="font-medium text-sm">User Name</p>
                              <p className="text-xs text-muted-foreground">2 days ago</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Reply</Button>
                        </div>
                        <p className="mt-2 text-sm">
                          Great article! I especially loved the section about future applications.
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          On: "The Future of Artificial Intelligence: Exploring New Frontiers"
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
