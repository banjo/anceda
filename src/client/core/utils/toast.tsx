import toast, { Toaster } from "react-hot-toast";

const error = (error: Error | string) => {
    const message = typeof error === "string" ? error : error.message;
    toast.error(message);
};

const success = (message: string) => {
    toast.success(message);
};

const Provider = () => <Toaster position="bottom-right" />;

export const Toast = { error, success, Provider };
