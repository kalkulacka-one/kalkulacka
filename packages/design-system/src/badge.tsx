import React from 'react';
import BadgeStarIcon from "./Badge/BadgeStarIcon"

export interface BadgeProps {
  icon?: boolean;
  variant?: 'neutral' | 'primary' | 'secondary';
  color: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ icon = false, variant = 'neutral', children }) => {
  const className = `badge ${variant}`
  const showIcon = icon || variant === 'primary';
  const neutralIcon = variant === 'neutral' || variant === 'primary';
  return (
    <div className={className} style = {{
      color: neutralIcon ? '#565252': '#821414',
      backgroundColor: "F8F7F7",
      height: showIcon ? '1.625rem' : '1.5rem',
      width: showIcon ? '4.5rem' : '3.125rem',
      borderRadius: '0.375rem',
      padding: '0.5rem 0.25rem 0.5rem 0.25rem',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.25rem',
      position: 'relative',
      margin: 0,
      fontWeight: 700,
      textTransform: 'uppercase',    

    }}>  
      {showIcon && <span className="badge-icon k1-inline-block k1-items-center" style={{ height: '1.125rem', width: '1.125rem' }}><BadgeStarIcon/></span>}
      <div style = {{
        display: 'flex',
        justifyContent: 'center',
        fontSize: '0.625rem',
        fontWeight: 700,
        lineHeight: '1.125rem',
        borderStyle: 'hidden',
        outline: 'none',
        width: '2.125rem',
        height: '1.125rem',
      }}>
        {children}
      </div>
    </div>
  );
};

export { Badge };



