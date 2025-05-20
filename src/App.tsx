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
  
  // 각 뷰포트의 반전 상태 관리 추가
  const [isViewport1Inverted, setIsViewport1Inverted] = useState(false);
  const [isViewport2Inverted, setIsViewport2Inverted] = useState(false);
  
  // 각 뷰포트의 원본 VOI 값 저장
  const [viewport1OriginalVOI, setViewport1OriginalVOI] = useState<any>(null);
  const [viewport2OriginalVOI, setViewport2OriginalVOI] = useState<any>(null);
  
  // 각 뷰포트의 컬러맵 상태 관리
  const [viewport1Colormap, setViewport1Colormap] = useState<string | null>(null);
  const [viewport2Colormap, setViewport2Colormap] = useState<string | null>(null);
  
  // 사용 가능한 컬러맵 목록
  const availableColormaps = ['jet', 'hot', 'plasma', 'viridis', 'magma', 'turbo', 'temperature', 'perfusion'];
  
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
    
    // 현재 선택된 뷰포트 확인
    const isLeftViewport = selectedViewport === 'left';
    
    // 현재 반전 상태를 React 상태에서 가져오기
    const isCurrentlyInverted = isLeftViewport ? isViewport1Inverted : isViewport2Inverted;
    console.log('현재 반전 상태:', isCurrentlyInverted);
    
    try {
      // 현재 뷰포트 속성 가져오기
      const viewportProperties = viewport.getProperties() || {};
      
      if (!isCurrentlyInverted) {
        // *** 첫 번째 반전: 원본 값 저장 후 반전 적용 ***
        
        // 원본 VOI 값 저장 (복원용)
        const currentVOI = viewportProperties.voiRange || viewportProperties.voi || {};
        const originalVOI = JSON.parse(JSON.stringify(currentVOI)); // 깊은 복사
        
        // 원본 VOI를 상태에 저장
        if (isLeftViewport) {
          setViewport1OriginalVOI(originalVOI);
        } else {
          setViewport2OriginalVOI(originalVOI);
        }
        
        console.log('원본 VOI 저장:', originalVOI);
        
        // 현재 이미지 데이터 범위 확인
        try {
          const actor = viewport.getDefaultActor();
          if (actor && actor.actor && actor.actor.getMapper()) {
            const imageData = actor.actor.getMapper().getInputData();
            const scalars = imageData.getPointData().getScalars();
            const range = scalars.getRange();
            console.log('이미지 실제 데이터 범위:', range);
          }
        } catch (rangeError) {
          console.error('이미지 범위 확인 오류:', rangeError);
        }
        
        // 간단한 invert 플래그 설정
        viewportProperties.invert = true;
        
        // 속성 업데이트
        viewport.setProperties(viewportProperties);
        viewport.render();
        
        // 반전 상태를 React 상태에 저장
        if (isLeftViewport) {
          setIsViewport1Inverted(true);
        } else {
          setIsViewport2Inverted(true);
        }
        
        console.log('반전 적용 완료');
      } else {
        // *** 두 번째 반전: 원래 상태로 복원 ***
        
        // 원본 VOI를 상태에서 가져오기
        const originalVOI = isLeftViewport ? viewport1OriginalVOI : viewport2OriginalVOI;
        
        if (originalVOI) {
          // 원본 VOI 복원 (형식에 따라)
          if (originalVOI.lower !== undefined) {
            viewportProperties.voiRange = JSON.parse(JSON.stringify(originalVOI));
            delete viewportProperties.voi;
          } else if (originalVOI.windowCenter !== undefined) {
            viewportProperties.voi = JSON.parse(JSON.stringify(originalVOI));
            delete viewportProperties.voiRange;
          }
          console.log('원래 VOI 값으로 복원:', originalVOI);
        }
        
        // 반전 플래그 복원
        viewportProperties.invert = false;
        delete viewportProperties.colormap;
        
        // 속성 업데이트
        viewport.setProperties(viewportProperties);
        viewport.render();
        
        // 반전 상태를 React 상태에서 업데이트
        if (isLeftViewport) {
          setIsViewport1Inverted(false);
        } else {
          setIsViewport2Inverted(false);
        }
        
        console.log('원래 상태로 복원 완료');
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
    
    // 현재 선택된 뷰포트 확인
    const isLeftViewport = selectedViewport === 'left';
    
    // 현재 컬러맵 상태 가져오기
    const currentColormap = isLeftViewport ? viewport1Colormap : viewport2Colormap;
    
    try {
      // 컬러맵 상태에 따라 다음 컬러맵 결정
      let nextColormap: string | null = null;
      
      if (!currentColormap) {
        // 컬러맵이 없는 경우 첫 번째 컬러맵 적용
        nextColormap = availableColormaps[0]; // 'jet'
      } else {
        // 현재 컬러맵이 있는 경우 다음 컬러맵으로 변경 또는 초기화
        const currentIndex = availableColormaps.indexOf(currentColormap);
        if (currentIndex === availableColormaps.length - 1) {
          // 마지막 컬러맵이면 컬러맵 제거
          nextColormap = null;
        } else {
          // 다음 컬러맵으로 순환
          nextColormap = availableColormaps[currentIndex + 1];
        }
      }
      
      // 액터 가져오기
      const actor = viewport.getDefaultActor();
      if (!actor || !actor.actor) {
        console.error('액터를 찾을 수 없습니다.');
        return;
      }
      
      if (nextColormap) {
        console.log(`컬러맵 '${nextColormap}' 적용 시도`);
        
        // 1. 데이터 범위 확인
        let dataRange = [0, 4095]; // 기본값
        try {
          const imageData = viewport.getDefaultImageData();
          if (imageData) {
            const scalars = imageData.getPointData().getScalars();
            dataRange = scalars.getRange();
            console.log('이미지 데이터 범위:', dataRange);
          }
        } catch (rangeError) {
          console.error('범위 설정 오류:', rangeError);
        }
        
        // 2. cornerstone3D 유틸리티에서 컬러맵 가져오기
        let colormapData;
        try {
          // 기존에 등록된 컬러맵이 있는지 확인
          const availableColormapsCS3D = cornerstone3D.utilities.colormap.getColormapNames();
          console.log('사용 가능한 cornerstone 컬러맵:', availableColormapsCS3D);
          
          // 요청한 컬러맵이 이미 등록되어 있는지 확인
          if (availableColormapsCS3D.includes(nextColormap)) {
            // 등록된 컬러맵 사용
            colormapData = cornerstone3D.utilities.colormap.getColormap(nextColormap);
            console.log('등록된 컬러맵 사용:', nextColormap);
          } else {
            // 컬러맵이 등록되어 있지 않으면 등록
            const presetData = getColormapPreset(nextColormap);
            
            // RGB 포인트를 Cornerstone 형식으로 변환
            const rgbPoints: number[] = [];
            presetData.rgbPoints.forEach((point: {x: number, r: number, g: number, b: number}) => {
              rgbPoints.push(point.x);
              rgbPoints.push(point.r);
              rgbPoints.push(point.g);
              rgbPoints.push(point.b);
            });
            
            // 새 컬러맵 등록
            const newColormap = {
              Name: nextColormap,
              ColorSpace: 'RGB',
              RGBPoints: rgbPoints
            };
            
            cornerstone3D.utilities.colormap.registerColormap(newColormap);
            colormapData = cornerstone3D.utilities.colormap.getColormap(nextColormap);
            console.log('새 컬러맵 등록 및 사용:', nextColormap);
          }
        } catch (colormapError) {
          console.error('컬러맵 로드 오류:', colormapError);
          return;
        }
        
        if (!colormapData) {
          console.error('컬러맵 데이터를 가져올 수 없습니다.');
          return;
        }
        
        // 3. VTK 속성 가져오기
        const vtkProperty = actor.actor.getProperty();
        if (!vtkProperty) {
          console.error('VTK 속성을 찾을 수 없습니다.');
          return;
        }
        
        // 4. 색상 전송 함수 가져오기
        let colorTransferFunction = null;
        if (vtkProperty.getLookupTable) {
          colorTransferFunction = vtkProperty.getLookupTable();
        } else if (vtkProperty.getRGBTransferFunction) {
          colorTransferFunction = vtkProperty.getRGBTransferFunction(0);
        }
        
        if (!colorTransferFunction) {
          console.error('색상 전송 함수를 가져올 수 없습니다.');
          return;
        }
        
        // 5. 컬러맵 적용
        try {
          // 모든 기존 포인트 제거
          if (colorTransferFunction.removeAllPoints) {
            colorTransferFunction.removeAllPoints();
          }
          
          // 범위를 데이터 범위에 맞게 조정
          const min = dataRange[0];
          const max = dataRange[1];
          const range = max - min;
          
          // RGBPoints 배열에서 포인트 추가 (형식: [x1, r1, g1, b1, x2, r2, g2, b2, ...])
          for (let i = 0; i < colormapData.RGBPoints.length; i += 4) {
            const x = colormapData.RGBPoints[i];
            const r = colormapData.RGBPoints[i + 1];
            const g = colormapData.RGBPoints[i + 2];
            const b = colormapData.RGBPoints[i + 3];
            
            const value = min + (x * range); // 0-1 범위를 실제 데이터 범위로 변환
            if (colorTransferFunction.addRGBPoint) {
              colorTransferFunction.addRGBPoint(value, r, g, b);
            }
          }
          
          // 변경 알림
          if (colorTransferFunction.modified) {
            colorTransferFunction.modified();
          }
          
          // 룩업 테이블 사용 활성화
          vtkProperty.setUseLookupTableScalarRange(true);
          vtkProperty.modified && vtkProperty.modified();
          actor.actor.modified && actor.actor.modified();
          
          console.log('cornerstone3D 컬러맵 적용 완료');
        } catch (applyError) {
          console.error('컬러맵 적용 오류:', applyError);
        }
      } else {
        console.log('컬러맵 제거 (그레이스케일로 복원)');
        
        // 액터 속성 가져오기
        const vtkProperty = actor.actor.getProperty();
        
        // 룩업 테이블 비활성화
        if (vtkProperty) {
          vtkProperty.setUseLookupTableScalarRange(false);
          vtkProperty.modified && vtkProperty.modified();
          actor.actor.modified && actor.actor.modified();
        }
      }
      
      // 렌더링 갱신
      viewport.render();
      
      // 약간의 시간차를 두고 한 번 더 렌더링 (비동기 문제 해결)
      setTimeout(() => {
        viewport.render();
        console.log('두 번째 렌더링 완료');
      }, 100);
      
      // React 상태 업데이트
      if (isLeftViewport) {
        setViewport1Colormap(nextColormap);
      } else {
        setViewport2Colormap(nextColormap);
      }
      
      console.log(`컬러맵 ${nextColormap ? '적용' : '제거'} 처리 완료`);
    } catch (error) {
      console.error('Colormap 기능 적용 중 오류 발생:', error);
    }
  };
  
  // 컬러맵 프리셋 가져오기
  const getColormapPreset = (name: string) => {
    const presets: Record<string, any> = {
      jet: {
        hueRange: [0, 0.667], // 파란색에서 빨간색
        saturationRange: [1, 1],
        valueRange: [1, 1],
        rgbPoints: [
          { x: 0.0, r: 0, g: 0, b: 0.5 },
          { x: 0.25, r: 0, g: 0.5, b: 1 },
          { x: 0.5, r: 0, g: 1, b: 0.5 },
          { x: 0.75, r: 1, g: 0.5, b: 0 },
          { x: 1.0, r: 0.5, g: 0, b: 0 }
        ]
      },
      hot: {
        hueRange: [0, 0.1], // 빨간색에서 노란색
        saturationRange: [0.8, 0.8],
        valueRange: [0.3, 1],
        rgbPoints: [
          { x: 0.0, r: 0, g: 0, b: 0 },
          { x: 0.33, r: 1, g: 0, b: 0 },
          { x: 0.66, r: 1, g: 1, b: 0 },
          { x: 1.0, r: 1, g: 1, b: 1 }
        ]
      },
      plasma: {
        hueRange: [0.7, 0], // 보라색에서 노란색
        saturationRange: [0.8, 0.8],
        valueRange: [0.6, 1],
        rgbPoints: [
          { x: 0.0, r: 0.05, g: 0.03, b: 0.5 },
          { x: 0.25, r: 0.4, g: 0, b: 0.6 },
          { x: 0.5, r: 0.6, g: 0.15, b: 0.5 },
          { x: 0.75, r: 0.9, g: 0.4, b: 0.2 },
          { x: 1.0, r: 1, g: 0.9, b: 0.1 }
        ]
      },
      viridis: {
        hueRange: [0.7, 0.35], // 보라색에서 녹색/노란색
        saturationRange: [0.8, 0.7],
        valueRange: [0.6, 1],
        rgbPoints: [
          { x: 0.0, r: 0.267, g: 0.004, b: 0.329 },
          { x: 0.25, r: 0.255, g: 0.255, b: 0.478 },
          { x: 0.5, r: 0.164, g: 0.517, b: 0.431 },
          { x: 0.75, r: 0.474, g: 0.764, b: 0.176 },
          { x: 1.0, r: 0.988, g: 0.992, b: 0.019 }
        ]
      },
      magma: {
        hueRange: [0.8, 0], // 보라색에서 노란색
        saturationRange: [0.8, 0.6],
        valueRange: [0.2, 1],
        rgbPoints: [
          { x: 0.0, r: 0, g: 0, b: 0 },
          { x: 0.25, r: 0.3, g: 0.05, b: 0.4 },
          { x: 0.5, r: 0.8, g: 0.1, b: 0.4 },
          { x: 0.75, r: 0.95, g: 0.45, b: 0.3 },
          { x: 1.0, r: 1, g: 1, b: 0.6 }
        ]
      },
      turbo: {
        hueRange: [0.85, 0], // 보라색에서 빨간색
        saturationRange: [0.8, 0.8],
        valueRange: [0.7, 0.9],
        rgbPoints: [
          { x: 0.0, r: 0.18, g: 0.0, b: 0.36 },
          { x: 0.2, r: 0.0, g: 0.36, b: 0.9 },
          { x: 0.4, r: 0.0, g: 0.73, b: 0.53 },
          { x: 0.6, r: 0.67, g: 0.85, b: 0.0 },
          { x: 0.8, r: 0.97, g: 0.46, b: 0.0 },
          { x: 1.0, r: 0.4, g: 0.0, b: 0.0 }
        ]
      },
      temperature: {
        hueRange: [0.7, 0], // 파란색에서 빨간색 (온도 스타일)
        saturationRange: [0.9, 0.9],
        valueRange: [0.5, 1],
        rgbPoints: [
          { x: 0.0, r: 0, g: 0, b: 1 },
          { x: 0.5, r: 1, g: 1, b: 1 },
          { x: 1.0, r: 1, g: 0, b: 0 }
        ]
      },
      perfusion: {
        hueRange: [0.4, 0], // 녹색에서 빨간색
        saturationRange: [0.8, 0.9],
        valueRange: [0.6, 0.9],
        rgbPoints: [
          { x: 0.0, r: 0, g: 0.8, b: 0 },
          { x: 0.5, r: 0.8, g: 0.8, b: 0 },
          { x: 1.0, r: 0.8, g: 0, b: 0 }
        ]
      }
    };
    
    return presets[name] || presets.jet;
  };
  
  // HSV 기반 설정으로 RGB 포인트 생성
  const generateRGBPoints = (preset: any, pointCount: number = 10) => {
    const points = [];
    const hueStart = preset.hueRange[0];
    const hueEnd = preset.hueRange[1];
    const satStart = preset.saturationRange[0];
    const satEnd = preset.saturationRange[1];
    const valStart = preset.valueRange[0];
    const valEnd = preset.valueRange[1];
    
    for (let i = 0; i < pointCount; i++) {
      const t = i / (pointCount - 1);
      const h = hueStart + (hueEnd - hueStart) * t;
      const s = satStart + (satEnd - satStart) * t;
      const v = valStart + (valEnd - valStart) * t;
      
      // 간단한 HSV -> RGB 변환
      let r, g, b;
      const hi = Math.floor(h * 6) % 6;
      const f = h * 6 - hi;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t2 = v * (1 - (1 - f) * s);
      
      switch (hi) {
        case 0: r = v; g = t2; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t2; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t2; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        default: r = v; g = t2; b = p;
      }
      
      points.push({
        x: t,
        r: r,
        g: g,
        b: b
      });
    }
    
    return points;
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
        
        // 사용 가능한 컬러맵 확인
        try {
          console.log('===== 사용 가능한 컬러맵 목록 확인 =====');
          if (cornerstone3D.utilities && cornerstone3D.utilities.colormap) {
            const colormaps = cornerstone3D.utilities.colormap.getColormapNames();
            console.log('사용 가능한 컬러맵:', colormaps);
          } else {
            console.log('컬러맵 유틸리티를 찾을 수 없습니다.');
            console.log('cornerstone3D.utilities:', cornerstone3D.utilities);
          }
          
          // cornerstone3D 객체 구조 확인
          console.log('cornerstone3D 객체 구조:');
          console.log('cornerstone3D 키:', Object.keys(cornerstone3D));
          
          if (cornerstone3D.utilities) {
            const utilities = Object.keys(cornerstone3D.utilities);
            console.log('utilities 키:', utilities);
            
            // 각 유틸리티 확인
            utilities.forEach(util => {
              const utilObj = (cornerstone3D.utilities as any)[util];
              if (utilObj && typeof utilObj === 'object') {
                console.log(`${util} 유틸리티 메서드:`, Object.keys(utilObj));
              }
            });
          }
          
          // 뷰포트 확인
          console.log('StackViewport prototype 메서드:', 
            Object.getOwnPropertyNames(Object.getPrototypeOf(cornerstone3D.StackViewport.prototype)));
          
          // RenderingEngine API 확인
          console.log('RenderingEngine prototype 메서드:', 
            Object.getOwnPropertyNames(Object.getPrototypeOf(new cornerstone3D.RenderingEngine('test'))));
        } catch (colormapError) {
          console.error('컬러맵 확인 중 오류:', colormapError);
        }
        
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