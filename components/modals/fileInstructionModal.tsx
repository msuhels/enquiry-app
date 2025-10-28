import { FileText, Table, Upload, Sparkles } from "lucide-react";

export default function FileFormatInstructions() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="text-blue-600" size={24} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">
          File Format Instructions
        </h2>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        {/* Required Columns */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Table className="text-gray-700" size={18} />
            <h3 className="text-md font-medium text-gray-900">
              Required Columns:
            </h3>
          </div>
          <ul className="text-sm text-gray-600 space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                <span className="font-semibold text-gray-800">UNIVERSITY</span>{" "}
                - Name of the university (required)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                <span className="font-semibold text-gray-800">
                  PROGRAMME Name
                </span>{" "}
                - Name of the program (required)
              </span>
            </li>
          </ul>
        </div>

        {/* Custom Fields */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-gray-700" size={18} />
            <h3 className="text-md font-medium text-gray-900">
              Custom Fields (Optional):
            </h3>
          </div>
          <ul className="text-sm text-gray-600 space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-1">•</span>
              <span>
                Add any custom field by naming the column with your desired field name (e.g., "IELTS Score", "GPA Required")
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-1">•</span>
              <span>
                For comparison operators, add a column with prefix{" "}
                <span className="font-mono text-xs bg-white px-1 py-0.5 rounded">Comp-</span>{" "}
                followed by the field name
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-1">•</span>
              <span>
                <span className="font-semibold">Example:</span> Column "IELTS Score" with value "6.5" and column "Comp-IELTS Score" with value "gt" means IELTS &gt; 6.5
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-1">•</span>
              <span>
                Supported comparison values:{" "}
                <span className="font-mono text-xs bg-white px-1 py-0.5 rounded">gt</span> (&gt;),{" "}
                <span className="font-mono text-xs bg-white px-1 py-0.5 rounded">gte</span> (&gt;=),{" "}
                <span className="font-mono text-xs bg-white px-1 py-0.5 rounded">lt</span> (&lt;),{" "}
                <span className="font-mono text-xs bg-white px-1 py-0.5 rounded">lte</span> (&lt;=),{" "}
                <span className="font-mono text-xs bg-white px-1 py-0.5 rounded">eq</span> (=){" "}
                (default: gt if not specified)
              </span>
            </li>
          </ul>
        </div>

        {/* CSV Files */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="text-gray-700" size={18} />
            <h3 className="text-md font-medium text-gray-900">CSV Files:</h3>
          </div>
          <ul className="text-sm text-gray-600 space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Use comma-separated values</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>First row should contain column headers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Date format: YYYY-MM-DD</span>
            </li>
          </ul>
        </div>

        {/* Excel Files */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Upload className="text-gray-700" size={18} />
            <h3 className="text-md font-medium text-gray-900">
              Excel Files (.xls, .xlsx):
            </h3>
          </div>
          <ul className="text-sm text-gray-600 space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span>First sheet will be processed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span>First row should contain column headers</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}