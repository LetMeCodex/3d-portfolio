import React from 'react';

// Corner SVG path (same for all 4 corners, rotated via CSS)
const CornerPath = () => (
  <svg
    className="acb-corner"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-1 1 32 32"
  >
    <path d="M32,32C14.355,32,0,17.645,0,0h.985c0,17.102,13.913,31.015,31.015,31.015v.985Z" />
  </svg>
);

type ButtonVariant = 'light' | 'dark' | 'solid-black';

interface AnimatedCornerButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  drawerTop?: string;
  drawerBottom?: string;
  variant?: ButtonVariant;
  className?: string;
  href?: string;
  download?: boolean;
  type?: 'button' | 'submit';
}

export function AnimatedCornerButton({
  onClick,
  children,
  drawerTop,
  drawerBottom,
  variant = 'light',
  className = '',
  href,
  download,
  type = 'button',
}: AnimatedCornerButtonProps) {
  const inner = (
    <>
      {drawerTop && <div className={`acb-drawer acb-top`}>{drawerTop}</div>}
      {drawerBottom && <div className={`acb-drawer acb-bottom`}>{drawerBottom}</div>}

      <button type={type} className="acb-btn" style={{ all: 'unset', cursor: 'pointer' }}>
        <span className="acb-text">{children}</span>
      </button>

      <CornerPath />
      <CornerPath />
      <CornerPath />
      <CornerPath />
    </>
  );

  const containerClass = `acb-container acb-${variant} ${className}`;

  if (href) {
    return (
      <a href={href} download={download} className={containerClass} onClick={onClick}>
        {inner}
      </a>
    );
  }

  return (
    <div className={containerClass} onClick={onClick}>
      {inner}
    </div>
  );
}
