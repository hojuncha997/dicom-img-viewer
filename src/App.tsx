// src/App.tsx
import React, { useEffect, useRef } from 'react';

// Cornerstone3D 핵심 패키지 및 도구
import * as cornerstone3D from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import * as cornerstoneDicomImageLoader from '@cornerstonejs/dicom-image-loader';

const DicomViewer: React.FC = () => {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let renderingEngine: any = null;

    const initAndLoadDicom = async () => {
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
        // 외부 종속성 설정
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
        
        // 4. 렌더링 엔진 및 뷰포트 설정
        if (viewportRef.current) {
          const element = viewportRef.current;
          
          // 렌더링 엔진 생성
          renderingEngine = new cornerstone3D.RenderingEngine('myRenderingEngine');
          
          // 뷰포트 설정
          const viewportInput = {
            viewportId: 'CT_STACK',
            element,
            type: cornerstone3D.Enums.ViewportType.STACK,
          };
          
          // 뷰포트 활성화
          renderingEngine.enableElement(viewportInput);
          
          // 뷰포트 가져오기
          const viewport = renderingEngine.getViewport('CT_STACK');
          
          // 5. 이미지 로드 시도 - 두 가지 가능한 경로 시도
          const imagePaths = [
            '/dicom/image-000161.dcm',
            '/image-000161.dcm'
          ];
          
          let loadSuccess = false;
          
          for (const path of imagePaths) {
            if (loadSuccess) break;
            
            try {
              const imageId = `wadouri:${window.location.origin}${path}`;
              console.log('이미지 로드 시도:', imageId);
              
              await viewport.setStack([imageId]);
              viewport.render();
              
              console.log('이미지 로드 및 렌더링 성공:', path);
              loadSuccess = true;
            } catch (error) {
              console.error(`${path} 경로 이미지 로드 실패:`, error);
            }
          }
          
          if (!loadSuccess) {
            console.error('모든 경로에서 이미지 로드 실패');
            console.log('DICOM 파일이 다음 위치에 있는지 확인하세요:');
            console.log('public/image-000161.dcm 또는 public/dicom/image-000161.dcm');
          }
        }
      } catch (error) {
        console.error('DICOM 뷰어 초기화 중 오류 발생:', error);
      }
    };
    
    initAndLoadDicom();
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (renderingEngine) {
        renderingEngine.destroy();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">DICOM 이미지 뷰어 (Cornerstone3D v1.86)</h1>
      <div
        ref={viewportRef}
        className="border border-gray-300 rounded bg-black"
        style={{ width: '500px', height: '500px' }}
      ></div>
      <p className="mt-4 text-sm text-gray-600">
        public/image-000161.dcm 또는 public/dicom/image-000161.dcm 파일 표시
      </p>
      <p className="mt-2 text-xs text-gray-500">
        Cornerstone3D v1.86 사용
      </p>
    </div>
  );
};

export default DicomViewer;