
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, GitHub, Twitter, Linkedin } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: 'Jane Cooper',
      role: 'Editor in Chief',
      bio: 'Jane has over 15 years of experience in tech journalism and previously worked at major tech publications.',
      avatar: 'https://i.pravatar.cc/300?img=1',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#',
        email: 'jane@techtales.com'
      }
    },
    {
      name: 'Alex Morgan',
      role: 'Senior Writer',
      bio: 'Alex specializes in artificial intelligence and machine learning, with a background in computer science.',
      avatar: 'https://i.pravatar.cc/300?img=3',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#',
        email: 'alex@techtales.com'
      }
    },
    {
      name: 'Michael Chen',
      role: 'Web Development Expert',
      bio: 'Michael is a full-stack developer with a passion for teaching and writing about modern web technologies.',
      avatar: 'https://i.pravatar.cc/300?img=8',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#',
        email: 'michael@techtales.com'
      }
    },
    {
      name: 'Sarah Johnson',
      role: 'Cybersecurity Analyst',
      bio: 'Sarah brings her experience from the cybersecurity industry to provide insights on digital security topics.',
      avatar: 'https://i.pravatar.cc/300?img=5',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#',
        email: 'sarah@techtales.com'
      }
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="content-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About TechTales</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're a team of tech enthusiasts dedicated to bringing you the latest insights, 
            tutorials, and analyses on technology and digital innovation.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg mb-4">
                At TechTales, we believe technology should be accessible to everyone. Our mission 
                is to demystify complex tech concepts and provide valuable insights that help our 
                readers stay informed and inspired.
              </p>
              <p className="text-lg mb-6">
                We cover a wide range of topics including artificial intelligence, web development, 
                cybersecurity, and emerging technologies, always with a focus on clarity, accuracy, 
                and practical application.
              </p>
              <Button asChild size="lg">
                <Link to="/articles">Explore Our Articles</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                  alt="Team collaboration" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-lg -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our diverse team of writers, developers, and industry experts brings a wealth of experience to every article.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-background rounded-lg shadow-sm border border-border p-6 flex flex-col items-center text-center">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground mb-4">{member.bio}</p>
                
                <div className="flex space-x-3 mt-auto pt-4">
                  <a href={member.social.twitter} aria-label={`${member.name}'s Twitter`} className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter size={18} />
                  </a>
                  <a href={member.social.linkedin} aria-label={`${member.name}'s LinkedIn`} className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href={member.social.github} aria-label={`${member.name}'s GitHub`} className="text-muted-foreground hover:text-primary transition-colors">
                    <GitHub size={18} />
                  </a>
                  <a href={`mailto:${member.social.email}`} aria-label={`Email ${member.name}`} className="text-muted-foreground hover:text-primary transition-colors">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The core principles that guide our work and shape our content
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-border rounded-lg bg-background">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Accuracy</h3>
              <p className="text-muted-foreground">
                We are committed to thorough research and fact-checking to ensure our content is accurate and reliable.
              </p>
            </div>
            
            <div className="p-6 border border-border rounded-lg bg-background">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
              <p className="text-muted-foreground">
                We believe in making technology concepts understandable to readers of all backgrounds and experience levels.
              </p>
            </div>
            
            <div className="p-6 border border-border rounded-lg bg-background">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                We stay at the forefront of technological advancements to bring you insights on the latest innovations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Have a question, suggestion, or want to contribute to TechTales? We'd love to hear from you!
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" variant="default">
                <a href="mailto:contact@techtales.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Us
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/articles">Browse Articles</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
