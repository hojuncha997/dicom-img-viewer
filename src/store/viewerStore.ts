import { create } from 'zustand';
import { useViewportStore } from './viewportStore';

// 전체 이미지 ID 목록 정의
const allImageIds = [
  '/dicom/image-000001.dcm',
  '/dicom/image-000050.dcm',
  '/dicom/image-000100.dcm',
  '/dicom/image-000161.dcm',
  '/dicom/image-000200.dcm',
  '/dicom/image-000261.dcm',
  '/dicom/image-000300.dcm',
];

interface ViewerState {
  // 상태
  currentPairIndex: number;
  allImageIds: string[];
  leftImageIndex: number;
  rightImageIndex: number;
  
  // 이미지 쌍 개수 계산 (이미지 쌍은 1&2, 3&4 등)
  totalPairs: number;
  
  // 액션
  setCurrentPairIndex: (index: number) => void;
  goToPreviousPair: () => void;
  goToNextPair: () => void;
  goToPreviousImage: () => void;
  goToNextImage: () => void;
}

export const useViewerStore = create<ViewerState>((set, get) => ({
  // 상태 초기값
  currentPairIndex: 0,
  allImageIds,
  leftImageIndex: 0,
  rightImageIndex: 1,
  totalPairs: Math.floor(allImageIds.length / 2) + (allImageIds.length % 2 > 0 ? 1 : 0),
  
  // 액션
  setCurrentPairIndex: (index: number) => set({ 
    currentPairIndex: index,
    leftImageIndex: index * 2,
    rightImageIndex: index * 2 + 1
  }),
  
  // 이전 이미지 쌍으로 이동
  goToPreviousPair: () => {
    const { currentPairIndex } = get();
    if (currentPairIndex > 0) {
      set({ 
        currentPairIndex: currentPairIndex - 1,
        leftImageIndex: (currentPairIndex - 1) * 2,
        rightImageIndex: (currentPairIndex - 1) * 2 + 1
      });
    }
  },
  
  // 다음 이미지 쌍으로 이동
  goToNextPair: () => {
    const { currentPairIndex, totalPairs } = get();
    if (currentPairIndex < totalPairs - 1) {
      set({ 
        currentPairIndex: currentPairIndex + 1,
        leftImageIndex: (currentPairIndex + 1) * 2,
        rightImageIndex: (currentPairIndex + 1) * 2 + 1
      });
    }
  },
  
  // 선택된 뷰포트의 이전 이미지로 이동
  goToPreviousImage: () => {
    const store = get();
    const { selectedViewport } = useViewportStore.getState();
    
    // 선택된 뷰포트에 따라 적절한 인덱스 업데이트
    if (selectedViewport === 'left') {
      const newIndex = Math.max(0, store.leftImageIndex - 1);
      set({ leftImageIndex: newIndex });
    } else if (selectedViewport === 'right') {
      const newIndex = Math.max(0, store.rightImageIndex - 1);
      set({ rightImageIndex: newIndex });
    }
  },
  
  // 선택된 뷰포트의 다음 이미지로 이동
  goToNextImage: () => {
    const store = get();
    const { selectedViewport } = useViewportStore.getState();
    const maxIndex = store.allImageIds.length - 1;
    
    // 선택된 뷰포트에 따라 적절한 인덱스 업데이트
    if (selectedViewport === 'left') {
      const newIndex = Math.min(maxIndex, store.leftImageIndex + 1);
      set({ leftImageIndex: newIndex });
    } else if (selectedViewport === 'right') {
      const newIndex = Math.min(maxIndex, store.rightImageIndex + 1);
      set({ rightImageIndex: newIndex });
    }
  },
}));

// 헬퍼 함수: 현재 이미지 인덱스에 해당하는 이미지 ID 가져오기
export const useViewerImages = () => {
  const { leftImageIndex, rightImageIndex, allImageIds } = useViewerStore();
  
  const leftImageId = leftImageIndex < allImageIds.length 
    ? allImageIds[leftImageIndex] 
    : null;
    
  const rightImageId = rightImageIndex < allImageIds.length 
    ? allImageIds[rightImageIndex] 
    : null;
    
  const leftImageName = leftImageId?.split('/').pop() || '';
  const rightImageName = rightImageId?.split('/').pop() || '';
  
  return {
    leftImageId,
    rightImageId,
    leftImageName,
    rightImageName,
    hasLeftImage: leftImageId !== null,
    hasRightImage: rightImageId !== null,
  };
};
