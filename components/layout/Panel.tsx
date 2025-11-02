import React from 'react';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

const Panel: React.FC<PanelProps> = ({ children, className = '' }) => {
  return (
    <div className={`industrial-panel ${className}`}>
      {children}
    </div>
  );
};

export default Panel;