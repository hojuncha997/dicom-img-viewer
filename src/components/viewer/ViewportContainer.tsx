import React, { useEffect, useRef } from 'react';
import { useViewportStore } from '../../store/viewportStore';
import { useViewportSelection } from '../../hooks/useViewport';

interface ViewportContainerProps {
  viewportId: 'left' | 'right';
  imageName?: string;
  highlighted?: boolean;
}

const ViewportContainer: React.FC<ViewportContainerProps> = ({
  viewportId,
  imageName = '',
  highlighted = false,
}) => {
  // 뷰포트 요소 참조
  const viewportRef = useRef<HTMLDivElement>(null);
  
  // 뷰포트 선택 관련 기능 가져오기
  const { handleViewportSelect, selectedViewport } = useViewportSelection();
  
  // 뷰포트 참조 저장 함수 가져오기
  const { 
    setViewport1Element, 
    setViewport2Element 
  } = useViewportStore();
  
  // 요소 참조를 상태에 저장
  useEffect(() => {
    if (viewportRef.current) {
      if (viewportId === 'left') {
        setViewport1Element(viewportRef.current);
      } else if (viewportId === 'right') {
        setViewport2Element(viewportRef.current);
      }
    }
    
    // 컴포넌트 언마운트 시 요소 참조 제거
    return () => {
      if (viewportId === 'left') {
        setViewport1Element(null);
      } else if (viewportId === 'right') {
        setViewport2Element(null);
      }
    };
  }, [viewportId, setViewport1Element, setViewport2Element]);
  
  // 뷰포트 클릭 핸들러
  const handleClick = () => {
    handleViewportSelect(viewportId);
  };
  
  // 현재 뷰포트가 선택되었는지 확인
  const isSelected = selectedViewport === viewportId;
  
  // 테두리 스타일 결정
  const borderStyle = isSelected 
    ? 'border-2 border-blue-500' 
    : 'border border-gray-400';
  
  return (
    <div className="flex flex-col items-center">
      <div
        ref={viewportRef}
        className={`${borderStyle} rounded bg-black cursor-pointer`}
        style={{ width: '720px', height: '720px' }}
        onClick={handleClick}
      ></div>
      <p className="mt-2 text-sm text-gray-600">
        {imageName}
      </p>
    </div>
  );
};

export default ViewportContainer;
