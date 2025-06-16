import React, { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl p-4 flex flex-col gap-2 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
