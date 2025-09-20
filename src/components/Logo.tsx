import React from 'react';

interface LogoProps {
  variant: 'intention-ai' | 'intentionalai' | 'intentional';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant, className = '' }) => {
  const renderLogo = () => {
    switch (variant) {
      case 'intention-ai':
        return (
          <div className={className}>
            <span className="i-dot">i</span>ntention<span className="i-dot">i</span>.ai
          </div>
        );
      
      case 'intentionalai':
        return (
          <div className={className}>
            ìntentionìai
          </div>
        );
      
      case 'intentional':
        return (
          <div className={className}>
            <span className="i-dot">i</span>ntentional
          </div>
        );
      
      default:
        return null;
    }
  };

  return renderLogo();
};

export default Logo;