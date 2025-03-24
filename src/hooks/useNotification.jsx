import { toast } from "sonner";

const type = {
  address: {
    success: {
      add: "Successfully added address",
      edit: "Successfully edited address",
      delete: "Successfully deleted delete",
      set_default: "Successfully set default address",
    },
    fail: {
      add: "Failed added address",
      edit: "Failed edited address",
      delete: "Failed deleted delete",
      set_default: "Failed set default address",
    },
  },
  order: {
    success: {
      delete: "Successfully deleted delete",
    },
    fail: {
      delete: "Failed deleted delete",
    },
  },
  payment: {
    success: {
      pay_success: "Your order was paid successfully",
    },
    fail: {},
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
