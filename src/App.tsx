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
    console.log('선택된 뷰포트가 없습니다. 이미지를 먼저 선택해주세요.');
    return null;
  };
  
  // Zoom 핸들러
  const handleZoom = () => {
    console.log('Zoom 기능 실행');
    const viewport = getSelectedViewport();
    if (!viewport) return;
    
    try {
      // 카메라 정보 가져오기
      const camera = viewport.getCamera();
      
      // 확대 비율 설정 (기존 parallelScale의 70%로 설정하여 약 1.4배 확대)
      if (camera && camera.parallelScale) {
        camera.parallelScale = camera.parallelScale * 0.7;
        viewport.setCamera(camera);
        viewport.render();
        console.log('이미지를 확대했습니다');
      } else {
        console.log('확대 기능을 적용할 수 없습니다');
      }
    } catch (error) {
      console.error('줌 기능 적용 중 오류 발생:', error);
    }
  };
  
  // Flip H 핸들러
  const handleFlipH = () => {
    console.log('Flip H 기능 실행');
    const viewport = getSelectedViewport();
    if (!viewport) return;
    
    try {
      // 액터(VTK 객체) 가져오기
      const actor = viewport.getDefaultActor();
      if (actor && actor.actor) {
        // 플립 전 카메라 정보 저장
        const camera = viewport.getCamera();
        const originalParallelScale = camera.parallelScale;
        
        // 디버깅을 위한 기존 액터 정보 출력
        const position = actor.actor.getPosition ? actor.actor.getPosition() : 'position method not available';
        const origin = actor.actor.getOrigin ? actor.actor.getOrigin() : 'origin method not available';
        const bounds = actor.actor.getBounds ? actor.actor.getBounds() : 'bounds method not available';
        
        console.log('액터 정보 - 좌우 뒤집기 전:', {
          position,
          origin,
          bounds,
          scale: actor.actor.getScale()
        });
        
        // 현재 스케일 가져오기
        const scale = actor.actor.getScale();
        
        // 해결책 1: 원점을 중앙으로 설정 시도
        if (actor.actor.setOrigin) {
          console.log('원점을 중앙으로 설정 시도');
          // 액터의 중심을 계산하려고 시도
          if (actor.actor.getBounds) {
            const bounds = actor.actor.getBounds();
            // 중앙 좌표 계산 (x, y, z)
            const centerX = (bounds[0] + bounds[1]) / 2;
            const centerY = (bounds[2] + bounds[3]) / 2;
            const centerZ = (bounds[4] + bounds[5]) / 2;
            actor.actor.setOrigin(centerX, centerY, centerZ);
            console.log('새 원점 설정:', [centerX, centerY, centerZ]);
          }
        }
        
        // X 축 스케일 반전
        scale[0] = -scale[0];
        actor.actor.setScale(scale);
        
        // 해결책 2: 위치 조정 시도
        viewport.resetCamera();
        
        // 원래 크기로 복원
        if (originalParallelScale) {
          const newCamera = viewport.getCamera();
          newCamera.parallelScale = originalParallelScale;
          viewport.setCamera(newCamera);
          console.log('카메라 스케일 복원:', originalParallelScale);
        }
        
        viewport.render();
        
        // 뒤집기 후 액터 정보 다시 출력
        const newPosition = actor.actor.getPosition ? actor.actor.getPosition() : 'position method not available';
        const newOrigin = actor.actor.getOrigin ? actor.actor.getOrigin() : 'origin method not available';
        const newBounds = actor.actor.getBounds ? actor.actor.getBounds() : 'bounds method not available';
        
        console.log('액터 정보 - 좌우 뒤집기 후:', {
          position: newPosition, 
          origin: newOrigin,
          bounds: newBounds,
          scale: actor.actor.getScale()
        });
        
        console.log('이미지를 좌우 반전했습니다');
      } else {
        console.log('좌우 반전 기능을 적용할 수 없습니다');
      }
    } catch (error) {
      console.error('Flip H 기능 적용 중 오류 발생:', error);
    }
  };
  
  // Flip V 핸들러
  const handleFlipV = () => {
    console.log('Flip V 기능 실행');
    const viewport = getSelectedViewport();
    if (!viewport) return;
    
    try {
      // 액터(VTK 객체) 가져오기
      const actor = viewport.getDefaultActor();
      if (actor && actor.actor) {
        // 플립 전 카메라 정보 저장
        const camera = viewport.getCamera();
        const originalParallelScale = camera.parallelScale;
        
        // 디버깅을 위한 기존 액터 정보 출력
        const position = actor.actor.getPosition();
        const origin = actor.actor.getOrigin ? actor.actor.getOrigin() : 'origin method not available';
        const bounds = actor.actor.getBounds ? actor.actor.getBounds() : 'bounds method not available';
        
        console.log('액터 정보 - 뒤집기 전:', {
          position,
          origin,
          bounds,
          scale: actor.actor.getScale()
        });
        
        // 현재 스케일 가져오기
        const scale = actor.actor.getScale();
        
        // 현재 위치 가져오기 (있다면)
        const currentPosition = actor.actor.getPosition ? actor.actor.getPosition() : [0, 0, 0];
        
        // 해결책 1: 원점을 중앙으로 설정 시도
        if (actor.actor.setOrigin) {
          console.log('원점을 중앙으로 설정 시도');
          // 액터의 중심을 계산하려고 시도
          if (actor.actor.getBounds) {
            const bounds = actor.actor.getBounds();
            // 중앙 좌표 계산 (x, y, z)
            const centerX = (bounds[0] + bounds[1]) / 2;
            const centerY = (bounds[2] + bounds[3]) / 2;
            const centerZ = (bounds[4] + bounds[5]) / 2;
            actor.actor.setOrigin(centerX, centerY, centerZ);
            console.log('새 원점 설정:', [centerX, centerY, centerZ]);
          }
        }
        
        // Y 축 스케일 반전
        scale[1] = -scale[1];
        actor.actor.setScale(scale);
        
        // 해결책 2: 위치 조정 시도
        viewport.resetCamera();
        
        // 원래 크기로 복원
        if (originalParallelScale) {
          const newCamera = viewport.getCamera();
          newCamera.parallelScale = originalParallelScale;
          viewport.setCamera(newCamera);
          console.log('카메라 스케일 복원:', originalParallelScale);
        }
        
        viewport.render();
        
        // 뒤집기 후 액터 정보 다시 출력
        const newPosition = actor.actor.getPosition();
        const newOrigin = actor.actor.getOrigin ? actor.actor.getOrigin() : 'origin method not available';
        const newBounds = actor.actor.getBounds ? actor.actor.getBounds() : 'bounds method not available';
        
        console.log('액터 정보 - 뒤집기 후:', {
          position: newPosition,
          origin: newOrigin,
          bounds: newBounds,
          scale: actor.actor.getScale()
        });
        
        console.log('이미지를 상하 반전했습니다');
      } else {
        console.log('상하 반전 기능을 적용할 수 없습니다');
      }
    } catch (error) {
      console.error('Flip V 기능 적용 중 오류 발생:', error);
    }
  };
  
  // Rotate Delta 30 핸들러
  const handleRotate = () => {
    console.log('Rotate Delta 30 기능 실행');
    const viewport = getSelectedViewport();
    if (!viewport) return;
    
    try {
      // 액터(VTK 객체) 가져오기
      const actor = viewport.getDefaultActor();
      if (actor && actor.actor) {
        // 회전 전 원점을 이미지 중앙으로 설정
        if (actor.actor.getBounds) {
          const bounds = actor.actor.getBounds();
          // 중앙 좌표 계산 (x, y, z)
          const centerX = (bounds[0] + bounds[1]) / 2;
          const centerY = (bounds[2] + bounds[3]) / 2;
          const centerZ = (bounds[4] + bounds[5]) / 2;
          actor.actor.setOrigin(centerX, centerY, centerZ);
          console.log('회전: 원점을 중앙으로 설정:', [centerX, centerY, centerZ]);
        }
        
        // 회전 각도 설정 (30도)
        const rotationAngleDegrees = 30;
        
        // Z축을 중심으로 회전
        actor.actor.rotateZ(rotationAngleDegrees);
        viewport.render();
        console.log('이미지를 30도 회전했습니다');
      } else {
        console.log('회전 기능을 적용할 수 없습니다');
      }
    } catch (error) {
      console.error('Rotate 기능 적용 중 오류 발생:', error);
    }
  };
  
  // Invert 핸들러
  const handleInvert = () => {
    console.log('Invert 기능 실행');
    const viewport = getSelectedViewport();
    if (!viewport) return;
    
    try {
      // 액터(VTK 객체) 가져오기
      const actor = viewport.getDefaultActor();
      if (actor && actor.actor && actor.actor.getProperty) {
        const property = actor.actor.getProperty();
        
        // 현재 invert 상태 확인 및 토글
        const currentInvert = property.getInverted ? property.getInverted() : 
                            (property.getInvertLookupTable ? property.getInvertLookupTable() : false);
        
        // 상태 반전
        if (property.setInverted) {
          property.setInverted(!currentInvert);
        } else if (property.setInvertLookupTable) {
          property.setInvertLookupTable(!currentInvert);
        }
        
        viewport.render();
        console.log('이미지 색상을 반전했습니다');
      } else {
        // 속성 API가 없는 경우 대체 방법
        const properties = viewport.getProperties() || {};
        const currentInvert = properties.invert || false;
        viewport.setProperties({ invert: !currentInvert });
        viewport.render();
        console.log('이미지 색상을 반전했습니다');
      }
    } catch (error) {
      console.error('Invert 기능 적용 중 오류 발생:', error);
    }
  };
  
  // Apply Colormap 핸들러
  const handleColormap = () => {
    console.log('Apply Colormap 기능 실행');
    const viewport = getSelectedViewport();
    if (!viewport) return;
    
    try {
      // 액터(VTK 객체) 가져오기
      const actor = viewport.getDefaultActor();
      if (actor && actor.actor && actor.actor.getProperty) {
        const property = actor.actor.getProperty();
        
        // 컬러맵 적용 시도 (jet 컬러맵 - 파란색에서 빨간색까지의 그라데이션)
        let colormapApplied = false;
        
        try {
          // Cornerstone3D의 컬러맵 유틸리티 사용 시도
          if (cornerstone3D.utilities && cornerstone3D.utilities.colormap) {
            const preset = cornerstone3D.utilities.colormap.getColormap('jet');
            if (preset && property.setRGBTransferFunction) {
              property.setRGBTransferFunction(0, preset);
              colormapApplied = true;
            }
          }
        } catch (colorMapError) {
          console.error('컬러맵 적용 중 오류:', colorMapError);
          
          // 대체 방법: 룩업 테이블 직접 조작
          if (property.setUseLookupTable) {
            property.setUseLookupTable(true);
            
            // 간단한 레인보우 컬러맵 적용
            if (property.getLookupTable) {
              const lut = property.getLookupTable();
              lut.setRange(0, 255);
              lut.setHueRange(0.0, 0.9); // 파란색에서 빨간색까지
              lut.setSaturationRange(1.0, 1.0);
              lut.setValueRange(1.0, 1.0);
              lut.setAlphaRange(1.0, 1.0);
              lut.build();
              colormapApplied = true;
            }
          }
        }
        
        viewport.render();
        
        if (colormapApplied) {
          console.log('컬러맵을 적용했습니다');
        } else {
          // 대체 방법 시도
          viewport.setProperties({ colormap: 'jet' });
          viewport.render();
          console.log('컬러맵을 적용했습니다 (대체 방법)');
        }
      } else {
        // 속성 API가 없는 경우 대체 방법
        viewport.setProperties({ colormap: 'jet' });
        viewport.render();
        console.log('컬러맵을 적용했습니다 (대체 방법)');
      }
    } catch (error) {
      console.error('Colormap 기능 적용 중 오류 발생:', error);
    }
  };
  
  // Reset 핸들러
  const handleReset = () => {
    console.log('Reset 기능 실행');
    const viewport = getSelectedViewport();
    if (!viewport) return;
    
    try {
      // 현재 이미지 ID 가져오기
      const imageIds = viewport.getImageIds();
      const currentImageIdIndex = viewport.getCurrentImageIdIndex();
      const currentImageId = imageIds[currentImageIdIndex];
      
      // 액터 가져오기
      const actor = viewport.getDefaultActor();
      
      if (actor && actor.actor) {
        // 모든 변환 초기화
        actor.actor.setScale([1, 1, 1]);
        actor.actor.setOrientation(0, 0, 0);
        
        // 중요: 원점을 이미지 중앙으로 설정
        if (actor.actor.getBounds) {
          const bounds = actor.actor.getBounds();
          // 중앙 좌표 계산 (x, y, z)
          const centerX = (bounds[0] + bounds[1]) / 2;
          const centerY = (bounds[2] + bounds[3]) / 2;
          const centerZ = (bounds[4] + bounds[5]) / 2;
          actor.actor.setOrigin(centerX, centerY, centerZ);
          console.log('리셋: 원점을 중앙으로 설정:', [centerX, centerY, centerZ]);
        } else {
          actor.actor.setOrigin(0, 0, 0);
        }
        
        actor.actor.setPosition(0, 0, 0);
        
        // 액터의 속성 초기화
        if (actor.actor.getProperty) {
          const property = actor.actor.getProperty();
          
          // 색상 반전 초기화
          if (property.setInverted) {
            property.setInverted(false);
          } else if (property.setInvertLookupTable) {
            property.setInvertLookupTable(false);
          }
          
          // 컬러맵 초기화
          if (property.setRGBTransferFunction) {
            property.setRGBTransferFunction(0, null);
          }
          
          // 룩업 테이블 초기화
          if (property.setUseLookupTable) {
            property.setUseLookupTable(false);
          }
          
          // 기타 가능한 속성들 초기화
          if (property.setColorWindow) {
            property.setColorWindow(255);
          }
          
          if (property.setColorLevel) {
            property.setColorLevel(127);
          }
        }
      }
      
      // 뷰포트 속성 초기화
      viewport.setProperties({
        invert: false,
        colormap: undefined,
        interpolationType: undefined,
        rotation: 0
      });
      
      // 카메라 완전 초기화
      viewport.resetCamera();
      
      // 이미지 다시 로드하기 (가장 확실한 방법)
      if (currentImageId) {
        viewport.setStack([currentImageId]).then(() => {
          viewport.render();
          console.log('이미지를 완전히 원래 상태로 되돌렸습니다');
        });
      } else {
        viewport.render();
        console.log('이미지를 원래 상태로 되돌렸습니다');
      }
    } catch (error) {
      console.error('Reset 기능 적용 중 오류 발생:', error);
    }
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