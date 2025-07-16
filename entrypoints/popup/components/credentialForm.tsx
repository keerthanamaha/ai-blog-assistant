import { IFormData, useFormData } from "@/entrypoints/hooks/formData";
import { Eye, EyeOff, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function CredentialForm() {
  const [showApiKey, setShowApiKey] = useState(false);
  const { formData, setFormData } = useFormData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: IFormData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    chrome.storage.local.set({ formData }, () => {
      toast.success("API credentials saved successfully");
    });
  };

  return (
    <div className="dark w-[600px]">
      <div className="min-h-screen bg-gray-900  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white ">
              API Configuration
            </h2>
            <p className="mt-2 text-sm text-gray-400 ">
              Enter your API credentials
            </p>
          </div>
          <div className="bg-gray-800  shadow-md rounded-lg p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="endpoint"
                    className="block text-sm font-medium text-gray-300 "
                  >
                    Endpoint
                  </label>
                  <div className="mt-1">
                    <input
                      id="endpoint"
                      name="endpoint"
                      type="url"
                      value={formData?.endpoint}
                      onChange={handleChange}
                      required
                      placeholder="https://api.example.com/v1"
                      className="appearance-none block w-full px-4 py-3 border border-gray-700  rounded-md shadow-sm placeholder-gray-500  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-900  text-white "
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="apiKey"
                    className="block text-sm font-medium text-gray-300 "
                  >
                    API Key
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="apiKey"
                      name="apiKey"
                      required
                      value={formData?.apiKey}
                      type={showApiKey ? "text" : "password"}
                      onChange={handleChange}
                      placeholder="Enter your API key"
                      className="appearance-none block w-full px-4 py-3 border border-gray-700  rounded-md shadow-sm placeholder-gray-500  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-900  text-white "
                    />

                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-gray-400 "
                        title={showApiKey ? "Hide API Key" : "Show API Key"}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                        <span className="sr-only">
                          {showApiKey ? "Hide API Key" : "Show API Key"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 "
                >
                  <Save className="mr-2 h-5 w-5" aria-hidden="true" />
                  Save
                </button>
              </div>
            </form>
          </div>
          <p className="mt-4 text-center text-sm text-gray-400 ">
            Your API credentials are securely processed on browser storage
          </p>
          <p className="text-center text-sm text-gray-500">
            Copyright Hasan-py © 2025{" "}
            {new Date().getFullYear() > 2025
              ? `- ${new Date().getFullYear()}`
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
