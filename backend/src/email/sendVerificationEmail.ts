import { Resend } from "resend"
import config from "../config/config.js"
import VerificationEmailTemplate from "./VerificationEmailTemplate.js";

const resend = new Resend(config.RESEND)

const sendVerificationEmail = async(
    email:string,
    verifyCode:string,
)=>{
     try {
    await resend.emails.send({
      from: "Spaces <onboarding@resend.dev>",
      to: email,
      subject: "Verification Email from Spaces",
      react: VerificationEmailTemplate({ email: email, verifyCode: verifyCode }),
    });
    return { success: true, message: "Verification email send successfully" };
    } 
  catch (emailError) {
    console.log(`Error while sending message:: ${emailError} `);
    return { success: false, message: "Fail to send email" };
  }
}

export default sendVerificationEmail