import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import { useEffect, useState } from "react";
import { setProfileURL } from "../../../store/activateSlice";
import { activateProfile } from "../../../http";
import Button from "../../../components/shared/Button/Button";
import Card from "../../../components/shared/Card/Card";
import styles from "./StepAvatar.module.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/shared/Loader/Loader";

type RootState = {
  activateSlice: {
    username: string;
  };
  authSlice: {
    code: {
      email: string;
    };
  };
};

const StepAvatar = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("/images/monkey-avatar.png");
  const { username } = useSelector((state: RootState) => state.activateSlice);
  const email = useSelector((state: RootState) => state.authSlice.code.email);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRawFile(file); // Save raw binary asset reference
      setPreview(URL.createObjectURL(file)); // Make an instant mock URL for local image preview
    }
  };

  const submit = async () => {
    setLoading(true);
    if (!rawFile) {
      alert("Select an image first!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", rawFile);
      formData.append("email", email);
      formData.append("username", username);

      const { data } = await activateProfile(formData);

      dispatch(setProfileURL(data.data.avatar));
      dispatch(setAuth({ isAuth: true, user: data.data.user }));
      navigate("/rooms");
    } catch (err) {
      console.error("Submission layout error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {};
  }, []);

  if (loading) return <Loader message="Activation in progress..." />;

  return (
    <>
      <div className={styles.cardWrapper}>
        <Card title={`Okay, ${username}`} icon="monkey-emoji">
          <p className={styles.subHeading}>How’s this photo?</p>
          <div className={styles.avatarWrapper}>
            <img className={styles.avatarImage} src={preview} alt="avatar" />
          </div>
          <div>
            <input
              onChange={handleFileChange}
              id="avatarInput"
              type="file"
              accept="image/*"
              className={styles.avatarInput}
            />
            <label className={styles.avatarLabel} htmlFor="avatarInput">
              Choose a different photo
            </label>
          </div>
          <div>
            <Button onClick={submit} text="Next" />
          </div>
        </Card>
      </div>
    </>
  );
};

export default StepAvatar;
