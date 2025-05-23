/**
 * Raplle Favicon Implementor
 * 
 * Этот скрипт помогает автоматизировать создание favicon из логотипа Raplle.
 * Он создает SVG версию логотипа, которую можно использовать для favicon.
 * 
 * Использование:
 * - Разместите этот скрипт в папке public
 * - Запустите в браузере или с помощью Node.js
 * - Скрипт генерирует SVG код, который можно использовать для favicon
 */

// Основные цвета бренда Raplle
const RAPLLE_PRIMARY = '#2672e3';
const RAPLLE_GRADIENT_START = '#2672e3';
const RAPLLE_GRADIENT_END = '#35bfed';

/**
 * Создает SVG-код логотипа Raplle для использования в качестве favicon
 * @param {number} size - Размер изображения
 * @returns {string} SVG-код логотипа Raplle
 */
function generateRaplleSVG(size = 512) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${RAPLLE_GRADIENT_START}"/>
      <stop offset="100%" stop-color="${RAPLLE_GRADIENT_END}"/>
    </linearGradient>
  </defs>
  <path fill="url(#gradient)" d="M143.5,96C113.7,96,90,119.7,90,149.5v213C90,392.3,113.7,416,143.5,416H226c11,0,20-9,20-20s-9-20-20-20h-82.5c-7.4,0-13.5-6.1-13.5-13.5v-213c0-7.4,6.1-13.5,13.5-13.5H290c60.1,0,108.9,48.8,108.9,108.9c0,60.1-48.8,108.9-108.9,108.9h-20.8c-2.3,0-4.4-1.3-5.4-3.3l-0.5-1.2c-2.1-4.7-0.7-10.2,3.5-13.2l26.2-20.2c1.1-0.9,2-2.3,2-3.8V216.8c0-2.4-1.7-4.7-4.1-5.2l-1.3-0.3c-1.9-0.4-3.7,0.1-5.2,1.3L179.2,290c-2.9,2.3-4.2,6.1-3.4,9.8l0.2,0.8c0.8,3.2,3.3,5.7,6.5,6.4l1.2,0.3c1.2,0.3,2.3,0.2,3.4-0.2v34.4c0,3.5,2.2,6.6,5.5,7.7l0.9,0.3c3,1,6.3,0.1,8.3-2.3L293.4,230c4.7-5.1,12.5-5.9,18.3-1.9l1.1,0.8c5.1,3.5,7.3,9.8,5.5,15.7l-0.3,1c-1.2,4-4.3,7.1-8.3,8.3l-92.4,28.5c-6,1.9-10.1,7.3-10.1,13.6v57.5c0,11,9,20,20,20h62.8c82.2,0,148.9-66.7,148.9-148.9c0-82.2-66.7-148.9-148.9-148.9H143.5z"/>
</svg>`;
}

/**
 * Обновляет метатеги HTML для поддержки favicon
 * @returns {string} HTML-код для добавления в секцию head
 */
function generateFaviconMetaTags() {
  return `
<!-- Favicon для Raplle -->
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="%PUBLIC_URL%/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="%PUBLIC_URL%/favicon-16x16.png">
<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
<meta name="theme-color" content="${RAPLLE_PRIMARY}">
`;
}

// Экспортируем функции для использования в Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateRaplleSVG,
    generateFaviconMetaTags,
    RAPLLE_PRIMARY,
    RAPLLE_GRADIENT_START,
    RAPLLE_GRADIENT_END
  };
}
