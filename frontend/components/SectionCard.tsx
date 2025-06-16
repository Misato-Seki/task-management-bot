import React, { ReactNode } from 'react';

type SectionCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

const SectionCard: React.FC<SectionCardProps> = ({ title, children, className = '' }) => {
  return (
    <section className={`bg-[#A2D2E2] rounded-2xl p-6 w-[400px] flex flex-col gap-6 ${className}`}>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
};

export default SectionCard;
