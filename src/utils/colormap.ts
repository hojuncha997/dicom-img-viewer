import * as cornerstone3D from '@cornerstonejs/core';

// 컬러맵 프리셋 타입 정의
export interface ColormapPoint {
  x: number;
  r: number;
  g: number;
  b: number;
}

export interface ColormapPreset {
  hueRange: [number, number];
  saturationRange: [number, number];
  valueRange: [number, number];
  rgbPoints: ColormapPoint[];
}

// 컬러맵 프리셋 정의
export const colormapPresets: Record<string, ColormapPreset> = {
  jet: {
    hueRange: [0, 0.667], // 파란색에서 빨간색
    saturationRange: [1, 1],
    valueRange: [1, 1],
    rgbPoints: [
      { x: 0.0, r: 0, g: 0, b: 0.5 },
      { x: 0.25, r: 0, g: 0.5, b: 1 },
      { x: 0.5, r: 0, g: 1, b: 0.5 },
      { x: 0.75, r: 1, g: 0.5, b: 0 },
      { x: 1.0, r: 0.5, g: 0, b: 0 }
    ]
  },
  hot: {
    hueRange: [0, 0.1], // 빨간색에서 노란색
    saturationRange: [0.8, 0.8],
    valueRange: [0.3, 1],
    rgbPoints: [
      { x: 0.0, r: 0, g: 0, b: 0 },
      { x: 0.33, r: 1, g: 0, b: 0 },
      { x: 0.66, r: 1, g: 1, b: 0 },
      { x: 1.0, r: 1, g: 1, b: 1 }
    ]
  },
  plasma: {
    hueRange: [0.7, 0], // 보라색에서 노란색
    saturationRange: [0.8, 0.8],
    valueRange: [0.6, 1],
    rgbPoints: [
      { x: 0.0, r: 0.05, g: 0.03, b: 0.5 },
      { x: 0.25, r: 0.4, g: 0, b: 0.6 },
      { x: 0.5, r: 0.6, g: 0.15, b: 0.5 },
      { x: 0.75, r: 0.9, g: 0.4, b: 0.2 },
      { x: 1.0, r: 1, g: 0.9, b: 0.1 }
    ]
  },
  viridis: {
    hueRange: [0.7, 0.35], // 보라색에서 녹색/노란색
    saturationRange: [0.8, 0.7],
    valueRange: [0.6, 1],
    rgbPoints: [
      { x: 0.0, r: 0.267, g: 0.004, b: 0.329 },
      { x: 0.25, r: 0.255, g: 0.255, b: 0.478 },
      { x: 0.5, r: 0.164, g: 0.517, b: 0.431 },
      { x: 0.75, r: 0.474, g: 0.764, b: 0.176 },
      { x: 1.0, r: 0.988, g: 0.992, b: 0.019 }
    ]
  },
  magma: {
    hueRange: [0.8, 0], // 보라색에서 노란색
    saturationRange: [0.8, 0.6],
    valueRange: [0.2, 1],
    rgbPoints: [
      { x: 0.0, r: 0, g: 0, b: 0 },
      { x: 0.25, r: 0.3, g: 0.05, b: 0.4 },
      { x: 0.5, r: 0.8, g: 0.1, b: 0.4 },
      { x: 0.75, r: 0.95, g: 0.45, b: 0.3 },
      { x: 1.0, r: 1, g: 1, b: 0.6 }
    ]
  },
  turbo: {
    hueRange: [0.85, 0], // 보라색에서 빨간색
    saturationRange: [0.8, 0.8],
    valueRange: [0.7, 0.9],
    rgbPoints: [
      { x: 0.0, r: 0.18, g: 0.0, b: 0.36 },
      { x: 0.2, r: 0.0, g: 0.36, b: 0.9 },
      { x: 0.4, r: 0.0, g: 0.73, b: 0.53 },
      { x: 0.6, r: 0.67, g: 0.85, b: 0.0 },
      { x: 0.8, r: 0.97, g: 0.46, b: 0.0 },
      { x: 1.0, r: 0.4, g: 0.0, b: 0.0 }
    ]
  },
  temperature: {
    hueRange: [0.7, 0], // 파란색에서 빨간색 (온도 스타일)
    saturationRange: [0.9, 0.9],
    valueRange: [0.5, 1],
    rgbPoints: [
      { x: 0.0, r: 0, g: 0, b: 1 },
      { x: 0.5, r: 1, g: 1, b: 1 },
      { x: 1.0, r: 1, g: 0, b: 0 }
    ]
  },
  perfusion: {
    hueRange: [0.4, 0], // 녹색에서 빨간색
    saturationRange: [0.8, 0.9],
    valueRange: [0.6, 0.9],
    rgbPoints: [
      { x: 0.0, r: 0, g: 0.8, b: 0 },
      { x: 0.5, r: 0.8, g: 0.8, b: 0 },
      { x: 1.0, r: 0.8, g: 0, b: 0 }
    ]
  }
};

/**
 * 지정된 이름의 컬러맵 프리셋 가져오기
 */
export const getColormapPreset = (name: string): ColormapPreset => {
  return colormapPresets[name] || colormapPresets.jet;
};

/**
 * HSV 기반 설정으로 RGB 포인트 생성
 */
