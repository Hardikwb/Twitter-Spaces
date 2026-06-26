import Button from "../../../components/shared/Button/Button";

const StepUsername = ({ onNext }: { onNext: () => void }) => {
  return (
    <>
      <div>Email Component</div>
      <Button onClick={onNext} text="Next" />
    </>
  );
};

export default StepUsername;
