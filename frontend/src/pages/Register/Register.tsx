import { useState } from "react";
import StepAvatar from "../Steps/StepAvatar/StepAvatar";
import StepName from "../Steps/StepName/StepName";
import StepOtp from "../Steps/StepOtp/StepOtp";
import StepEmail from "../Steps/StepEmail/StepEmail";
import StepUsername from "../Steps/StepUsername/StepUsername";

const Register = () => {
  const onNext = (): void => {
    setStep((step) => step + 1);
  };
  const steps: Record<number, React.ComponentType<{ onNext: () => void }>> = {
    1: StepEmail,
    2: StepOtp,
    3: StepName,
    4: StepAvatar,
    5: StepUsername,
  };
  const [step, setStep] = useState(1);
  const Step = steps[step];
  return (
    <div>
      <Step onNext={onNext} />
    </div>
  );
};

export default Register;
