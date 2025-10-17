'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, PlusIcon, EditIcon, TrashIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { Program } from '@/lib/types';

export default function ProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    
  }, [router]);

  const fetchPrograms = async () => {
    try {
      // In a real app, you would fetch from your API
      // For demo purposes, we'll use mock data
      const mockPrograms: Program[] = [
        {
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
        {
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
        }
      ];
      setPrograms(mockPrograms);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      try {
        // In a real app, you would call your API here
        console.log('Deleting program:', id);
        setPrograms(prev => prev.filter(program => program.id !== id));
      } catch (error) {
        console.error('Error deleting program:', error);
        alert('Error deleting program. Please try again.');
      }
    }
  };

  const filteredPrograms = programs.filter(program =>
    program.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.programme_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.study_area?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // if (!isAuthenticated || loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Programs</h1>
              <p className="mt-2 text-gray-600">View, edit, and delete university programs</p>
            </div>
            <Link
              href="/admin/programs/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Program
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search programs by university, name, or study area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Programs Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Study Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ranking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrograms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      {searchTerm ? 'No programs found matching your search.' : 'No programs available.'}
                    </td>
                  </tr>
                ) : (
                  filteredPrograms.map((program) => (
                    <tr key={program.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {program.university}
                        </div>
                        {program.campus && (
                          <div className="text-sm text-gray-500">{program.campus}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{program.programme_name}</div>
                        {program.study_area && (
                          <div className="text-sm text-gray-500">{program.study_area}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {program.study_level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {program.university_ranking ? `#${program.university_ranking}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {program.application_deadline
                          ? new Date(program.application_deadline).toLocaleDateString()
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/programs/edit/${program.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EditIcon className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(program.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
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

        {/* Stats */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{programs.length}</div>
              <div className="text-sm text-gray-500">Total Programs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {programs.filter(p => p.university_ranking && p.university_ranking <= 100).length}
              </div>
              <div className="text-sm text-gray-500">Top 100 Universities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(programs.map(p => p.study_level)).size}
              </div>
              <div className="text-sm text-gray-500">Study Levels</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}