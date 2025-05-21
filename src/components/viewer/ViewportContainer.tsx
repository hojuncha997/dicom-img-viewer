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
  
  // 선택 시 파란색 테두리를 위한 스타일
  const selectionStyle = isSelected 
    ? { border: '1px solid #0F62FE' } 
    : { border: 'none' };
  
  // 피그마 스펙에 맞는 너비 설정
  const viewportWidth = viewportId === 'left' ? '720px' : '715px';
  
  return (
    <div className="flex flex-col items-center">
      <div
        className="rounded cursor-pointer bg-white"
        style={{ 
          width: viewportWidth, 
          height: '903px',
          padding: '3px',
          ...selectionStyle
        }}
        onClick={handleClick}
      >
        <div
          ref={viewportRef}
          className="w-full h-full bg-black rounded"
        ></div>
      </div>
    </div>
  );
};

export default ViewportContainer;
