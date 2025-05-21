import React from 'react';
import Container from './Container';
import ControlButton from './ControlButton';
import NavigationButton from './NavigationButton';

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
        <div className="flex items-center h-full" style={{ padding: '16px 40px 16px 30px', justifyContent: 'space-between', gap: '48px' }}>
          {/* 타이틀 영역 */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <span style={{ 
              width: '314px', 
              height: '22px', 
              fontFamily: 'Roboto', 
              fontWeight: 700, 
              fontSize: '20px', 
              lineHeight: '110%', 
              letterSpacing: '0%',
              color: '#697077'
            }}>Dicom Viewer(with Cornerstone.js)</span>
          </div>
          
          {/* 버튼 영역 통합 컨테이너 */}
          <div style={{ width: '1014px', height: '48px', gap: '24px', display: 'flex', alignItems: 'center', boxSizing: 'content-box' }}>
            {/* 중앙 기능 이미지 조작 버튼 영역 */}
            <div className="flex items-center flex-grow justify-center" style={{ width: '649px', height: '40px', gap: '16px', color: '#21272A' }}>
              <ControlButton text="Zoom" onClick={onZoom} disabled={disableControls} />
              <ControlButton text="Flip H" onClick={onFlipH} disabled={disableControls} />
              <ControlButton text="Flip V" onClick={onFlipV} disabled={disableControls} />
              <ControlButton text="Rotate Delta 30" onClick={onRotate} disabled={disableControls} />
              <ControlButton text="Invert" onClick={onInvert} disabled={disableControls} />
              <ControlButton text="Apply Colormap" onClick={onColormap} disabled={disableControls} />
              <ControlButton text="Reset" onClick={onReset} disabled={disableControls} />
            </div>
            
            {/* 오른쪽 이미지 이동 버튼 영역 */}
            <div className="flex items-center" style={{ gap: '16px' }}>
              <NavigationButton 
                text="Previous Image" 
                onClick={onPrevImage} 
                width="174px" 
              />
              <NavigationButton 
                text="Next Image" 
                onClick={onNextImage} 
                width="143px" 
              />
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
}

export default Navigation; 