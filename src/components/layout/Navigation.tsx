import React from 'react';
import Container from './Container';

interface NavigationProps {
  onNextImage?: () => void;
  onPrevImage?: () => void;
  onZoom?: () => void;
  onFlipH?: () => void;
  onFlipV?: () => void;
  onRotate?: () => void;
  onInvert?: () => void;
  onColormap?: () => void;
  onReset?: () => void;
  disableControls?: boolean;
}

function Navigation({ 
  onNextImage, 
  onPrevImage, 
  onZoom,
  onFlipH,
  onFlipV,
  onRotate,
  onInvert,
  onColormap,
  onReset,
  disableControls = false
}: NavigationProps) {
  return (
    <nav className="bg-white shadow-md" style={{ height: '116px', display: 'flex', alignItems: 'center', borderBottom: '5px solid #0F62FE' }}>
      <Container maxWidth="1440px">
        <div className="flex items-center h-full" style={{ padding: '0px 40px 0px 30px', justifyContent: 'space-between' }}>
          {/* 타이틀 영역 */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <span className="text-base font-medium" style={{ width: '314px', height: '22px' }}>Dicom Viewer(with Cornerstone.js)</span>
          </div>
          
          {/* 버튼 영역 통합 컨테이너 */}
          <div style={{ width: '1014px', height: '48px', gap: '24px', display: 'flex', alignItems: 'center' }}>
            {/* 중앙 기능 버튼 영역 */}
            <div className="flex items-center flex-grow justify-center" style={{ width: '649px', height: '40px', gap: '16px' }}>
              <button 
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onZoom}
                disabled={disableControls}
              >
                Zoom
              </button>
              <button 
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onFlipH}
                disabled={disableControls}
              >
                Flip H
              </button>
              <button 
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onFlipV}
                disabled={disableControls}
              >
                Flip V
              </button>
              <button 
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onRotate}
                disabled={disableControls}
              >
                Rotate Delta 30
              </button>
              <button 
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onInvert}
                disabled={disableControls}
              >
                Invert
              </button>
              <button 
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onColormap}
                disabled={disableControls}
              >
                Apply Colormap
              </button>
              <button 
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onReset}
                disabled={disableControls}
              >
                Reset
              </button>
            </div>
            
            {/* 오른쪽 이미지 이동 버튼 영역 */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onPrevImage}
                className="text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{ 
                  width: '174px', 
                  height: '48px', 
                  paddingTop: '16px', 
                  paddingRight: '12px', 
                  paddingBottom: '16px', 
                  paddingLeft: '12px', 
                  borderWidth: '2px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                Previous Image
              </button>
              <button
                onClick={onNextImage}
                className="text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{ 
                  width: '143px', 
                  height: '48px', 
                  paddingTop: '16px', 
                  paddingRight: '12px', 
                  paddingBottom: '16px', 
                  paddingLeft: '12px', 
                  borderWidth: '2px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                Next Image
              </button>
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
}

export default Navigation; 