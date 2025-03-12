// hooks/useSetMobileViewport.js
import { useEffect } from 'react';

export const useSetMobileViewport = () => {
  const setMobileViewport = () => {
    if (window.innerWidth > 360) {
      const scale = window.innerWidth / 360;
      const viewport = document.querySelector('meta[name="viewport"]');
      viewport&&viewport.setAttribute(
        'content',
        `width=360, height=800, initial-scale=${1/scale}, maximum-scale=${1/scale}, user-scalable=no`
      );
      
      // vh를 사용하는 모든 요소의 스타일을 재정의
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        [style*="vh"] {
          height: ${800}px !important;
        }
      `;
      document.head.appendChild(styleSheet);
      
      document.body.style.margin = '0 auto';
      document.body.style.maxWidth = '360px';
    }
  };

  useEffect(() => {
    setMobileViewport();
    window.addEventListener('resize', setMobileViewport);

    return () => {
      window.removeEventListener('resize', setMobileViewport);
    };
  }, []);
};