import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  maxHeight?: string;
  style?: React.CSSProperties;
}

function Container({ 
  children, 
  className = '', 
  maxWidth = '100%',
  maxHeight,
  style = {}
}: ContainerProps) {
  // 기본 클래스에서 max-width 제거하여 prop으로 분리
  const baseClasses = 'container mx-auto';
  
  // style 속성들을 합침
  const combinedStyle = {
    maxWidth,
    maxHeight,
    ...style
  };
  
  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;
  
  return <div className={combinedClasses} style={combinedStyle}>{children}</div>;
}

export default Container;