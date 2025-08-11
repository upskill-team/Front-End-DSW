import React from 'react';

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode; 
}

const AuthCard = ({ title, description, children }: AuthCardProps) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-strong w-full max-w-md animate-fadeIn">
      <div className="text-center mb-8">
        <h1 className="text-neutral-900 text-3xl font-bold mb-2">{title}</h1>
        <p className="text-neutral-600">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default AuthCard;