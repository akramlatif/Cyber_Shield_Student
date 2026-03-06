'use client';

import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, href }) => {
  const baseClasses = `inline-flex justify-center items-center bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ${className || ''}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={baseClasses}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
