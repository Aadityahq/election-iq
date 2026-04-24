import React from 'react';

const iconPaths = {
  home: 'M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8.5Z',
  chat: 'M21 12c0 3.314-3.134 6-7 6a8.4 8.4 0 0 1-2.5-.37L6 19l1.43-3.57A5.77 5.77 0 0 1 3 12c0-3.314 3.134-6 7-6s11 2.686 11 6Z',
  timeline: 'M4 6h16M7 12h10M10 18h4',
  quiz: 'M9.75 9.75A2.25 2.25 0 1 1 12 12v2m0 4h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z',
  map: 'M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Zm0 0V6m6 15V6',
  settings: 'M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm8.25 3.75-.99.57a1 1 0 0 0-.37 1.37l.18.31a1 1 0 0 1-.36 1.36l-1.02.59a1 1 0 0 1-1.2-.14l-.25-.25a1 1 0 0 0-1.41 0l-.22.22a1 1 0 0 1-1.36.07l-.6-.45a1 1 0 0 1-.35-1.14l.14-.39a1 1 0 0 0-.64-1.27l-.37-.11a1 1 0 0 1-.67-1.16l.19-.95a1 1 0 0 1 1.01-.79h.58a1 1 0 0 0 .93-.64l.12-.31a1 1 0 0 1 1.2-.59l.88.25a1 1 0 0 0 1-.28l.2-.2a1 1 0 0 1 1.42 0l.7.7a1 1 0 0 0 1.13.2l.43-.2a1 1 0 0 1 1.34.43l.47.87a1 1 0 0 1-.18 1.18Z',
  registration: 'M8 3.75h8A1.75 1.75 0 0 1 17.75 5.5v13A1.75 1.75 0 0 1 16 20.25H8A1.75 1.75 0 0 1 6.25 18.5v-13A1.75 1.75 0 0 1 8 3.75Z M9 7.5h6M9 11h6M9 14.5h4',
  voting: 'M5 12l4 4 10-10M12 3.75A8.25 8.25 0 1 0 20.25 12 8.25 8.25 0 0 0 12 3.75Z',
  counting: 'M4 17h16M6 13h3v4H6zm5-5h3v9h-3zm5-3h3v12h-3z',
  results: 'M4.5 18.5h15M6 18.5V10m4.5 8.5V6m4.5 12.5V12m4.5 6.5V8.5',
  campaign: 'M4 19h16M7 17V9m5 8V5m5 12V11M3.5 19.5l17-17',
  nomination: 'M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0Zm-3 13a7 7 0 1 1 14 0',
  voteCounting: 'M4 17h16M6 13h3v4H6zm5-5h3v9h-3zm5-3h3v12h-3z',
  polling: 'M12 21s6-5.686 6-11.25A6 6 0 0 0 6 9.75C6 15.314 12 21 12 21Z M12 10.5A1.5 1.5 0 1 1 12 7.5a1.5 1.5 0 0 1 0 3Z',
  voice: 'M12 15.75a3.75 3.75 0 0 0 3.75-3.75V7.5a3.75 3.75 0 0 0-7.5 0V12A3.75 3.75 0 0 0 12 15.75Zm-6 0a6 6 0 0 0 12 0M12 21v-3.75',
  arrowRight: 'M5 12h13m-5-5 5 5-5 5',
  sparkle: 'M12 3.5l1.5 4.5L18 9.5l-4.5 1.5L12 15.5l-1.5-4.5L6 9.5l4.5-1.5L12 3.5Z',
  shield: 'M12 3l7 3v5.5c0 4.6-3 8.9-7 10.5-4-1.6-7-5.9-7-10.5V6l7-3Z',
  leaf: 'M18 6c-7.5.5-12 5.5-12 11.5 0 1.4.3 2.7.8 3.9 1.2.2 2.5.1 3.9-.3C16.7 19.6 20 15.5 20 10.3V6.5c0-.3-.2-.5-.5-.5H18Z',
};

function UiIcon({ name, title, size = 20, className = '' }) {
  const path = iconPaths[name];

  if (!path) return null;

  return (
    <svg
      className={`ui-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? 'false' : 'true'}
      role={title ? 'img' : 'presentation'}
    >
      {title ? <title>{title}</title> : null}
      <path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default UiIcon;