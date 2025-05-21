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
              <button 
                className="rounded-md"
                onClick={onZoom}
                disabled={disableControls}
                style={{
                  padding: '12px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{
                  fontFamily: 'Roboto',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#21272A'
                }}>
                  Zoom
                </span>
              </button>
              <button 
                className="rounded-md"
                onClick={onFlipH}
                disabled={disableControls}
                style={{
                  padding: '12px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{
                  fontFamily: 'Roboto',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#21272A'
                }}>
                  Flip H
                </span>
              </button>
              <button 
                className="rounded-md"
                onClick={onFlipV}
                disabled={disableControls}
                style={{
                  padding: '12px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{
                  fontFamily: 'Roboto',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#21272A'
                }}>
                  Flip V
                </span>
              </button>
              <button 
                className="rounded-md"
                onClick={onRotate}
                disabled={disableControls}
                style={{
                  padding: '12px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{
                  fontFamily: 'Roboto',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#21272A'
                }}>
                  Rotate Delta 30
                </span>
              </button>
              <button 
                className="rounded-md"
                onClick={onInvert}
                disabled={disableControls}
                style={{
                  padding: '12px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{
                  fontFamily: 'Roboto',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#21272A'
                }}>
                  Invert
                </span>
              </button>
              <button 
                className="rounded-md"
                onClick={onColormap}
                disabled={disableControls}
                style={{
                  padding: '12px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{
                  fontFamily: 'Roboto',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#21272A'
                }}>
                  Apply Colormap
                </span>
              </button>
              <button 
                className="rounded-md"
                onClick={onReset}
                disabled={disableControls}
                style={{
                  padding: '12px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{
                  fontFamily: 'Roboto',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#21272A'
                }}>
                  Reset
                </span>
              </button>
            </div>
            
            {/* 오른쪽 이미지 이동 버튼 영역 */}
            <div className="flex items-center" style={{ gap: '16px' }}>
              <button
                onClick={onPrevImage}
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                style={{ 
                  width: '174px', 
                  height: '48px', 
                  paddingTop: '16px', 
                  paddingRight: '12px', 
                  paddingBottom: '16px', 
                  paddingLeft: '12px', 
                  // borderWidth: '2px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                Previous Image
              </button>
              <button
                onClick={onNextImage}
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                style={{ 
                  width: '143px', 
                  height: '48px', 
                  paddingTop: '16px', 
                  paddingRight: '12px', 
                  paddingBottom: '16px', 
                  paddingLeft: '12px', 
                  // borderWidth: '2px',
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