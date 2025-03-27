import { toast } from "sonner";

const type = {
  profile: {
    success: {
      update: "บันทึกสำเร็จ",
    },
    fail: {
      set_default: "Failed set default address",
    },
  },
};

function useNotification() {
  const success_message = (msg, action, custom) => {
    toast.success(custom ? custom : type[msg].success[action]);
  };
  const error_message = (msg, action, custom) => {
    toast.error(custom ? custom : type[msg].fail[action]);
  };
  return {
    success_message,
    error_message,
  };
}

export default useNotification;
