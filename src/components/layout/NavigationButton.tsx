import React from 'react';

interface NavigationButtonProps {
  text: string;
  onClick?: () => void;
  width: string;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ 
  text, 
  onClick,
  width
}) => {
  return (
    <button
      onClick={onClick}
      className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
      style={{ 
        width,
        height: '48px', 
        paddingTop: '16px', 
        paddingRight: '12px', 
        paddingBottom: '16px', 
        paddingLeft: '12px', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {text}
    </button>
  );
};

export default NavigationButton; 