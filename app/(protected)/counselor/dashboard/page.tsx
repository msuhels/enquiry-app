'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileTextIcon, UsersIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
import { Enquiry } from '@/lib/types';

export default function CounselorDashboard() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [counselorName, setCounselorName] = useState('');

  useEffect(() => {
    // Check authentication
    const isCounselor = localStorage.getItem('isCounselor') === 'true';
    if (!isCounselor) {
      router.push('/counselor/login');
      return;
    }
    setIsAuthenticated(true);
    setCounselorName(localStorage.getItem('counselorName') || '');
    fetchEnquiries();
  }, [router]);

  const fetchEnquiries = async () => {
    try {
      // In a real app, you would fetch assigned enquiries from your API
      const mockEnquiries: Enquiry[] = [
        {
          id: '1',
          student_name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1-555-0123',
          study_level: 'Bachelor',
          study_area: 'Computer Science',
          preferred_university: 'University of Toronto',
          preferred_country: 'Canada',
          budget_range: '$30,000 - $50,000',
          ielts_score: 6.5,
          percentage: 85,
          preferred_intake: 'Fall 2024',
          message: 'Interested in computer science programs in Canada.',
          status: 'pending',
          assigned_to_user_id: '2',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '2',
          student_name: 'Jane Smith',
          email: 'jane.smith@email.com',
          phone: '+1-555-0124',
          study_level: 'Master',
          study_area: 'Business Administration',
          preferred_university: 'University of British Columbia',
          preferred_country: 'Canada',
          budget_range: '$50,000 - $70,000',
          toefl_score: 95,
          percentage: 88,
          preferred_intake: 'Spring 2025',
          message: 'Looking for MBA programs with good ROI.',
          status: 'in_progress',
          assigned_to_user_id: '2',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setEnquiries(mockEnquiries);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (enquiryId: string, newStatus: Enquiry['status']) => {
    try {
      // In a real app, you would call your API here
      console.log('Updating enquiry status:', enquiryId, newStatus);
      
      setEnquiries(prev => prev.map(enquiry => 
        enquiry.id === enquiryId 
          ? { ...enquiry, status: newStatus, updated_at: new Date().toISOString() }
          : enquiry
      ));
    } catch (error) {
      console.error('Error updating enquiry:', error);
      alert('Error updating enquiry. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isCounselor');
    localStorage.removeItem('counselorEmail');
    localStorage.removeItem('counselorName');
    router.push('/counselor/login');
  };

  const getStatusColor = (status: Enquiry['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Enquiry['status']) => {
    switch (status) {
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      case 'in_progress': return <UsersIcon className="h-4 w-4" />;
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected': return <AlertCircleIcon className="h-4 w-4" />;
      default: return <FileTextIcon className="h-4 w-4" />;
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Counselor Dashboard</h1>
              <p className="mt-2 text-gray-600">Welcome back, {counselorName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileTextIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Enquiries</p>
                <p className="text-2xl font-bold text-gray-900">{enquiries.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enquiries.filter(e => e.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enquiries.filter(e => e.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enquiries.filter(e => e.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Assigned Enquiries</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Study Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No enquiries assigned to you yet.
                    </td>
                  </tr>
                ) : (
                  enquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {enquiry.student_name}
                        </div>
                        <div className="text-sm text-gray-500">{enquiry.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {enquiry.study_level} in {enquiry.study_area}
                        </div>
                        <div className="text-sm text-gray-500">
                          {enquiry.preferred_university}
                        </div>
                        <div className="text-sm text-gray-500">
                          {enquiry.preferred_country}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{enquiry.email}</div>
                        {enquiry.phone && (
                          <div className="text-sm text-gray-500">{enquiry.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                          {getStatusIcon(enquiry.status)}
                          <span className="ml-1 capitalize">{enquiry.status.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enquiry.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(enquiry.id, 'in_progress')}
                            disabled={enquiry.status === 'in_progress'}
                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Start
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(enquiry.id, 'completed')}
                            disabled={enquiry.status === 'completed'}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Complete
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}