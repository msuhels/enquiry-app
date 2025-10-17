'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, SaveIcon } from 'lucide-react';
import Link from 'next/link';
import { ProgramFormData } from '@/lib/types';

export default function NewProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProgramFormData>({
    university: '',
    programme_name: '',
    university_ranking: undefined,
    study_level: '',
    study_area: '',
    campus: '',
    duration: '',
    open_intake: '',
    open_call: '',
    application_deadline: '',
    entry_requirements: '',
    percentage_required: undefined,
    moi: '',
    ielts_score: undefined,
    ielts_no_band_less_than: undefined,
    toefl_score: undefined,
    toefl_no_band_less_than: undefined,
    pte_score: undefined,
    pte_no_band_less_than: undefined,
    det_score: undefined,
    det_no_band_less_than: undefined,
    tolc_score: undefined,
    sat_score: undefined,
    gre_score: undefined,
    gmat_score: undefined,
    cents_score: undefined,
    til_score: undefined,
    arched_test: '',
    application_fees: undefined,
    additional_requirements: '',
    remarks: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : (name.includes('score') || name.includes('ranking') || name.includes('required') || name.includes('fees') ? parseFloat(value) : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, you would call your API here
      console.log('Creating program:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/admin/programs');
    } catch (error) {
      console.error('Error creating program:', error);
      alert('Error creating program. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Program</h1>
          <p className="mt-2 text-gray-600">Enter the details for the new university program</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                  University *
                </label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  required
                  value={formData.university}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="programme_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Programme Name *
                </label>
                <input
                  type="text"
                  id="programme_name"
                  name="programme_name"
                  required
                  value={formData.programme_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="university_ranking" className="block text-sm font-medium text-gray-700 mb-2">
                  University Ranking
                </label>
                <input
                  type="number"
                  id="university_ranking"
                  name="university_ranking"
                  value={formData.university_ranking || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="study_level" className="block text-sm font-medium text-gray-700 mb-2">
                  Study Level
                </label>
                <select
                  id="study_level"
                  name="study_level"
                  value={formData.study_level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Study Level</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>

              <div>
                <label htmlFor="study_area" className="block text-sm font-medium text-gray-700 mb-2">
                  Study Area
                </label>
                <input
                  type="text"
                  id="study_area"
                  name="study_area"
                  value={formData.study_area || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="campus" className="block text-sm font-medium text-gray-700 mb-2">
                  Campus
                </label>
                <input
                  type="text"
                  id="campus"
                  name="campus"
                  value={formData.campus || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 years, 18 months"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="application_deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline
                </label>
                <input
                  type="date"
                  id="application_deadline"
                  name="application_deadline"
                  value={formData.application_deadline || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Academic Requirements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="percentage_required" className="block text-sm font-medium text-gray-700 mb-2">
                  Percentage Required
                </label>
                <input
                  type="number"
                  id="percentage_required"
                  name="percentage_required"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.percentage_required || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="moi" className="block text-sm font-medium text-gray-700 mb-2">
                  Medium of Instruction
                </label>
                <input
                  type="text"
                  id="moi"
                  name="moi"
                  value={formData.moi || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="entry_requirements" className="block text-sm font-medium text-gray-700 mb-2">
                  Entry Requirements
                </label>
                <textarea
                  id="entry_requirements"
                  name="entry_requirements"
                  rows={3}
                  value={formData.entry_requirements || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">English Language Requirements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="ielts_score" className="block text-sm font-medium text-gray-700 mb-2">
                  IELTS Score
                </label>
                <input
                  type="number"
                  id="ielts_score"
                  name="ielts_score"
                  step="0.5"
                  min="0"
                  max="9"
                  value={formData.ielts_score || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="ielts_no_band_less_than" className="block text-sm font-medium text-gray-700 mb-2">
                  IELTS No Band Less Than
                </label>
                <input
                  type="number"
                  id="ielts_no_band_less_than"
                  name="ielts_no_band_less_than"
                  step="0.5"
                  min="0"
                  max="9"
                  value={formData.ielts_no_band_less_than || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="toefl_score" className="block text-sm font-medium text-gray-700 mb-2">
                  TOEFL Score
                </label>
                <input
                  type="number"
                  id="toefl_score"
                  name="toefl_score"
                  min="0"
                  max="120"
                  value={formData.toefl_score || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="pte_score" className="block text-sm font-medium text-gray-700 mb-2">
                  PTE Score
                </label>
                <input
                  type="number"
                  id="pte_score"
                  name="pte_score"
                  min="0"
                  max="90"
                  value={formData.pte_score || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Scores</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gre_score" className="block text-sm font-medium text-gray-700 mb-2">
                  GRE Score
                </label>
                <input
                  type="number"
                  id="gre_score"
                  name="gre_score"
                  min="260"
                  max="340"
                  value={formData.gre_score || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="gmat_score" className="block text-sm font-medium text-gray-700 mb-2">
                  GMAT Score
                </label>
                <input
                  type="number"
                  id="gmat_score"
                  name="gmat_score"
                  min="200"
                  max="800"
                  value={formData.gmat_score || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="sat_score" className="block text-sm font-medium text-gray-700 mb-2">
                  SAT Score
                </label>
                <input
                  type="number"
                  id="sat_score"
                  name="sat_score"
                  min="400"
                  max="1600"
                  value={formData.sat_score || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="application_fees" className="block text-sm font-medium text-gray-700 mb-2">
                  Application Fees
                </label>
                <input
                  type="number"
                  id="application_fees"
                  name="application_fees"
                  step="0.01"
                  min="0"
                  value={formData.application_fees || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="additional_requirements" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Requirements
                </label>
                <textarea
                  id="additional_requirements"
                  name="additional_requirements"
                  rows={3}
                  value={formData.additional_requirements || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  name="remarks"
                  rows={3}
                  value={formData.remarks || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <SaveIcon className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Creating...' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}