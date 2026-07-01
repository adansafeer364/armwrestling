'use client';

import React, { useState } from 'react';
import SplashScreen from './SplashScreen';

/** Welcome animation shown when the site opens. */
export default function IntroSplash() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  // Change this text anytime:
  return (
    <SplashScreen
      text="Welcome to Arm Fights"
      onDone={() => setShow(false)}
    />
  );
}
