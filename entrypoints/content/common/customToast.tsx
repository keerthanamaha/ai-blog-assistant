import { CheckCircle, Info, Loader2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

function customToast({
  message,
  isLoading = false,
  status = "success",
}: {
  message: string;
  isLoading?: boolean;
  status?: "success" | "error" | "info";
}) {
  let bgColor = "bg-green-500";
  let textColor = "text-white";
  let icon = <CheckCircle className="h-5 w-5 text-white" />;
  let shadow = "shadow-lg";

  if (isLoading) {
    bgColor = "bg-gray-700";
    textColor = "text-white";
    icon = <Loader2 className="h-5 w-5 animate-spin text-white" />;
    shadow = "shadow-md";
  } else if (status === "error") {
    bgColor = "bg-red-500";
    textColor = "text-white";
    icon = <XCircle className="h-5 w-5 text-white" />;
    shadow = "shadow-lg";
  } else if (status === "info") {
    bgColor = "bg-blue-500";
    textColor = "text-white";
    icon = <Info className="h-5 w-5 text-white" />;
    shadow = "shadow-lg";
  }

  return toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full ${bgColor} rounded-xl p-2 ${shadow} pointer-events-auto`}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-full p-2">
          <span className={textColor}>{icon}</span>
        </div>
        <div className="flex-1">
          <p className={`${textColor} text-sm font-medium`}>{message}</p>
        </div>
      </div>
    </div>
  ));
}

export default customToast;
