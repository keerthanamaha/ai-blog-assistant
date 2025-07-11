import React, { useEffect } from "react";

export interface iFormData {
  apiKey: string;
  endpoint: string;
}
export const useFormData = () => {
  const [formData, setFormData] = React.useState<iFormData>({
    apiKey: "",
    endpoint: "",
  });
  useEffect(() => {
    chrome.storage.local.get(["formData"], (result) => {
      if (result.formData) {
        setFormData(result.formData);
      }
    });
  }, []);
  return {
    formData,
    setFormData,
  };
};
