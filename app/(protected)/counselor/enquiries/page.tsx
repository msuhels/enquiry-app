'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, UserIcon, MailIcon, PhoneIcon, BookOpenIcon, MapPinIcon, DollarSignIcon, MessageSquareIcon } from 'lucide-react';
import { EnquiryFormData, Suggestion } from '@/lib/types';

export default function EnquiryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [formData, setFormData] = useState<EnquiryFormData>({
    student_name: '',
    email: '',
    phone: '',
    study_level: '',
    study_area: '',
    preferred_university: '',
    preferred_country: '',
    budget_range: '',
    ielts_score: undefined,
    toefl_score: undefined,
    pte_score: undefined,
    det_score: undefined,
    percentage: undefined,
    gre_score: undefined,
    gmat_score: undefined,
    sat_score: undefined,
    preferred_intake: '',
    additional_requirements: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : (name.includes('score') || name === 'percentage' ? parseFloat(value) : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, you would save the enquiry and get suggestions
      console.log('Creating enquiry:', formData);
      
      // Simulate API call to save enquiry
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate getting suggestions
      const mockSuggestions: Suggestion[] = [
        {
          program: {
            id: '1',
            university: 'University of Toronto',
            programme_name: 'Computer Science',
            university_ranking: 18,
            study_level: 'Bachelor',
            study_area: 'Computer Science',
            campus: 'St. George Campus',
            duration: '4 years',
            application_deadline: '2024-03-01',
            percentage_required: 85,
            ielts_score: 6.5,
            application_fees: 180,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          match_score: 92,
          reasons: [
            'Perfect match for Bachelor study level',
            'Exact match in Computer Science field',
            'You meet the academic requirements (85% required)',
            'IELTS score meets requirements (6.5 required)',
            'Top-ranked university (#18)'
          ]
        },
        {
          program: {
            id: '2',
            university: 'University of British Columbia',
            programme_name: 'Software Engineering',
            university_ranking: 47,
            study_level: 'Bachelor',
            study_area: 'Computer Science',
            campus: 'Vancouver Campus',
            duration: '4 years',
            application_deadline: '2024-01-15',
            percentage_required: 88,
            ielts_score: 6.5,
            application_fees: 168,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          match_score: 88,
          reasons: [
            'Perfect match for Bachelor study level',
            'Exact match in Computer Science field',
            'Close to meeting academic requirements (88% required)',
            'IELTS score meets requirements (6.5 required)',
            'Well-ranked university (#47)'
          ]
        }
      ];

      setSuggestions(mockSuggestions);
      setShowSuggestions(true);

    } catch (error) {
      console.error('Error creating enquiry:', error);
      alert('Error submitting enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">University Program Enquiry</h1>
          {/* <p className="text-lg text-gray-600">
            Tell us about your preferences and we'll suggest the best university programs for you
          </p> */}
        </div>

        {!showSuggestions ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="student_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="student_name"
                    name="student_name"
                    required
                    value={formData.student_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="preferred_country" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Country
                  </label>
                  <select
                    id="preferred_country"
                    name="preferred_country"
                    value={formData.preferred_country || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Country</option>
                    <option value="Canada">Canada</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Academic Preferences */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpenIcon className="h-5 w-5 mr-2 text-blue-600" />
                Academic Preferences
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="study_level" className="block text-sm font-medium text-gray-700 mb-2">
                    Study Level *
                  </label>
                  <select
                    id="study_level"
                    name="study_level"
                    required
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
                    Study Area *
                  </label>
                  <input
                    type="text"
                    id="study_area"
                    name="study_area"
                    required
                    value={formData.study_area}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science, Business, Engineering"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="preferred_university" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred University
                  </label>
                  <input
                    type="text"
                    id="preferred_university"
                    name="preferred_university"
                    value={formData.preferred_university || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., University of Toronto"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="preferred_intake" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Intake
                  </label>
                  <select
                    id="preferred_intake"
                    name="preferred_intake"
                    value={formData.preferred_intake || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Intake</option>
                    <option value="Fall 2024">Fall 2024</option>
                    <option value="Spring 2025">Spring 2025</option>
                    <option value="Fall 2025">Fall 2025</option>
                    <option value="Spring 2026">Spring 2026</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Percentage
                  </label>
                  <input
                    type="number"
                    id="percentage"
                    name="percentage"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.percentage || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 85.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range (Annual)
                  </label>
                  <select
                    id="budget_range"
                    name="budget_range"
                    value={formData.budget_range || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Budget Range</option>
                    <option value="Under $20,000">Under $20,000</option>
                    <option value="$20,000 - $30,000">$20,000 - $30,000</option>
                    <option value="$30,000 - $50,000">$30,000 - $50,000</option>
                    <option value="$50,000 - $70,000">$50,000 - $70,000</option>
                    <option value="Above $70,000">Above $70,000</option>
                  </select>
                </div>
              </div>
            </div>

            {/* English Language Test Scores */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">English Language Test Scores</h2>
              
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
                    placeholder="e.g., 6.5"
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
                    placeholder="e.g., 90"
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
                    placeholder="e.g., 65"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="det_score" className="block text-sm font-medium text-gray-700 mb-2">
                    DET Score
                  </label>
                  <input
                    type="number"
                    id="det_score"
                    name="det_score"
                    min="0"
                    max="160"
                    value={formData.det_score || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Standardized Test Scores */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Standardized Test Scores</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    placeholder="e.g., 320"
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
                    placeholder="e.g., 650"
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
                    placeholder="e.g., 1200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquareIcon className="h-5 w-5 mr-2 text-blue-600" />
                Additional Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="additional_requirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Requirements or Preferences
                  </label>
                  <textarea
                    id="additional_requirements"
                    name="additional_requirements"
                    rows={3}
                    value={formData.additional_requirements || ''}
                    onChange={handleInputChange}
                    placeholder="Any specific requirements, preferences, or constraints..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message || ''}
                    onChange={handleInputChange}
                    placeholder="Any additional information you'd like to share..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-lg font-medium"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <SearchIcon className="h-5 w-5 mr-2" />
                )}
                {loading ? 'Finding Programs...' : 'Find My Programs'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Thank you for your enquiry! We've found {suggestions.length} programs that match your criteria.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {suggestions.map((suggestion, index) => (
                <div key={suggestion.program.id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {suggestion.program.programme_name}
                      </h3>
                      <p className="text-lg text-gray-600">{suggestion.program.university}</p>
                      {suggestion.program.university_ranking && (
                        <p className="text-sm text-blue-600 font-medium">
                          World Ranking: #{suggestion.program.university_ranking}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(suggestion.match_score)}%
                      </div>
                      <div className="text-sm text-gray-500">Match Score</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Study Level:</span>
                      <span className="ml-2 text-gray-900">{suggestion.program.study_level}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Duration:</span>
                      <span className="ml-2 text-gray-900">{suggestion.program.duration}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Campus:</span>
                      <span className="ml-2 text-gray-900">{suggestion.program.campus}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Application Fee:</span>
                      <span className="ml-2 text-gray-900">
                        {suggestion.program.application_fees ? `$${suggestion.program.application_fees}` : 'Not specified'}
                      </span>
                    </div>
                  </div>

                  {suggestion.program.application_deadline && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-500">Application Deadline:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(suggestion.program.application_deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Why this program matches:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {suggestion.reasons.map((reason, reasonIndex) => (
                        <li key={reasonIndex} className="text-sm text-gray-600">{reason}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                      Apply Now
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium">
                      Save for Later
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium">
                      Get More Info
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowSuggestions(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Submit Another Enquiry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}