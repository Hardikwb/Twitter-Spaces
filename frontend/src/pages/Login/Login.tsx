import React, { useState } from "react";
import StepOtp from "../Steps/StepOtp/StepOtp";
import StepEmail from "../Steps/StepEmail/StepEmail";

const Login = () => {
  const [step, setStep] = useState(1);

  const onNext = (): void => {
    setStep((step) => step + 1);
  };

  const steps: Record<number, React.ComponentType<{ onNext: () => void }>> = {
    1: StepEmail,
    2: StepOtp,
  };

  const Step = steps[step];
  return <Step onNext={onNext} />;
};

export default Login;
