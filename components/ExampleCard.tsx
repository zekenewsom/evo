// components/ExampleCard.tsx
import React from 'react';

export default function ExampleCard() {
  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Welcome to DaisyUI!</h2>
        <p className="text-base-content/70">This card uses DaisyUI and Tailwind best practices.</p>
        <input className="input input-bordered w-full" placeholder="Type here..." />
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );
}
