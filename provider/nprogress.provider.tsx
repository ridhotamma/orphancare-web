'use client';

import React from 'react';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const NProgressProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar
        height='4px'
        color='red'
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default NProgressProvider;
