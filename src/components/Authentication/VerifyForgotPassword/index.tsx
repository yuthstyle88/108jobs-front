import { RegisterDataProps } from "@/types/register-data";
import { MailCheck } from "lucide-react";
interface VerificationForgotPasswordProps {
  forgotEmail?: RegisterDataProps;
}

const VerificationForgotPassword: React.FC<VerificationForgotPasswordProps> = ({
  forgotEmail,
}) => {
  return (
    <div className="text-center max-w-md mx-auto">
      <div className="my-[3rem]">
        <p className="text-text-primary text-base font-sans">
          The verification code has been sent to your email: <br />{" "}
          {forgotEmail?.email}
        </p>
        <p className="text-text-primary text-base font-sans">
          We’ve sent a password reset link to your email. Please check your
          inbox (If you don’t see it, check your Spam and Junk folders) to
          continue.
        </p>
      </div>
      <MailCheck className="h-24 text-third flex justify-center items-center w-full" />
    </div>
  );
};

export default VerificationForgotPassword;
