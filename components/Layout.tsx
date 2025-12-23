import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, header, footer }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-[1440px] mx-auto border-x border-neutral-100">
      {header}
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      {footer}
    </div>
  );
};