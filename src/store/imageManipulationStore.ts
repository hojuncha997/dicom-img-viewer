import { create } from 'zustand';
import { useViewportStore } from './viewportStore';
import { applyColormapToViewport } from '../utils/colormap';

interface ViewportProperties {
  isInverted: boolean;
  originalVOI: any | null;
  colormap: string | null;
}

interface ImageManipulationState {
  // 각 뷰포트별 상태
  viewport1Properties: ViewportProperties;
  viewport2Properties: ViewportProperties;
  
  // 사용 가능한 컬러맵 목록
  availableColormaps: string[];
  
  // 상태 업데이트 함수
  setViewport1Inverted: (isInverted: boolean) => void;
  setViewport2Inverted: (isInverted: boolean) => void;
  setViewport1OriginalVOI: (voi: any) => void;
  setViewport2OriginalVOI: (voi: any) => void;
  setViewport1Colormap: (colormap: string | null) => void;
  setViewport2Colormap: (colormap: string | null) => void;
  
  // 이미지 조작 함수
  handleZoom: () => void;
  handleFlipH: () => void;
  handleFlipV: () => void;
  handleRotate: () => void;
  handleInvert: () => void;
  handleColormap: () => void;
  handleReset: () => void;
}

export const useImageManipulationStore = create<ImageManipulationState>((set, get) => ({
  // 초기 상태
  viewport1Properties: {
    isInverted: false,
    originalVOI: null,
    colormap: null,
  },
  viewport2Properties: {
    isInverted: false,
    originalVOI: null,
    colormap: null,
  },
  
  // 사용 가능한 컬러맵 목록
  availableColormaps: ['jet', 'hot', 'plasma', 'viridis', 'magma', 'turbo', 'temperature', 'perfusion'],
  
  // 상태 업데이트 함수
  setViewport1Inverted: (isInverted: boolean) => set((state) => ({
    viewport1Properties: {
      ...state.viewport1Properties,
      isInverted,
    }
  })),
  setViewport2Inverted: (isInverted: boolean) => set((state) => ({
    viewport2Properties: {
      ...state.viewport2Properties,
      isInverted,
    }
  })),
  setViewport1OriginalVOI: (voi: any) => set((state) => ({
    viewport1Properties: {
      ...state.viewport1Properties,
      originalVOI: voi,
    }
  })),
  setViewport2OriginalVOI: (voi: any) => set((state) => ({
    viewport2Properties: {
      ...state.viewport2Properties,
      originalVOI: voi,
    }
  })),
  setViewport1Colormap: (colormap: string | null) => set((state) => ({
    viewport1Properties: {
      ...state.viewport1Properties,
      colormap,
    }
  })),
  setViewport2Colormap: (colormap: string | null) => set((state) => ({
    viewport2Properties: {
      ...state.viewport2Properties,
      colormap,
    }
  })),
  
  // 이미지 조작 함수
  handleZoom: () => {
    console.log('Zoom 기능 실행');
    const viewport = useViewportStore.getState().getSelectedViewport();
    if (!viewport) {
      console.log('선택된 뷰포트가 없습니다. 이미지를 먼저 선택해주세요.');
      return;
    }
    
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
  },
  
  handleFlipH: () => {
    console.log('Flip H 기능 실행');
    const viewport = useViewportStore.getState().getSelectedViewport();
    if (!viewport) {
      console.log('선택된 뷰포트가 없습니다. 이미지를 먼저 선택해주세요.');
      return;
    }
    
    try {
      // 액터(VTK 객체) 가져오기
      const actor = viewport.getDefaultActor();
      if (actor && actor.actor) {
        // 플립 전 카메라 정보 저장
        const camera = viewport.getCamera();
        const originalParallelScale = camera.parallelScale;
        
        // 중앙 원점 설정 시도
        if (actor.actor.getBounds && actor.actor.setOrigin) {
          const bounds = actor.actor.getBounds();
          const centerX = (bounds[0] + bounds[1]) / 2;
          const centerY = (bounds[2] + bounds[3]) / 2;
          const centerZ = (bounds[4] + bounds[5]) / 2;
          actor.actor.setOrigin(centerX, centerY, centerZ);
        }
        
        // X 축 스케일 반전
        const scale = actor.actor.getScale();
        scale[0] = -scale[0];
        actor.actor.setScale(scale);
        
        // 카메라 재설정
        viewport.resetCamera();
        
        // 원래 크기로 복원
        if (originalParallelScale) {
          const newCamera = viewport.getCamera();
          newCamera.parallelScale = originalParallelScale;
          viewport.setCamera(newCamera);
        }
        
        viewport.render();
        console.log('이미지를 좌우 반전했습니다');
      } else {
        console.log('좌우 반전 기능을 적용할 수 없습니다');
      }
    } catch (error) {
      console.error('Flip H 기능 적용 중 오류 발생:', error);
    }
  },
  
  handleFlipV: () => {
    console.log('Flip V 기능 실행');
    const viewport = useViewportStore.getState().getSelectedViewport();
    if (!viewport) {
      console.log('선택된 뷰포트가 없습니다. 이미지를 먼저 선택해주세요.');
      return;
    }
    
    try {
      // 액터(VTK 객체) 가져오기
      const actor = viewport.getDefaultActor();
      if (actor && actor.actor) {
        // 플립 전 카메라 정보 저장
        const camera = viewport.getCamera();
        const originalParallelScale = camera.parallelScale;
        
        // 중앙 원점 설정 시도
        if (actor.actor.getBounds && actor.actor.setOrigin) {
          const bounds = actor.actor.getBounds();
          const centerX = (bounds[0] + bounds[1]) / 2;
          const centerY = (bounds[2] + bounds[3]) / 2;
          const centerZ = (bounds[4] + bounds[5]) / 2;
          actor.actor.setOrigin(centerX, centerY, centerZ);
        }
        
        // Y 축 스케일 반전
        const scale = actor.actor.getScale();
        scale[1] = -scale[1];
        actor.actor.setScale(scale);
        
        // 카메라 재설정
        viewport.resetCamera();
        
        // 원래 크기로 복원
        if (originalParallelScale) {
          const newCamera = viewport.getCamera();
          newCamera.parallelScale = originalParallelScale;
          viewport.setCamera(newCamera);
        }
        
        viewport.render();
        console.log('이미지를 상하 반전했습니다');
      } else {
        console.log('상하 반전 기능을 적용할 수 없습니다');
      }
    } catch (error) {
      console.error('Flip V 기능 적용 중 오류 발생:', error);
    }
  },
  
  handleRotate: () => {
    console.log('Rotate Delta 30 기능 실행');
    const viewport = useViewportStore.getState().getSelectedViewport();
    if (!viewport) {
      console.log('선택된 뷰포트가 없습니다. 이미지를 먼저 선택해주세요.');
      return;
    }
    
    try {
      // 액터(VTK 객체) 가져오기
      const actor = viewport.getDefaultActor();
      if (actor && actor.actor) {
        // 회전 전 원점을 이미지 중앙으로 설정
        if (actor.actor.getBounds && actor.actor.setOrigin) {
          const bounds = actor.actor.getBounds();
          const centerX = (bounds[0] + bounds[1]) / 2;
          const centerY = (bounds[2] + bounds[3]) / 2;
          const centerZ = (bounds[4] + bounds[5]) / 2;
          actor.actor.setOrigin(centerX, centerY, centerZ);
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
  },
  
  handleInvert: () => {
    console.log('Invert 기능 실행');
    const viewport = useViewportStore.getState().getSelectedViewport();
    if (!viewport) {
      console.log('선택된 뷰포트가 없습니다. 이미지를 먼저 선택해주세요.');
      return;
    }
    
    // 현재 선택된 뷰포트 확인
    const isLeftViewport = useViewportStore.getState().selectedViewport === 'left';
    
    // 상태 가져오기
    const state = get();
    const isCurrentlyInverted = isLeftViewport 
      ? state.viewport1Properties.isInverted 
      : state.viewport2Properties.isInverted;
    
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
          set((state) => ({
            viewport1Properties: {
              ...state.viewport1Properties,
              isInverted: true,
              originalVOI
            }
          }));
        } else {
          set((state) => ({
            viewport2Properties: {
              ...state.viewport2Properties,
              isInverted: true,
              originalVOI
            }
          }));
        }
        
        // 간단한 invert 플래그 설정
        viewportProperties.invert = true;
        
        // 속성 업데이트
        viewport.setProperties(viewportProperties);
        viewport.render();
        
        console.log('반전 적용 완료');
      } else {
        // *** 두 번째 반전: 원래 상태로 복원 ***
        
        // 원본 VOI를 상태에서 가져오기
        const originalVOI = isLeftViewport 
          ? state.viewport1Properties.originalVOI 
          : state.viewport2Properties.originalVOI;
        
        if (originalVOI) {
          // 원본 VOI 복원 (형식에 따라)
          if (originalVOI.lower !== undefined) {
            viewportProperties.voiRange = JSON.parse(JSON.stringify(originalVOI));
            delete viewportProperties.voi;
          } else if (originalVOI.windowCenter !== undefined) {
            viewportProperties.voi = JSON.parse(JSON.stringify(originalVOI));
            delete viewportProperties.voiRange;
          }
        }
        
        // 반전 플래그 복원
        viewportProperties.invert = false;
        delete viewportProperties.colormap;
        
        // 속성 업데이트
        viewport.setProperties(viewportProperties);
        viewport.render();
        
        // 반전 상태를 React 상태에서 업데이트
        if (isLeftViewport) {
          set((state) => ({
            viewport1Properties: {
              ...state.viewport1Properties,
              isInverted: false
            }
          }));
        } else {
          set((state) => ({
            viewport2Properties: {
              ...state.viewport2Properties,
              isInverted: false
            }
          }));
        }
        
        console.log('원래 상태로 복원 완료');
      }
    } catch (error) {
      console.error('Invert 기능 적용 중 오류 발생:', error);
    }
  },
  
  handleColormap: () => {
    console.log('Apply Colormap 기능 실행');
    const viewport = useViewportStore.getState().getSelectedViewport();
    if (!viewport) {
      console.log('선택된 뷰포트가 없습니다. 이미지를 먼저 선택해주세요.');
      return;
    }
    
    // 현재 선택된 뷰포트 확인
    const isLeftViewport = useViewportStore.getState().selectedViewport === 'left';
    
    // 현재 상태 및 컬러맵 가져오기
    const state = get();
    const currentColormap = isLeftViewport 
      ? state.viewport1Properties.colormap 
      : state.viewport2Properties.colormap;
    
    const availableColormaps = state.availableColormaps;
    
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
      
      // 컬러맵 적용 로직 추가
      const success = applyColormapToViewport(viewport, nextColormap);
      
      if (success) {
        // 상태 업데이트
        if (isLeftViewport) {
          set((state) => ({
            viewport1Properties: {
              ...state.viewport1Properties,
              colormap: nextColormap
            }
          }));
        } else {
          set((state) => ({
            viewport2Properties: {
              ...state.viewport2Properties,
              colormap: nextColormap
            }
          }));
        }
        
        console.log(`컬러맵 ${nextColormap ? '적용' : '제거'} 처리 완료`);
      } else {
        console.error('컬러맵 적용에 실패했습니다');
      }
    } catch (error) {
      console.error('Colormap 기능 적용 중 오류 발생:', error);
    }
  },
  
  handleReset: () => {
    console.log('Reset 기능 실행');
    const viewport = useViewportStore.getState().getSelectedViewport();
    if (!viewport) {
      console.log('선택된 뷰포트가 없습니다. 이미지를 먼저 선택해주세요.');
      return;
    }
    
    // 현재 선택된 뷰포트 확인
    const isLeftViewport = useViewportStore.getState().selectedViewport === 'left';
    
    try {
      // 현재 이미지 ID 가져오기
      const imageIds = viewport.getImageIds();
      const currentImageIdIndex = viewport.getCurrentImageIdIndex();
      const currentImageId = imageIds[currentImageIdIndex];
      
      if (!currentImageId) {
        console.error('현재 이미지 ID를 찾을 수 없습니다');
        return;
      }
      
      // 가장 확실한 방법: 이미지를 다시 로드하여 모든 변환 초기화
      viewport.setStack([currentImageId]).then(() => {
        // 완전히 원래 카메라 설정으로 복원
        viewport.resetCamera();
        
        // 이미지를 완전히 화면에 맞추기 위한 추가 처리
        setTimeout(() => {
          // 약간의 지연 후 한번 더 카메라 리셋을 호출하여 더 정확히 복원
          viewport.resetCamera();
          viewport.render();
        }, 50);
        
        // 상태 초기화
        if (isLeftViewport) {
          set((state) => ({
            viewport1Properties: {
              isInverted: false,
              originalVOI: null,
              colormap: null,
            }
          }));
        } else {
          set((state) => ({
            viewport2Properties: {
              isInverted: false,
              originalVOI: null,
              colormap: null,
            }
          }));
        }
        
        // 뷰포트 속성 초기화 (이미지 로드 후 다시 한번 설정)
        viewport.setProperties({
          invert: false,
          colormap: undefined,
          interpolationType: undefined,
          rotation: 0
        });
        
        viewport.render();
        console.log('이미지를 완전히 원래 상태로 되돌렸습니다');
      }).catch((error: Error) => {
        console.error('이미지 재로드 중 오류 발생:', error);
      });
    } catch (error) {
      console.error('Reset 기능 적용 중 오류 발생:', error);
    }
  },
}));

// 헬퍼 함수: 선택된 뷰포트에 대한 이미지 조작 함수들을 가져옴
export const useSelectedViewportManipulation = () => {
  const { selectedViewport } = useViewportStore();
  const {
    handleZoom,
    handleFlipH,
    handleFlipV,
    handleRotate,
    handleInvert,
    handleColormap,
    handleReset
  } = useImageManipulationStore();
  
  // 뷰포트가 선택되었는지 여부
  const isViewportSelected = selectedViewport !== null;
  
  return {
    handleZoom,
    handleFlipH,
    handleFlipV,
    handleRotate,
    handleInvert,
    handleColormap,
    handleReset,
    isViewportSelected
  };
};
