import { useState } from "react";
import Button from "../../../components/shared/Button/Button";
import Card from "../../../components/shared/Card/Card";
import Input from "../../../components/shared/Text-Input/Input";
import styles from "./StepEmail.module.css";
import { sendCode } from "../../../http";
import { useDispatch } from "react-redux";
import { setCode } from "../../../store/authSlice";

const StepEmail = ({ onNext }: { onNext: () => void }) => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const submit = async () => {
    const { data } = await sendCode({ email: email });
    if (data?.success) {
      dispatch(setCode({ email: data.data.email, hash: data.data.data }));
    }
    onNext();
  };
  return (
    <>
      <div className={styles.cardWrapper}>
        <Card title="Enter your Email" icon="email-emoji">
          <Input
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            placeholder="dev@gmail.com"
          />
          <div>
            <div className={styles.actionButtonWrap}>
              <Button text="Next" onClick={submit} />
            </div>
            <p className={styles.bottomParagraph}>
              By entering your email, you're agreeing to our Terms of Service
              and Privacy Policy. Thanks!
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default StepEmail;
