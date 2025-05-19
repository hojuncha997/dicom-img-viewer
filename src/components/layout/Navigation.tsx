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
    <nav className="bg-white shadow-md py-2">
      <Container maxWidth="1440px">
        <div className="flex items-center h-10">
          {/* 타이틀 영역 */}
          <div className="mr-8">
            <span className="text-base font-medium">Dicom Viewer(with Cornerstone.js)</span>
          </div>
          
          {/* 중앙 기능 버튼 영역 */}
          <div className="flex items-center space-x-4 flex-grow">
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
              className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Previous Image
            </button>
            <button
              onClick={onNextImage}
              className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next Image
            </button>
          </div>
        </div>
      </Container>
    </nav>
  );
}

export default Navigation; 