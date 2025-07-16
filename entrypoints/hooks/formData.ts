import React from "react";

export interface IFormData {
  apiKey: string;
  endpoint: string;
}

export const useFormData = () => {
  const [formData, setFormData] = React.useState<IFormData>({
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

  return { formData, setFormData };
};
