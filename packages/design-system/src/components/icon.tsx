import { type VariantProps, cva } from 'class-variance-authority';
import React from 'react';
import type { IconType } from '../types/icon-types';
import * as Icons from './icons';

const iconStyles = cva('', {
  variants: {
    size: {
      small: 'ko:size-4',
      medium: 'ko:size-6',
      large: 'ko:size-8',
      extraLarge: 'ko:size-10',
      extraHuge: 'ko:size-14',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

type IconProps = {
  name: IconType;
  color?: string;
} & VariantProps<typeof iconStyles>;

export function Icon({ name, size, color, ...props }: IconProps) {
  const className = iconStyles({ size });
  const IconComponent = React.createElement(Icons[name], { ...props, className, style: { color } });
  return IconComponent;
}
