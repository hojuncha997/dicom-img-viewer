import React from 'react';
import { useViewerStore } from '../../store/viewerStore';
import { useSelectedViewportManipulation } from '../../store/imageManipulationStore';

interface ViewerControlsProps {
  className?: string;
}

const ViewerControls: React.FC<ViewerControlsProps> = ({ className = '' }) => {
  // 이미지 네비게이션 함수 가져오기
  const { goToPreviousPair, goToNextPair } = useViewerStore();
  
  // 이미지 조작 함수 가져오기
  const {
    handleZoom,
    handleFlipH,
    handleFlipV,
    handleRotate,
    handleInvert,
    handleColormap,
    handleReset,
    isViewportSelected
  } = useSelectedViewportManipulation();
  
  // 버튼 기본 스타일
  const buttonStyle = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed";
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* 이미지 탐색 컨트롤 */}
      <div className="flex gap-2">
        <button 
          className={buttonStyle}
          onClick={goToPreviousPair}
        >
          이전 이미지
        </button>
        <button 
          className={buttonStyle}
          onClick={goToNextPair}
        >
          다음 이미지
        </button>
      </div>
      
      {/* 구분선 */}
      <div className="border-r border-gray-300 h-10 mx-2"></div>
      
      {/* 이미지 조작 컨트롤 */}
      <div className="flex gap-2 flex-wrap">
        <button 
          className={buttonStyle}
          onClick={handleZoom}
          disabled={!isViewportSelected}
        >
          확대
        </button>
        <button 
          className={buttonStyle}
          onClick={handleFlipH}
          disabled={!isViewportSelected}
        >
          좌우반전
        </button>
        <button 
          className={buttonStyle}
          onClick={handleFlipV}
          disabled={!isViewportSelected}
        >
          상하반전
        </button>
        <button 
          className={buttonStyle}
          onClick={handleRotate}
          disabled={!isViewportSelected}
        >
          회전
        </button>
        <button 
          className={buttonStyle}
          onClick={handleInvert}
          disabled={!isViewportSelected}
        >
          반전
        </button>
        <button 
          className={buttonStyle}
          onClick={handleColormap}
          disabled={!isViewportSelected}
        >
          컬러맵
        </button>
        <button 
          className={buttonStyle}
          onClick={handleReset}
          disabled={!isViewportSelected}
        >
          초기화
        </button>
      </div>
    </div>
  );
};

export default ViewerControls;
