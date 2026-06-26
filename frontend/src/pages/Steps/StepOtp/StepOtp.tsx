import { useState } from "react";
import Button from "../../../components/shared/Button/Button";
import Card from "../../../components/shared/Card/Card";
import Input from "../../../components/shared/Text-Input/Input";
import styles from "./StepOtp.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyCode } from "../../../http";
import { setAuth } from "../../../store/authSlice";
// const StepOtp = ({ onNext }: { onNext: () => void }) => {
const StepOtp = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, hash } = useSelector((state: any) => state.authSlice.code);

  async function submit() {
    try {
      const { data } = await verifyCode({
        code: code,
        email: email,
        hash: hash,
      });
      console.log(data);
      if (data.success) {
        dispatch(setAuth({ isAuth: true, user: { activated: false } }));
        navigate("/activate");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className={styles.cardWrapper}>
        <Card title="Enter the code we just texted you" icon="lock-emoji">
          <Input
            value={code}
            onChange={(e: any) => setCode(e.target.value)}
            placeholder="XXX-XXX"
          />
          <div>
            <div className={styles.actionButtonWrap}>
              <Button text="Submit" onClick={submit} />
            </div>
            <p className={styles.bottomParagraph}>
              By entering your email, you’re agreeing to our Terms of Service
              and Privacy Policy. Thanks!
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default StepOtp;
