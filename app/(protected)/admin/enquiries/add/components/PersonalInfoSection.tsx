// src/app/enquiry/components/PersonalInfoSection.tsx

import { UserIcon } from "lucide-react";
import FormInput from "@/components/form/formInput";
import { EnquiryFormData } from "@/lib/types";

interface PersonalInfoSectionProps {
  formData: EnquiryFormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const personalInformationFields = [
  {
    name: "student_name",
    label: "Full Name",
    type: "text",
    
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    
  },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    
  },
];

export default function PersonalInfoSection({
  formData,
  handleInputChange,
}: PersonalInfoSectionProps) {
  const renderFields = (fields: typeof personalInformationFields) =>
    fields.map((field) => (
      <FormInput
        key={field.name}
        label={field.label}
        name={field.name}
        type={field.type}
        value={formData[field.name as keyof EnquiryFormData] || ""}
        onChange={handleInputChange}
        required={field.required}
      />
    ));

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
        Personal Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {renderFields(personalInformationFields.slice(0, 1))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-6">
        {renderFields(personalInformationFields.slice(1, 3))}
      </div>
    </div>
  );
}