import React from 'react';
import { cn } from '../../utils/helpers';
import './StatsCard.css';

export default function StatsCard({ title, value, icon, color = 'primary', trend, onClick }) {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      className={cn('stats-card', `stats-card--${color}`, { 'stats-card--clickable': !!onClick })}
      onClick={onClick}
    >
      <div className="stats-card__content">
        <span className="stats-card__label">{title}</span>
        <span className="stats-card__value">{value}</span>
        {trend !== undefined && (
          <span className={cn('stats-card__trend', {
            'stats-card__trend--up': trend > 0,
            'stats-card__trend--down': trend < 0,
          })}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stats-card__icon">{icon}</div>
    </Wrapper>
  );
}
