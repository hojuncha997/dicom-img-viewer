import React from 'react';
import Container from '../layout/Container';
import ViewportContainer from './ViewportContainer';
import Navigation from '../layout/Navigation';
import { useCornerstone } from '../../hooks/useCornerstone';
import { useViewport } from '../../hooks/useViewport';
import { useViewerImages } from '../../store/viewerStore';
import { useSelectedViewportManipulation } from '../../store/imageManipulationStore';
import { useViewerStore } from '../../store/viewerStore';

const DicomViewer: React.FC = () => {
  // Cornerstone3D 초기화
  const { isInitialized, isLoading, error } = useCornerstone();
  
  // 뷰포트 이미지 로드 상태
  const { isViewportsReady } = useViewport();
  
  // 현재 이미지 이름 가져오기
  const { leftImageName, rightImageName } = useViewerImages();
  
  // 이미지 네비게이션 함수 가져오기
  const { goToPreviousImage, goToNextImage } = useViewerStore();
  
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
  
  // 로딩 또는 오류 상태 표시
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-2xl">DICOM 뷰어 초기화 중...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-2xl text-red-500">오류 발생: {error.message}</p>
      </div>
    );
  }
  
  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-2xl">Cornerstone3D 초기화 중...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* 네비게이션 바 */}
      <Navigation
        onPrevImage={goToPreviousImage}
        onNextImage={goToNextImage}
        onZoom={handleZoom}
        onFlipH={handleFlipH}
        onFlipV={handleFlipV}
        onRotate={handleRotate}
        onInvert={handleInvert}
        onColormap={handleColormap}
        onReset={handleReset}
        disableControls={!isViewportSelected}
      />
      
      {/* 뷰포트 영역 */}
      <Container maxWidth="1440px" className="overflow-hidden">
        <div className="flex justify-center items-start">
          {/* 왼쪽 뷰포트 */}
          <ViewportContainer 
            viewportId="left" 
            imageName={leftImageName}
          />
          
          {/* 세로 구분선 */}
          <div style={{ width: '5px', height: '903px', backgroundColor: '#0F62FE', margin: '0' }}></div>
          
          {/* 오른쪽 뷰포트 */}
          <ViewportContainer 
            viewportId="right" 
            imageName={rightImageName}
          />
        </div>
        
        {/* 상태 메시지 */}
        {!isViewportsReady && (
          <p className="text-center mt-4 text-gray-600">
            뷰포트 초기화 중...
          </p>
        )}
      </Container>
    </div>
  );
};

export default DicomViewer;
