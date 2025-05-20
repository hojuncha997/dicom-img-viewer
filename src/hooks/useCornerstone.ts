import { useEffect, useState } from 'react';
import { 
  initializeCornerstone, 
  createRenderingEngine,
  enableViewport
} from '../utils/cornerstone';
import { useViewportStore } from '../store/viewportStore';
import { registerColormaps } from '../utils/colormap';
import * as cornerstone3D from '@cornerstonejs/core';

/**
 * Cornerstone3D 초기화 및 뷰포트 설정을 위한 훅
 */
export const useCornerstone = () => {
  // 초기화 상태 관리
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Viewport 상태 저장소에서 관련 setter 함수들 가져오기
  const { 
    setRenderingEngine,
    setViewport1,
    setViewport2,
    viewport1Element,
    viewport2Element
  } = useViewportStore();
  
  // Cornerstone3D 초기화
  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      if (isInitialized) return;
      
      try {
        setIsLoading(true);
        
        // Cornerstone3D 초기화
        await initializeCornerstone();
        
        // 컬러맵 등록
        registerColormaps();
        
        // 사용 가능한 컬러맵 확인 (디버깅용)
        try {
          if (cornerstone3D.utilities && cornerstone3D.utilities.colormap) {
            const availableColormaps = cornerstone3D.utilities.colormap.getColormapNames();
            console.log('사용 가능한 컬러맵 목록:', availableColormaps);
          } else {
            console.warn('컬러맵 유틸리티를 찾을 수 없습니다');
          }
        } catch (colormapError) {
          console.error('컬러맵 확인 중 오류:', colormapError);
        }
        
        if (isMounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Cornerstone 초기화 오류:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다'));
          setIsLoading(false);
        }
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
    };
  }, [isInitialized]);
  
  // 렌더링 엔진 및 뷰포트 생성
  useEffect(() => {
    // 초기화가 완료되고 두 뷰포트 요소가 모두 있을 경우에만 진행
    if (!isInitialized || !viewport1Element || !viewport2Element) {
      return;
    }
    
    try {
      // 렌더링 엔진 생성
      const engine = createRenderingEngine('dicomViewerEngine');
      if (!engine) {
        throw new Error('렌더링 엔진을 생성할 수 없습니다');
      }
      
      // 상태 저장소에 렌더링 엔진 저장
      setRenderingEngine(engine);
      
      // 첫 번째 뷰포트 활성화
      const vp1 = enableViewport(engine, viewport1Element, 'CT_STACK_1');
      if (vp1) {
        setViewport1(vp1);
      }
      
      // 두 번째 뷰포트 활성화
      const vp2 = enableViewport(engine, viewport2Element, 'CT_STACK_2');
      if (vp2) {
        setViewport2(vp2);
      }
      
      console.log('뷰포트 설정 완료');
    } catch (err) {
      console.error('뷰포트 설정 오류:', err);
      setError(err instanceof Error ? err : new Error('뷰포트 설정 중 오류가 발생했습니다'));
    }
  }, [isInitialized, viewport1Element, viewport2Element, setRenderingEngine, setViewport1, setViewport2]);
  
  // 정리 함수 (컴포넌트 언마운트 시 호출)
  useEffect(() => {
    return () => {
      // 렌더링 엔진 정리 로직은 필요한 경우 여기에 추가
    };
  }, []);
  
  return {
    isInitialized,
    isLoading,
    error
  };
};
