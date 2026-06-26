import React, { useState } from "react";
import StepOtp from "../Steps/StepOtp/StepOtp";
import StepEmail from "../Steps/StepEmail/StepEmail";

const Authenticate = () => {
  const [step, setStep] = useState(1);
  const onNext = (): void => {
    setStep((step) => step + 1);
  };
  const steps: Record<number, React.ComponentType<{ onNext: () => void }>> = {
    1: StepEmail,
    2: StepOtp,
  };
  const Step = steps[step];
  return (
    <div>
      {/* <h1 className="">Login</h1> */}
      <Step onNext={onNext} />
    </div>
  );
};

export default Authenticate;
