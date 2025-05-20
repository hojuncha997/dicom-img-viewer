// Cornerstone3D 핵심 패키지 및 도구
import * as cornerstone3D from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import * as cornerstoneDicomImageLoader from '@cornerstonejs/dicom-image-loader';

/**
 * Cornerstone3D 초기화 함수
 * 필요한 모든 Cornerstone3D 라이브러리를 초기화하고 설정합니다.
 */
export const initializeCornerstone = async (): Promise<void> => {
  try {
    // dicom-parser 동적 임포트
    const dicomParserModule = await import('dicom-parser');
    const dicomParser = dicomParserModule.default || dicomParserModule;
    
    console.log('DICOM 파서 모듈 임포트 완료');
    
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
    
    return Promise.resolve();
  } catch (error) {
    console.error('Cornerstone3D 초기화 오류:', error);
    return Promise.reject(error);
  }
};

/**
 * 렌더링 엔진 생성 함수
 * 새 Cornerstone3D 렌더링 엔진을 생성합니다.
 */
export const createRenderingEngine = (id: string = 'cornerstone-rendering-engine') => {
  try {
    const engine = new cornerstone3D.RenderingEngine(id);
    console.log('렌더링 엔진 생성 완료:', id);
    return engine;
  } catch (error) {
    console.error('렌더링 엔진 생성 오류:', error);
    return null;
  }
};

/**
 * 뷰포트 활성화 함수
 * 지정된 요소에서 Cornerstone3D 뷰포트를 활성화합니다.
 */
export const enableViewport = (
  engine: any,
  element: HTMLDivElement,
  viewportId: string,
  type: cornerstone3D.Enums.ViewportType = cornerstone3D.Enums.ViewportType.STACK
) => {
  try {
    const viewport = {
      viewportId,
      element,
      type,
    };
    
    engine.enableElement(viewport);
    
    // 활성화된 뷰포트 반환
    return engine.getViewport(viewportId);
  } catch (error) {
    console.error('뷰포트 활성화 오류:', error);
    return null;
  }
};

/**
 * wadouri 프로토콜을 사용하여 이미지 ID 형식 지정
 */
export const formatImageId = (relativePath: string): string => {
  return `wadouri:${window.location.origin}${relativePath}`;
};

/**
 * 뷰포트에 이미지 로드 함수
 */
export const loadImageToViewport = async (viewport: any, imageId: string): Promise<boolean> => {
  try {
    await viewport.setStack([imageId]);
    viewport.render();
    return true;
  } catch (error) {
    console.error('이미지 로드 오류:', error);
    return false;
  }
};

/**
 * 렌더링 엔진 및 뷰포트 정리
 */
export const cleanupCornerstone = (engine: any): void => {
  if (engine) {
    try {
      engine.destroy();
      console.log('Cornerstone 렌더링 엔진 정리 완료');
    } catch (error) {
      console.error('Cornerstone 정리 중 오류 발생:', error);
    }
  }
};
