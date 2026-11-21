import React from 'react';

const Badge = ({
  children,
  variant = 'primary', // primary | success | warning | danger | info | neutral
  icon: Icon,
  className = ''
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

export default Badge;
