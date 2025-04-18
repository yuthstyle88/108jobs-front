import { toast } from "sonner";

const type = {
  profile: {
    success: {
      update: "บันทึกสำเร็จ",
      update_education: "บันทึกการศึกษาเรียบร้อย",
      update_work_experience: "บันทึกประสบการณ์การทำงานเรียบร้อย",
      update_certification: "บันทึกการรับรองเรียบร้อย",
      update_skill: "บันทึกทักษะเรียบร้อย",
      update_language: "บันทึกภาษาต่างประเทศเรียบร้อย",
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
