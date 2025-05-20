import { useEffect } from 'react';
import { useViewportStore } from '../store/viewportStore';
import { useViewerStore, useViewerImages } from '../store/viewerStore';
import { formatImageId, loadImageToViewport } from '../utils/cornerstone';

/**
 * 뷰포트에 이미지 로드 및 관리를 위한 훅
 */
export const useViewport = () => {
  // 뷰포트 상태 및 이미지 ID 가져오기
  const { viewport1, viewport2 } = useViewportStore();
  const { currentPairIndex } = useViewerStore();
  const { leftImageId, rightImageId } = useViewerImages();
  
  // 이미지 쌍이 변경될 때 두 뷰포트에 이미지 로드
  useEffect(() => {
    // 뷰포트와 이미지 ID 확인
    if (!viewport1 || !viewport2) return;
    if (!leftImageId && !rightImageId) return;
    
    const loadImages = async () => {
      try {
        // 왼쪽 이미지 로드
        if (leftImageId) {
          const formattedLeftImageId = formatImageId(leftImageId);
          await loadImageToViewport(viewport1, formattedLeftImageId);
          console.log('왼쪽 이미지 로드 완료:', leftImageId);
        }
        
        // 오른쪽 이미지 로드
        if (rightImageId) {
          const formattedRightImageId = formatImageId(rightImageId);
          await loadImageToViewport(viewport2, formattedRightImageId);
          console.log('오른쪽 이미지 로드 완료:', rightImageId);
        }
      } catch (error) {
        console.error('이미지 로드 중 오류 발생:', error);
      }
    };
    
    loadImages();
  }, [viewport1, viewport2, leftImageId, rightImageId, currentPairIndex]);
  
  return {
    isViewportsReady: !!viewport1 && !!viewport2,
    hasLeftImage: !!leftImageId,
    hasRightImage: !!rightImageId
  };
};

/**
 * 뷰포트 선택 핸들러 훅
 */
export const useViewportSelection = () => {
  const { 
    selectedViewport, 
    setSelectedViewport,
    getSelectedViewport
  } = useViewportStore();
  
  // 뷰포트 선택 핸들러
  const handleViewportSelect = (viewportId: 'left' | 'right') => {
    setSelectedViewport(viewportId);
  };
  
  return {
    selectedViewport,
    handleViewportSelect,
    getSelectedViewport
  };
};
