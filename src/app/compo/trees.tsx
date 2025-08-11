/* eslint-disable @next/next/no-img-element */
// components/GrowTreesDoor.tsx
'use client';

import { useState } from 'react';

export default function GrowTreesDoor() {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="md:fixed md:left-2 md:top-1/2 md:-translate-y-1/2 md:z-50 sm:relative">
      <button
        onClick={() => setShowMessage(true)}
        className=" text-white text-xl p-3 rounded-r-xl shadow-md hover:bg-green-700 transition"
        aria-label="Open Grow Tree Message"
      > 
        <img className='' src="./tree.svg" alt='tree' width={30} height={30} />
      </button>

      {showMessage && (
        <div
          onClick={() => setShowMessage(false)}
          className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white border border-green-400 text-green-800 text-sm px-4 py-2 rounded-lg shadow-lg cursor-pointer"
        >
          🌱 Let&lsquo;s grow trees!
        </div>
      )}
    </div>
  );
}
