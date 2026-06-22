interface VerificationEmailProps {
  email: string;
  verifyCode: string;
}

import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "react-email";
import config from "../config/config.js";

const VerificationEmailTemplate = ({email,verifyCode}:VerificationEmailProps) => {
  return (
    <>
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
        }}
        fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code: {verifyCode}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {email},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering. Please use the following verification
            code to complete your registration:
          </Text>
        </Row>
        <Row>
          <Text>{verifyCode}</Text>
        </Row>
        <Row>
          <Text>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
        <Row>
          <Button
            href={`${config.DOMAIN}/verify/${email}`}
            style={{ color: "#61dafb" }}
          >
            Verify here
          </Button>
        </Row>
      </Section>
    </Html>
    </>
  );
}

export default VerificationEmailTemplate