import * as React from 'react';

export function OrangeAccentLine({ width = '40px' }: { width?: string }) {
  return <div style={{ width, height: '3px', backgroundColor: '#ff5901' }} />;
}
