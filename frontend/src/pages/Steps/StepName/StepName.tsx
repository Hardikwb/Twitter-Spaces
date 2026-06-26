import { useState } from "react";
import Button from "../../../components/shared/Button/Button";
import Card from "../../../components/shared/Card/Card";
import Input from "../../../components/shared/Text-Input/Input";
import styles from "./StepName.module.css";
import { useDispatch } from "react-redux";
import { setUserName } from "../../../store/activateSlice";

const StepName = ({ onNext }: { onNext: () => void }) => {
  const [fullName, setFullName] = useState("");
  const dispatch = useDispatch();
  const submit = () => {
    dispatch(setUserName(fullName));
    onNext();
  };
  return (
    <>
      <div className="cardWrapper">
        <Card title="What's your full name?" icon="goggle-emoji">
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <p className={styles.paragraph}>
            People use real names at Spaces :) !
          </p>
          <div>
            <Button onClick={submit} text="Next" />
          </div>
        </Card>
      </div>
    </>
  );
};

export default StepName;
