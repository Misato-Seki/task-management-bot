import React from 'react';
import { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement>

const Card: React.FC<CardProps> = ({ children, className, ...props}: CardProps) => {
  return (
    <div className={`bg-white rounded-xl p-4 flex flex-row items-center gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
