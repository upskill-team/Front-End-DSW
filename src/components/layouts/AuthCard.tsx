import React from 'react';

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const AuthCard = ({ title, description, children }: AuthCardProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-2xl shadow-slate-black/50 w-full max-w-xl">
      <div className="text-center mb-10">
        <h1 className="text-slate-900 text-3xl font-bold">{title}</h1>
        <p className="text-slate-500 text-base mt-3">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default AuthCard;
