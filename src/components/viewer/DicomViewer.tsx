import React from 'react';
import Container from '../layout/Container';
import ViewportContainer from './ViewportContainer';
import ViewerControls from './ViewerControls';
import { useCornerstone } from '../../hooks/useCornerstone';
import { useViewport } from '../../hooks/useViewport';
import { useViewerImages } from '../../store/viewerStore';

const DicomViewer: React.FC = () => {
  // Cornerstone3D 초기화
  const { isInitialized, isLoading, error } = useCornerstone();
  
  // 뷰포트 이미지 로드 상태
  const { isViewportsReady } = useViewport();
  
  // 현재 이미지 이름 가져오기
  const { leftImageName, rightImageName } = useViewerImages();
  
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
      {/* 컨트롤 영역 */}
      <div className="bg-gray-100 p-4 border-b border-gray-300">
        <Container maxWidth="1440px">
          <ViewerControls />
        </Container>
      </div>
      
      {/* 뷰포트 영역 */}
      <Container maxWidth="1440px">
        <div className="flex justify-center items-start pt-4">
          {/* 왼쪽 뷰포트 */}
          <ViewportContainer 
            viewportId="left" 
            imageName={leftImageName}
          />
          
          {/* 세로 구분선 */}
          <div style={{ width: '5px', height: '720px', backgroundColor: '#0F62FE', margin: '0 10px' }}></div>
          
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
