// src/app/enquiry/components/SuggestionDisplay.tsx

import { DownloadIcon } from "lucide-react";
import { Suggestion, Program } from "@/lib/types";
import { useRouter } from "next/navigation";
interface SuggestionDisplayProps {
  suggestions: Suggestion[];
  customSuggestions: Program[];
  showSuggestions: boolean;
  exportCSV: () => void;
  setShowSuggestions: (show: boolean) => void;
  columns: { key: string; label: string }[];
}

const SuggestionTable = ({
  customSuggestions,
  exportCSV,
  columns,
}: SuggestionDisplayProps) => {
  const router = useRouter();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Found {customSuggestions.length} matching programs
        </h3>
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center text-sm font-medium"
        >
          <DownloadIcon className="h-4 w-4 mr-1" /> Export CSV
        </button>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 border-b border-gray-200 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {customSuggestions.map((prog : Program) => (
              <tr
                key={prog.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {columns.map((col : { key: string; label: string }) => {
                  let value : any = prog[col.key];

                  // Handle nested JSON fields (custom_programs_fields)
                  if (col.key.startsWith("custom_")) {
                    const nested =
                      prog.custom_programs_fields?.map(
                        (f: any) =>
                          `${f.custom_field?.field_name}: ${f.field_value}`
                      ) || [];
                    value = nested.join(", ");
                  }

                  return (
                    <td
                      key={col.key}
                      className="px-4 py-3 border-b border-gray-200 text-gray-800 whitespace-nowrap"
                    >
                      {col.key === "university" ? (
                        <span
                          onClick={() =>
                            router.push(`/admin/programs/view/${prog.id}`)
                          }
                          className="text-blue-600 underline cursor-pointer"
                        >
                          {value || "-"}
                        </span>
                      ) : (
                        value || "-"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// const MainSuggestions = ({
//   suggestions,
//   setShowSuggestions,
//   columns
// }: {
//   suggestions: Suggestion[];
//   setShowSuggestions: (show: boolean) => void;
//   columns: any[]
// }) => (
//   <div className="space-y-6">
//     <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//       <div className="flex">
//         <div className="flex-shrink-0">
//           <svg
//             className="h-5 w-5 text-green-400"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path
//               fillRule="evenodd"
//               d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </div>
//         <div className="ml-3">
//           <p className="text-sm font-medium text-green-800">
//             Thank you for your enquiry! We've found {suggestions.length}{" "}
//             programs that match your criteria.
//           </p>
//         </div>
//       </div>
//     </div>

//     {suggestions.map((suggestion) => (
//       <div
//         key={suggestion.program.id}
//         className="bg-white shadow rounded-lg p-6"
//       >
//         <div className="flex justify-between items-start mb-4">
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900">
//               {suggestion.program.programme_name}
//             </h3>
//             <p className="text-lg text-gray-600">
//               {suggestion.program.university}
//             </p>
//             {suggestion.program.university_ranking && (
//               <p className="text-sm text-blue-600 font-medium">
//                 World Ranking: #{suggestion.program.university_ranking}
//               </p>
//             )}
//           </div>
//           <div className="text-right">
//             <div className="text-2xl font-bold text-green-600">
//               {Math.round(suggestion.match_score)}%
//             </div>
//             <div className="text-sm text-gray-500">Match Score</div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <span className="text-sm font-medium text-gray-500">
//               Study Level:
//             </span>
//             <span className="ml-2 text-gray-900">
//               {suggestion.program.study_level}
//             </span>
//           </div>
//           <div>
//             <span className="text-sm font-medium text-gray-500">Duration:</span>
//             <span className="ml-2 text-gray-900">
//               {suggestion.program.duration}
//             </span>
//           </div>
//           <div>
//             <span className="text-sm font-medium text-gray-500">Campus:</span>
//             <span className="ml-2 text-gray-900">
//               {suggestion.program.campus}
//             </span>
//           </div>
//           <div>
//             <span className="text-sm font-medium text-gray-500">
//               Application Fee:
//             </span>
//             <span className="ml-2 text-gray-900">
//               {suggestion.program.application_fees
//                 ? `$${suggestion.program.application_fees}`
//                 : "Not specified"}
//             </span>
//           </div>
//         </div>

//         {suggestion.program.application_deadline && (
//           <div className="mb-4">
//             <span className="text-sm font-medium text-gray-500">
//               Application Deadline:
//             </span>
//             <span className="ml-2 text-gray-900">
//               {new Date(
//                 suggestion.program.application_deadline
//               ).toLocaleDateString()}
//             </span>
//           </div>
//         )}

//         <div className="mb-4">
//           <h4 className="text-sm font-medium text-gray-700 mb-2">
//             Why this program matches:
//           </h4>
//           <ul className="list-disc list-inside space-y-1">
//             {suggestion.reasons.map((reason, reasonIndex) => (
//               <li key={reasonIndex} className="text-sm text-gray-600">
//                 {reason}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="flex space-x-4">
//           <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium">
//             Apply Now
//           </button>
//           <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium">
//             Save for Later
//           </button>
//           <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium">
//             Get More Info
//           </button>
//         </div>
//       </div>
//     ))}

//     <div className="text-center">
//       <button
//         onClick={() => setShowSuggestions(false)}
//         className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
//       >
//         Submit Another Enquiry
//       </button>
//     </div>
//   </div>
// );

export default function SuggestionDisplay({
  suggestions,
  customSuggestions,
  showSuggestions,
  exportCSV,
  setShowSuggestions,
  columns,
}: SuggestionDisplayProps) {
  // if (showSuggestions) {
  //   return (
  //     <MainSuggestions
  //       suggestions={suggestions}
  //       setShowSuggestions={setShowSuggestions}
  //     />
  //   );
  // }

  // This component will also render the custom suggestions table if showSuggestions is false
  if (customSuggestions.length > 0) {
    return (
      <SuggestionTable
        columns={columns}
        customSuggestions={customSuggestions}
        exportCSV={exportCSV}
      />
    );
  }

  return null;
}
