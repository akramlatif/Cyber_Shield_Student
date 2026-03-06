'use client';

import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 ${className || ''}`}>
      {children}
    </div>
  );
};

export default Card;