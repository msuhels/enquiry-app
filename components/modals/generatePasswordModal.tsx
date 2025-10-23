import { Lock } from "lucide-react";
import React from "react";

type Props = {
  handleConfirmation: () => void;
};

const GeneratePasswordModal = ({ handleConfirmation }: Props) => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
          <Lock className="text-yellow-600" size={24} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Password Instructions
        </h2>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        {/* Password Instructions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lock className="text-gray-700" size={18} />
            <h3 className="text-md font-medium text-gray-900">
              Password Format:
            </h3>
          </div>
          <p className="text-sm text-gray-600 ml-6">
            The password will be User's{" "}
            <span className="font-semibold text-gray-800">first name</span>
            combined with{" "}
            <span className="font-semibold text-gray-800">@123</span>.
            <br />
            Example: If user's first name is{" "}
            <span className="font-semibold text-gray-800">John</span>, then
            password will be{" "}
            <span className="font-semibold text-gray-800">John@123</span>.
          </p>
        </div>

        {/* Confirmation Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleConfirmation}
            className="px-6 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition"
          >
            Confirm Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratePasswordModal;
