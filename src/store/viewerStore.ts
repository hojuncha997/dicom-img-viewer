import { create } from 'zustand';

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
  
  // 이미지 쌍 개수 계산 (이미지 쌍은 1&2, 3&4 등)
  totalPairs: number;
  
  // 액션
  setCurrentPairIndex: (index: number) => void;
  goToPreviousPair: () => void;
  goToNextPair: () => void;
}

export const useViewerStore = create<ViewerState>((set, get) => ({
  // 상태 초기값
  currentPairIndex: 0,
  allImageIds,
  totalPairs: Math.floor(allImageIds.length / 2) + (allImageIds.length % 2 > 0 ? 1 : 0),
  
  // 액션
  setCurrentPairIndex: (index: number) => set({ currentPairIndex: index }),
  
  // 이전 이미지 쌍으로 이동
  goToPreviousPair: () => {
    const { currentPairIndex } = get();
    if (currentPairIndex > 0) {
      set({ currentPairIndex: currentPairIndex - 1 });
    }
  },
  
  // 다음 이미지 쌍으로 이동
  goToNextPair: () => {
    const { currentPairIndex, totalPairs } = get();
    if (currentPairIndex < totalPairs - 1) {
      set({ currentPairIndex: currentPairIndex + 1 });
    }
  },
}));

// 헬퍼 함수: 현재 이미지 쌍 인덱스에 해당하는 이미지 ID 가져오기
export const useViewerImages = () => {
  const { currentPairIndex, allImageIds } = useViewerStore();
  
  const leftImageIndex = currentPairIndex * 2;
  const rightImageIndex = leftImageIndex + 1;
  
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
