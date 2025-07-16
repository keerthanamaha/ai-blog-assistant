import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

export const CreateContentElement = (
  uiContainer: HTMLElement,
  shadowContainer: HTMLElement,
  callback: (root: ReactDOM.Root) => React.ReactNode
): ReactDOM.Root => {
  const app = document.createElement("div");
  uiContainer.append(app);
  const styles = {
    visibility: "visible",
    position: "fixed",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    zIndex: "9999",
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  };
  Object.assign(shadowContainer.style, styles);

  const root = ReactDOM.createRoot(app);
  root.render(
    <React.StrictMode>
      <Toaster />
      {callback(root)}
    </React.StrictMode>
  );
  return root;
};
