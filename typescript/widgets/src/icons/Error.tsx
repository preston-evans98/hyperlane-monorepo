import React, { memo } from 'react';

import { ColorPalette } from '../color.js';

import { DefaultIconProps } from './types.js';

function _Error({ color, ...rest }: DefaultIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...rest}>
      <path
        fill={color || ColorPalette.Black}
        d="M24 34q.7 0 1.18-.47.47-.48.47-1.18t-.47-1.18q-.48-.47-1.18-.47t-1.18.47q-.47.48-.47 1.18t.47 1.18Q23.3 34 24 34Zm.15-7.65q.65 0 1.07-.42.43-.43.43-1.08V15.2q0-.65-.42-1.07-.43-.43-1.08-.43-.65 0-1.07.42-.43.43-.43 1.08v9.65q0 .65.42 1.07.43.43 1.08.43ZM24 44q-4.1 0-7.75-1.57-3.65-1.58-6.38-4.3-2.72-2.73-4.3-6.38Q4 28.1 4 23.95q0-4.1 1.57-7.75 1.58-3.65 4.3-6.35 2.73-2.7 6.38-4.28Q19.9 4 24.05 4q4.1 0 7.75 1.57 3.65 1.58 6.35 4.28 2.7 2.7 4.28 6.35Q44 19.85 44 24q0 4.1-1.57 7.75-1.58 3.65-4.28 6.38t-6.35 4.3Q28.15 44 24 44Zm.05-3q7.05 0 12-4.97T41 23.95q0-7.05-4.95-12T24 7q-7.05 0-12.03 4.95Q7 16.9 7 24q0 7.05 4.97 12.03Q16.95 41 24.05 41ZM24 24Z"
      />
    </svg>
  );
}

export const ErrorIcon = memo(_Error);
