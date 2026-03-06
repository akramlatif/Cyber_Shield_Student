import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className }) => {
  return (
    <span className={`inline-block bg-[#e0e7ff] text-[#3730a3] rounded-full px-3 py-1 text-sm font-semibold ${className || ''}`}>
      {children}
    </span>
  );
};

export default Badge;