import React, { useState } from "react";
import StepName from "../Steps/StepName/StepName";
import StepAvatar from "../Steps/StepAvatar/StepAvatar";

const Activate = () => {
  const [step, setStep] = useState(1);

  const steps: Record<number, React.ComponentType<{ onNext: () => void }>> = {
    1: StepName,
    2: StepAvatar,
  };

  const onNext = (): void => {
    setStep((step) => step + 1);
  };

  const Step = steps[step];

  return (
    <>
      <Step onNext={onNext} />
    </>
  );
};

export default Activate;
