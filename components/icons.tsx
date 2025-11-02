import React from 'react';

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z"
      clipRule="evenodd"
    />
  </svg>
);

export const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
    </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.347-9zm5.48.058a.75.75 0 10-1.499-.058l-.347 9a.75.75 0 001.5.058l.347-9z"
      clipRule="evenodd"
    />
  </svg>
);

export const ExportIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

export const RocketIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M13.738 2.206c.343-.343.836-.453 1.282-.313l5.42 1.688a.75.75 0 01.56 1.118l-3.974 5.49a.75.75 0 01-1.118-.56l-1.688-5.42a.75.75 0 01.313-1.282zM3.863 10.02a.75.75 0 01.56-1.118l5.42-1.688c.446-.14.939.03 1.282.313a.75.75 0 01-.313 1.282l-5.42 1.688a.75.75 0 01-1.118-.56z" />
    <path fillRule="evenodd" d="M11.488 11.488a.75.75 0 011.024 1.024l-1.33 1.331a3.75 3.75 0 105.304 5.304l1.33-1.33a.75.75 0 111.024 1.024l-1.331 1.33a5.25 5.25 0 11-7.424-7.424l1.33-1.331zM4.22 17.25a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-.01zM5.25 19.5a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75v-.01a.75.75 0 00-.75-.75h-.01zM7.5 18.75a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-.01z" clipRule="evenodd" />
  </svg>
);

export const EuclideanIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="4" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="20" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="18.36" cy="18.36" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="5.64" cy="5.64" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
      <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.78.72 2.182 1.587l.295.688a3.375 3.375 0 012.28 2.28l.688.295c.867.403 1.535 1.215 1.587 2.182-.002.028-.004.055-.006.082a49.499 49.499 0 010 5.312c-.052.967-.72 1.78-1.587 2.182l-.688.295a3.375 3.375 0 01-2.28 2.28l-.295.688c-.403.867-1.215 1.535-2.182 1.587a49.501 49.501 0 01-5.312 0c-.967-.052-1.78-.72-2.182-1.587l-.295-.688a3.375 3.375 0 01-2.28-2.28l-.688-.295c-.867-.403-1.535-1.215-1.587-2.182a49.498 49.498 0 010-5.312c.052-.967.72-1.78 1.587-2.182l.688-.295a3.375 3.375 0 012.28-2.28l.295-.688c.403-.867 1.215 1.535 2.182-1.587zM10.5 12.75a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
    </svg>
);
