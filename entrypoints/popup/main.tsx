import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import CredentialForm from "./components/credentialForm";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster />
    <CredentialForm />
  </React.StrictMode>
);
