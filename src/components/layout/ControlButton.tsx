import React from 'react';

interface ControlButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({ 
  text, 
  onClick, 
  disabled = false 
}) => {
  return (
    <button 
      className="rounded-md"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '12px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <span style={{
        fontFamily: 'Roboto',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '100%',
        letterSpacing: '0%',
        color: '#21272A'
      }}>
        {text}
      </span>
    </button>
  );
};

export default ControlButton; 