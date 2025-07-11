import { FormEvent, useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import { iFormData, useFormData } from "../../hooks/formData";
import { toast } from "react-hot-toast";

const CredentialForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { formData, setFormData } = useFormData();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: iFormData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Save function can be implemented here to save formData to storage
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    chrome.storage.local.set({ formData }, () => {
      toast.success("API Credentials saved successfully!");
    });
  };

  return (
    <div className="bg-gray-900 text-white flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 w-[600px] p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2">
          API Configuration
        </h1>
        <p className="text-center text-gray-300">Enter your credentials</p>

        <div className="bg-gray-700 p-4 rounded-md space-y-4">
          <form className="space-y-4" onSubmit={handleSave}>
            {/* Endpoint */}
            <div>
              <label
                htmlFor="endpoint"
                className="block mb-1 text-sm text-gray-200"
              >
                Endpoint
              </label>
              <input
                type="url"
                value={formData?.endpoint}
                onChange={handleInputChange}
                name="endpoint"
                placeholder="Enter API Endpoint"
                className="w-full px-3 py-2 rounded-md bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* API Key with eye icon */}
            <div className="relative">
              <label
                htmlFor="apiKey"
                className="block mb-1 text-sm text-gray-200"
              >
                API Key
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData?.apiKey}
                onChange={handleInputChange}
                name="apiKey"
                placeholder="Enter API Key"
                required
                className="w-full px-3 py-2 pr-10 rounded-md bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-300 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200 flex items-center justify-center gap-2"
            >
              <Save size={18} /> Save
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-2">
          © 2025 Keerthana
        </p>
      </div>
    </div>
  );
};

export default CredentialForm;
