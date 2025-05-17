declare module '@cornerstonejs/dicom-image-loader' {
  export const external: {
    cornerstone: any;
    dicomParser: any;
  };
  
  export const wadouri: {
    dicomImageLoader: {
      configure: (config: any) => void;
    };
    volumeLoader: any;
  };
} 