import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

function Container({ 
  children, 
  className = '', 
  maxWidth = '100%'
}: ContainerProps) {
  // 기본 클래스에서 max-width 제거하여 prop으로 분리
  const baseClasses = 'container mx-auto';
  
  // max-width를 style로 적용
  const style = {
    maxWidth: maxWidth, // max-width 속성을 스타일로 적용
  };
  
  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;
  
  return <div className={combinedClasses} style={style}>{children}</div>;
}

export default Container;