import { create } from 'zustand';

// 뷰포트 타입 정의
type ViewportId = 'left' | 'right' | null;

interface ViewportState {
  // 상태
  selectedViewport: ViewportId;
  renderingEngine: any | null;
  viewport1: any | null;
  viewport2: any | null;
  
  // 뷰포트 DOM 참조
  viewport1Element: HTMLDivElement | null;
  viewport2Element: HTMLDivElement | null;
  
  // 액션
  setSelectedViewport: (viewportId: ViewportId) => void;
  setRenderingEngine: (engine: any) => void;
  setViewport1: (viewport: any) => void;
  setViewport2: (viewport: any) => void;
  setViewport1Element: (element: HTMLDivElement | null) => void;
  setViewport2Element: (element: HTMLDivElement | null) => void;
  
  // 선택된 뷰포트 가져오기
  getSelectedViewport: () => any | null;
}

export const useViewportStore = create<ViewportState>((set, get) => ({
  // 상태 초기값
  selectedViewport: null,
  renderingEngine: null,
  viewport1: null,
  viewport2: null,
  viewport1Element: null,
  viewport2Element: null,
  
  // 액션
  setSelectedViewport: (viewportId: ViewportId) => set({ selectedViewport: viewportId }),
  setRenderingEngine: (engine: any) => set({ renderingEngine: engine }),
  setViewport1: (viewport: any) => set({ viewport1: viewport }),
  setViewport2: (viewport: any) => set({ viewport2: viewport }),
  setViewport1Element: (element: HTMLDivElement | null) => set({ viewport1Element: element }),
  setViewport2Element: (element: HTMLDivElement | null) => set({ viewport2Element: element }),
  
  // 선택된 뷰포트 가져오기
  getSelectedViewport: () => {
    const { selectedViewport, viewport1, viewport2 } = get();
    if (selectedViewport === 'left') {
      return viewport1;
    } else if (selectedViewport === 'right') {
      return viewport2;
    }
    return null;
  },
}));
