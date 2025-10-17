'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, UploadIcon, FileIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { BulkUploadService } from '@/lib/bulk-upload';
import { ProgramFormData } from '@/lib/types';

export default function BulkUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    parsedData?: ProgramFormData[];
  }>({ type: null, message: '' });

  const bulkUploadService = new BulkUploadService();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (bulkUploadService.validateFileType(file)) {
        setSelectedFile(file);
        setUploadStatus({ type: null, message: '' });
      } else {
        setUploadStatus({
          type: 'error',
          message: 'Invalid file type. Please select a CSV, Excel (.xls, .xlsx), or XML file.'
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      const fileExtension = bulkUploadService.getFileExtension(selectedFile.name);
      let parsedData: ProgramFormData[] = [];

      // Parse the file based on its type
      switch (fileExtension) {
        case 'csv':
          parsedData = await bulkUploadService.parseCSV(selectedFile);
          break;
        case 'xls':
        case 'xlsx':
          parsedData = await bulkUploadService.parseExcel(selectedFile);
          break;
        case 'xml':
          parsedData = await bulkUploadService.parseXML(selectedFile);
          break;
        default:
          throw new Error('Unsupported file type');
      }

      if (parsedData.length === 0) {
        throw new Error('No valid data found in the file');
      }

      // In a real app, you would save the data to the database here
      console.log('Parsed data:', parsedData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setUploadStatus({
        type: 'success',
        message: `Successfully parsed ${parsedData.length} programs from ${selectedFile.name}`,
        parsedData
      });

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedFile(null);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred during upload'
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create a sample CSV template
    const headers = [
      'UNIVERSITY',
      'PROGRAMME Name',
      'University Ranking',
      'Study Level',
      'Study Area',
      'Campus',
      'Duration',
      'Open Intake',
      'Open Call',
      'Application Deadline',
      'Entry REQUIREMENTS',
      'PERCENTAGE Required',
      'MOI',
      'Ielts Score',
      'No band less than',
      'Toefl Score',
      'No ban less than',
      'PTE Score',
      'PTE No band less than',
      'DET Score',
      'DET No band less than',
      'TOLC Score',
      'SAT Score',
      'GRE Score',
      'GMAT Score',
      'CENTS Score',
      'TIL Score',
      'ARCHED Test',
      'Application Fees',
      'Additional Requirement',
      'Remarks'
    ];

    const sampleData = [
      'University of Example',
      'Computer Science',
      '100',
      'Bachelor',
      'Computer Science',
      'Main Campus',
      '4 years',
      'Fall 2024',
      'Open',
      '2024-03-15',
      'High school diploma',
      '80',
      'English',
      '6.5',
      '6.0',
      '90',
      '20',
      '65',
      '60',
      '120',
      '100',
      '25',
      '1200',
      '320',
      '650',
      '85',
      '75',
      'Pass',
      '100',
      'Portfolio required',
      'Popular program'
    ];

    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'program_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Upload Programs</h1>
          <p className="mt-2 text-gray-600">Upload multiple university programs using CSV, Excel, or XML files</p>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          {/* File Upload Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload File</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-4">
                <div>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Click to upload or drag and drop
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      CSV, Excel (.xls, .xlsx), or XML files up to 10MB
                    </span>
                  </label>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".csv,.xls,.xlsx,.xml"
                    className="sr-only"
                    onChange={handleFileSelect}
                  />
                </div>
                
                {selectedFile && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <FileIcon className="h-4 w-4" />
                    <span>{selectedFile.name}</span>
                    <span className="text-gray-400">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Template Download */}
          <div className="mb-8">
            <h3 className="text-md font-medium text-gray-900 mb-2">Need a template?</h3>
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FileIcon className="h-4 w-4 mr-2" />
              Download CSV Template
            </button>
          </div>

          {/* Upload Button */}
          <div className="mb-8">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload and Process File
                </>
              )}
            </button>
          </div>

          {/* Status Messages */}
          {uploadStatus.type && (
            <div className={`rounded-md p-4 ${
              uploadStatus.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {uploadStatus.type === 'success' ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircleIcon className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    uploadStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {uploadStatus.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* File Format Instructions */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">File Format Instructions</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">CSV Files:</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Use comma-separated values</li>
                  <li>First row should contain column headers</li>
                  <li>Required columns: UNIVERSITY, PROGRAMME Name</li>
                  <li>Date format: YYYY-MM-DD</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Excel Files (.xls, .xlsx):</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>First sheet will be processed</li>
                  <li>First row should contain column headers</li>
                  <li>Same column requirements as CSV</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">XML Files:</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Root element should contain program elements</li>
                  <li>Each program should have child elements matching column names</li>
                  <li>Required elements: university, programme_name</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}