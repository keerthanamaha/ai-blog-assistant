import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./style.css";
import CredentialForm from "./components/credentialForm";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster />
    <CredentialForm />
  </React.StrictMode>
);
