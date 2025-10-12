import React from 'react';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';

function MainHomePage() {
  // Dummy user data
  const dummyUser = {
    name: 'John Doe',
  };

  // Dummy features data
  const features = [
    {
      title: 'Smart Business Chat',
      description:
        'Engage with customers through AI-powered chat solutions that understand context and deliver personalized responses.',
      icon: '💬',
    },
    {
      title: 'Multi-Channel Integration',
      description:
        'Connect with your customers across various platforms - Web, Mobile, and Social Media.',
      icon: '🔄',
    },
    {
      title: 'Analytics Dashboard',
      description:
        'Get real-time insights into customer interactions and business performance metrics.',
      icon: '📊',
    },
    {
      title: 'Custom Chatbots',
      description:
        'Build and deploy custom chatbots tailored to your business needs.',
      icon: '🤖',
    },
    {
      title: 'Seamless Integration',
      description:
        'Easy integration with your existing business tools and workflows.',
      icon: '🔗',
    },
    {
      title: '24/7 Support',
      description:
        'Round-the-clock customer support to help you get the most out of ChatVerto.',
      icon: '🌟',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader title="Home" />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Welcome, {dummyUser.name} to ChatVerto
          </h1>
          <p className="text-xl text-muted-foreground">
            Your All-in-One Business Communication Solution
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-semibold mb-6">
            Ready to Transform Your Business Communication?
          </h2>
          <Button size="lg" className="bg-primary text-white">
            Get Started Now
          </Button>
        </div>
      </main>
    </div>
  );
}

const FeatureCard = ({ title, description, icon }) => (
  <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default MainHomePage;
