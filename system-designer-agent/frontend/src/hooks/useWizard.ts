import { useState, useCallback } from 'react';
import type { Step } from '@/types';

interface UseWizardReturn {
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  goToNext: () => void;
  goToPrevious: () => void;
}

export function useWizard(steps: Step[]): UseWizardReturn {
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  const goToNext = useCallback(() => {
    if (!isLastStep) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  }, [isLastStep]);

  const goToPrevious = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  }, [isFirstStep]);

  return {
    currentStep,
    isFirstStep,
    isLastStep,
    progress,
    goToNext,
    goToPrevious,
  };
}
