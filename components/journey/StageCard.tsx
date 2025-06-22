'use client';

import { useState } from 'react';
import StepItem, { type StepWithDetails } from './StepItem';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import type { Tables } from '@/lib/database.types';

type StageWithDetails = Tables<'stages'> & {
  steps: StepWithDetails[];
};

type StageCardProps = {
  stage: StageWithDetails;
  onStepSelect: (step: StepWithDetails) => void;
};

export default function StageCard({ stage, onStepSelect }: StageCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 bg-slate-800 rounded-lg border border-slate-700 shadow-lg overflow-hidden">
      <div
        className="flex items-center p-6 cursor-pointer hover:bg-slate-700/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-shrink-0 w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mr-4">
          <span className="text-xl font-bold text-primary">{stage.order_in_journey}</span>
        </div>
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-slate-100">{stage.title}</h2>
          <p className="text-slate-400">{stage.objective}</p>
        </div>
        {/* FIX: Using inline style for guaranteed sizing */}
        <ChevronDownIcon
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          style={{ width: '1.5rem', height: '1.5rem' }}
        />
      </div>

      {isOpen && (
        <div className="p-6 border-t border-slate-700">
          {stage.steps.map((step) => (
            <StepItem key={step.id} step={step} onSelect={onStepSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
