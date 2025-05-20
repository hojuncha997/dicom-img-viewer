import * as cornerstoneDicomImageLoader from '@cornerstonejs/dicom-image-loader';
import { formatImageId } from './cornerstone';

// cornerstoneDicomImageLoader 타입이 제대로 정의되지 않아 any로 처리
const dicomLoader = cornerstoneDicomImageLoader as any;

/**
 * DICOM 이미지 로드 완료 핸들러
 */
export type ImageLoadedCallback = (imageId: string, image: any) => void;

/**
 * DICOM 이미지 로드
 * @param imageId 로드할 이미지 ID
 * @param onLoaded 이미지 로드 완료 콜백
 * @param onError 이미지 로드 오류 콜백
 */
export const loadDicomImage = (
  imageId: string,
  onLoaded?: ImageLoadedCallback,
  onError?: (error: Error) => void
): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!imageId) {
      const error = new Error('유효하지 않은 이미지 ID');
      if (onError) onError(error);
      reject(error);
      return;
    }
    
    dicomLoader.wadouri.loadImage(imageId)
      .then((image: any) => {
        if (onLoaded) onLoaded(imageId, image);
        resolve(image);
      })
      .catch((error: Error) => {
        console.error('DICOM 이미지 로드 오류:', error);
        if (onError) onError(error);
        reject(error);
      });
  });
};

/**
 * DICOM 이미지 선행 로드
 * 여러 이미지를 미리 로드하여 성능 개선
 */
export const preloadDicomImages = (imagePaths: string[]): void => {
  if (!imagePaths || imagePaths.length === 0) return;
  
  // 비동기적으로 모든 이미지 먼저 로드
  imagePaths.forEach(path => {
    const imageId = formatImageId(path);
    dicomLoader.wadouri.loadImage(imageId)
      .then(() => {
        // 이미지가 로드됨 (캐시에 저장됨)
        console.log(`이미지 선행 로드 완료: ${path}`);
      })
      .catch(() => {
        // 선행 로드 실패 - 로그만 찍고 무시
        console.warn(`이미지 선행 로드 실패: ${path}`);
      });
  });
};

/**
 * DICOM 이미지 캐시 정리
 */
export const purgeImageCache = (): void => {
  try {
    // cornerstone3D 캐시 정리 - 구현에 따라 변경될 수 있음
    if (dicomLoader.wadouri.fileManager && 
        dicomLoader.wadouri.fileManager.purge) {
      dicomLoader.wadouri.fileManager.purge();
      console.log('DICOM 이미지 캐시 정리 완료');
    }
  } catch (error) {
    console.error('DICOM 이미지 캐시 정리 중 오류 발생:', error);
  }
};