export const generateRGBPoints = (preset: ColormapPreset, pointCount: number = 10): ColormapPoint[] => {
  const points: ColormapPoint[] = [];
  const hueStart = preset.hueRange[0];
  const hueEnd = preset.hueRange[1];
  const satStart = preset.saturationRange[0];
  const satEnd = preset.saturationRange[1];
  const valStart = preset.valueRange[0];
  const valEnd = preset.valueRange[1];
  
  for (let i = 0; i < pointCount; i++) {
    const t = i / (pointCount - 1);
    const h = hueStart + (hueEnd - hueStart) * t;
    const s = satStart + (satEnd - satStart) * t;
    const v = valStart + (valEnd - valStart) * t;
    
    // 간단한 HSV -> RGB 변환
    let r, g, b;
    const hi = Math.floor(h * 6) % 6;
    const f = h * 6 - hi;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t2 = v * (1 - (1 - f) * s);
    
    switch (hi) {
      case 0: r = v; g = t2; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t2; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t2; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
      default: r = v; g = t2; b = p;
    }
    
    points.push({
      x: t,
      r: r,
      g: g,
      b: b
    });
  }
  
  return points;
};

/**
 * cornerstone3D 컬러맵 설정
 */
export const registerColormaps = (): void => {
  try {
    // 각 프리셋에 대해
    Object.keys(colormapPresets).forEach(name => {
      const preset = colormapPresets[name];
      
      // RGB 포인트를 Cornerstone 형식으로 변환
      const rgbPoints: number[] = [];
      preset.rgbPoints.forEach(point => {
        rgbPoints.push(point.x);
        rgbPoints.push(point.r);
        rgbPoints.push(point.g);
        rgbPoints.push(point.b);
      });
      
      // 새 컬러맵 등록
      const colormap = {
        Name: name,
        ColorSpace: 'RGB',
        RGBPoints: rgbPoints
      };
      
      cornerstone3D.utilities.colormap.registerColormap(colormap);
    });
    
    console.log('컬러맵 등록 완료');
  } catch (error) {
    console.error('컬러맵 등록 중 오류 발생:', error);
  }
};

/**
 * 특정 뷰포트와 액터에 컬러맵 적용하기
 */
export const applyColormapToViewport = (
  viewport: any,
  colormapName: string | null
): boolean => {
  try {
    // 액터 가져오기
    const actor = viewport.getDefaultActor();
    if (!actor || !actor.actor) {
      console.error('액터를 찾을 수 없습니다.');
      return false;
    }
    
    // 액터의 속성 가져오기
    const vtkProperty = actor.actor.getProperty();
    if (!vtkProperty) {
      console.error('VTK 속성을 찾을 수 없습니다.');
      return false;
    }
    
    if (!colormapName) {
      // 컬러맵 제거 (그레이스케일로 복원)
      vtkProperty.setUseLookupTableScalarRange(false);
      vtkProperty.modified();
      actor.actor.modified();
      viewport.render();
      return true;
    }
    
    // 1. 현재 이미지 데이터 범위 확인
    let dataRange = [0, 4095]; // 기본값
    try {
      const imageData = viewport.getDefaultImageData();
      if (imageData) {
        const scalars = imageData.getPointData().getScalars();
        dataRange = scalars.getRange();
      }
    } catch (rangeError) {
      console.error('이미지 데이터 범위 확인 오류:', rangeError);
    }
    
    // 2. 컬러맵 로드
    let colormapData;
    try {
      colormapData = cornerstone3D.utilities.colormap.getColormap(colormapName);
    } catch (error) {
      console.error('컬러맵 로드 오류:', error);
      return false;
    }
    
    if (!colormapData) {
      console.error('컬러맵 데이터를 가져올 수 없습니다.');
      return false;
    }
    
    // 3. 색상 전송 함수 가져오기
    let colorTransferFunction = null;
    if (vtkProperty.getLookupTable) {
      colorTransferFunction = vtkProperty.getLookupTable();
    } else if (vtkProperty.getRGBTransferFunction) {
      colorTransferFunction = vtkProperty.getRGBTransferFunction(0);
    }
    
    if (!colorTransferFunction) {
      console.error('색상 전송 함수를 가져올 수 없습니다.');
      return false;
    }
    
    // 4. 컬러맵 적용
    colorTransferFunction.removeAllPoints();
    
    const min = dataRange[0];
    const max = dataRange[1];
    const range = max - min;
    
    // RGBPoints 배열에서 포인트 추가 (형식: [x1, r1, g1, b1, x2, r2, g2, b2, ...])
    for (let i = 0; i < colormapData.RGBPoints.length; i += 4) {
      const x = colormapData.RGBPoints[i];
      const r = colormapData.RGBPoints[i + 1];
      const g = colormapData.RGBPoints[i + 2];
      const b = colormapData.RGBPoints[i + 3];
      
      const value = min + (x * range); // 0-1 범위를 실제 데이터 범위로 변환
      colorTransferFunction.addRGBPoint(value, r, g, b);
    }
    
    // 변경 알림
    colorTransferFunction.modified();
    
    // 룩업 테이블 사용 활성화
    vtkProperty.setUseLookupTableScalarRange(true);
    vtkProperty.modified();
    actor.actor.modified();
    
    // 렌더링
    viewport.render();
    
    return true;
  } catch (error) {
    console.error('컬러맵 적용 중 오류 발생:', error);
    return false;
  }
};
