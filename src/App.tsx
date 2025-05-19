// src/App.tsx
import React, { useEffect, useRef, useState } from 'react';
import Navigation from './components/layout/Navigation';
import Container from './components/layout/Container';

// Cornerstone3D 핵심 패키지 및 도구
import * as cornerstone3D from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import * as cornerstoneDicomImageLoader from '@cornerstonejs/dicom-image-loader';

const DicomViewer: React.FC = () => {
  // 두 개의 뷰포트 컨테이너 참조
  const viewport1Ref = useRef<HTMLDivElement>(null);
  const viewport2Ref = useRef<HTMLDivElement>(null);
  
  // 렌더링 엔진과 뷰포트를 상태로 관리
  const [renderingEngine, setRenderingEngine] = useState<any>(null);
  const [viewport1, setViewport1] = useState<any>(null);
  const [viewport2, setViewport2] = useState<any>(null);
  
  // 선택된 뷰포트 관리
  const [selectedViewport, setSelectedViewport] = useState<'left' | 'right' | null>(null);
  
  // 이미지 인덱스 관리
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  
  // 모든 이미지 ID 미리 정의
  const allImageIds = [
    '/dicom/image-000001.dcm',
    '/dicom/image-000050.dcm',
    '/dicom/image-000100.dcm',
    '/dicom/image-000161.dcm',
    '/dicom/image-000200.dcm',
    '/dicom/image-000261.dcm',
    '/dicom/image-000300.dcm',
  ];
  
  // 이미지 쌍 개수 계산 (이미지 쌍은 161&162, 163&164 등)
  const totalPairs = Math.floor(allImageIds.length / 2) + (allImageIds.length % 2 > 0 ? 1 : 0);
  
  // 이전 이미지 쌍으로 이동
  const handlePrevious = () => {
    if (currentPairIndex > 0) {
      setCurrentPairIndex(prev => prev - 1);
    }
  };
  
  // 다음 이미지 쌍으로 이동
  const handleNext = () => {
    if (currentPairIndex < totalPairs - 1) {
      setCurrentPairIndex(prev => prev + 1);
    }
  };
  
  // 현재 보고있는 이미지 ID들 계산
  const leftImageIndex = currentPairIndex * 2;
  const rightImageIndex = leftImageIndex + 1;
  
  // 뷰포트 선택 핸들러
  const handleViewportSelect = (viewportId: 'left' | 'right') => {
    setSelectedViewport(viewportId);
  };
  
  // 선택된 뷰포트 가져오기
  const getSelectedViewport = () => {
    if (selectedViewport === 'left') {
      return viewport1;
    } else if (selectedViewport === 'right') {
      return viewport2;
    }
    return null;
  };
  
  // Zoom 핸들러
  const handleZoom = () => {
    console.log('Zoom 기능 실행');
    // 기능 구현은 추후 진행
  };
  
  // Flip H 핸들러
  const handleFlipH = () => {
    console.log('Flip H 기능 실행');
    // 기능 구현은 추후 진행
  };
  
  // Flip V 핸들러
  const handleFlipV = () => {
    console.log('Flip V 기능 실행');
    // 기능 구현은 추후 진행
  };
  
  // Rotate Delta 30 핸들러
  const handleRotate = () => {
    console.log('Rotate Delta 30 기능 실행');
    // 기능 구현은 추후 진행
  };
  
  // Invert 핸들러
  const handleInvert = () => {
    console.log('Invert 기능 실행');
    // 기능 구현은 추후 진행
  };
  
  // Apply Colormap 핸들러
  const handleColormap = () => {
    console.log('Apply Colormap 기능 실행');
    // 기능 구현은 추후 진행
  };
  
  // Reset 핸들러
  const handleReset = () => {
    console.log('Reset 기능 실행');
    // 기능 구현은 추후 진행
  };
  
  // Cornerstone3D 초기화 및 뷰포트 설정
  useEffect(() => {
    const initCornerstone = async () => {
      try {
        // 필요한 모듈 동적 임포트
        const dicomParserModule = await import('dicom-parser');
        const dicomParser = dicomParserModule.default || dicomParserModule;
        
        console.log('모듈 임포트 완료');
        
        // 1. Cornerstone3D 초기화
        await cornerstone3D.init();
        await cornerstoneTools.init();
        
        console.log('Cornerstone3D 초기화 완료');
        
        // 2. DICOM 이미지 로더 초기화 및 설정
        cornerstoneDicomImageLoader.external.cornerstone = cornerstone3D;
        cornerstoneDicomImageLoader.external.dicomParser = dicomParser;
          
        // WADO 구성
        const config = {
          useWebWorkers: false,
          maxWebWorkers: navigator.hardwareConcurrency || 1,
          startWebWorkersOnDemand: true,
        };
        
        // wadouri 설정
        if (cornerstoneDicomImageLoader.wadouri?.dicomImageLoader?.configure) {
          cornerstoneDicomImageLoader.wadouri.dicomImageLoader.configure(config);
          console.log('DICOM 이미지 로더 설정 완료');
        }
        
        // 두 요소가 모두 존재하는지 확인
        if (viewport1Ref.current && viewport2Ref.current) {
          // 4. 렌더링 엔진 생성 (두 뷰포트에서 공유)
          const engine = new cornerstone3D.RenderingEngine('myRenderingEngine');
          setRenderingEngine(engine);
          
          // 5. 첫 번째 뷰포트 설정
          const viewport1Input = {
            viewportId: 'CT_STACK_1',
            element: viewport1Ref.current,
            type: cornerstone3D.Enums.ViewportType.STACK,
          };
          
          // 6. 두 번째 뷰포트 설정
          const viewport2Input = {
            viewportId: 'CT_STACK_2',
            element: viewport2Ref.current,
            type: cornerstone3D.Enums.ViewportType.STACK,
          };
          
          // 7. 뷰포트 활성화
          engine.enableElement(viewport1Input);
          engine.enableElement(viewport2Input);
          
          // 8. 뷰포트 가져오기
          const vp1 = engine.getViewport('CT_STACK_1');
          const vp2 = engine.getViewport('CT_STACK_2');
          
          setViewport1(vp1);
          setViewport2(vp2);
          
          console.log('뷰포트 설정 완료');
        }
      } catch (error) {
        console.error('DICOM 뷰어 초기화 중 오류 발생:', error);
      }
    };
    
    initCornerstone();
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (renderingEngine) {
        renderingEngine.destroy();
      }
    };
  }, []);
  
  // 인덱스가 변경되거나 뷰포트가 준비되면 이미지 로드
  useEffect(() => {
    const loadImages = async () => {
      if (!viewport1 || !viewport2) return;
      
      try {
        // 왼쪽 이미지 로드
        if (leftImageIndex < allImageIds.length) {
          const leftImageId = `wadouri:${window.location.origin}${allImageIds[leftImageIndex]}`;
          console.log('왼쪽 이미지 로드:', leftImageId);
          await viewport1.setStack([leftImageId]);
          viewport1.render();
        }
        
        // 오른쪽 이미지 로드 (존재하는 경우)
        if (rightImageIndex < allImageIds.length) {
          const rightImageId = `wadouri:${window.location.origin}${allImageIds[rightImageIndex]}`;
          console.log('오른쪽 이미지 로드:', rightImageId);
          await viewport2.setStack([rightImageId]);
          viewport2.render();
        } else {
          // 마지막 이미지가 홀수 번째면 오른쪽은 비워둠
          console.log('오른쪽 이미지 없음');
        }
      } catch (error) {
        console.error('이미지 로드 실패:', error);
      }
    };
    
    loadImages();
  }, [currentPairIndex, viewport1, viewport2]);
  
  // 현재 보고 있는 이미지 번호 계산
  const leftImageName = allImageIds[leftImageIndex]?.split('/').pop() || '';
  const rightImageName = allImageIds[rightImageIndex]?.split('/').pop() || '';

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation 
        onPrevImage={handlePrevious}
        onNextImage={handleNext}
        onZoom={handleZoom}
        onFlipH={handleFlipH}
        onFlipV={handleFlipV}
        onRotate={handleRotate}
        onInvert={handleInvert}
        onColormap={handleColormap}
        onReset={handleReset}
        disableControls={selectedViewport === null}
      />
      
      <Container maxWidth="1440px">
        <div className="flex justify-center items-start pt-2">
          {/* 첫 번째 뷰포트 */}
          <div 
            className={`flex flex-col items-center ${selectedViewport === 'left' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleViewportSelect('left')}
          >
            <div
              ref={viewport1Ref}
              className="border border-gray-400 rounded bg-black cursor-pointer"
              style={{ width: '720px', height: '720px' }}
            ></div>
            <p className="mt-2 text-sm text-gray-600">
              {leftImageName}
            </p>
          </div>
          
          {/* 세로 구분선 */}
          <div style={{ width: '5px', height: '720px', backgroundColor: '#0F62FE' }}></div>
          
          {/* 두 번째 뷰포트 */}
          <div 
            className={`flex flex-col items-center ${selectedViewport === 'right' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleViewportSelect('right')}
          >
            <div
              ref={viewport2Ref}
              className="border-2 border-blue-500 rounded bg-black cursor-pointer"
              style={{ width: '715px', height: '715px' }}
            ></div>
            <p className="mt-2 text-sm text-gray-600">
              {rightImageName}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DicomViewer;