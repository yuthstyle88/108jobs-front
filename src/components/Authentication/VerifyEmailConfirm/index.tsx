import { MailCheck } from "lucide-react";
const VerifyEmailConfirm = () => {
  return (
    <div className="text-center max-w-md mx-auto">
      <div className="my-[3rem]">
        <p className="text-text-primary text-base font-sans">
          The verify email link has been sent to your email
        </p>
        <p className="text-text-primary text-base font-sans">
          Please check your inbox (If you don’t see it, check your Spam and Junk
          folders) to continue.
        </p>
      </div>
      <MailCheck className="h-24 text-[60px] text-third flex justify-center items-center w-full" />
    </div>
  );
};

export default VerifyEmailConfirm;
