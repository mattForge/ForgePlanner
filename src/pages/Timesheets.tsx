import React, { useState } from 'react';
import { Download, Search, FileText, Calendar, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../hooks/useAuth';

export function Timesheets() {
  const { timeRecords, users, teams } = useData();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');

  // ✅ CANVAS PDF - INDIVIDUAL EMPLOYEE
  const generateIndividualPDF = (userId: string) => {
    const userRecords = timeRecords.filter(r => r.userId === userId);
    const user = users.find(u => u.id === userId);
    
    if (userRecords.length === 0) {
      alert('No time records found for this employee');
      return;
    }

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const lineHeight = 25;
    const pageHeight = 1000;
    const pageWidth = 800;
    const recordsPerPage = Math.floor((pageHeight - 200) / lineHeight);
    
    // Calculate total pages
    const totalPages = Math.ceil(userRecords.length / recordsPerPage);
    canvas.height = pageHeight * totalPages;
    canvas.width = pageWidth;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each page
    for (let page = 0; page < totalPages; page++) {
      const pageY = page * pageHeight;
      
      // Page background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, pageY, pageWidth, pageHeight);
      
      // Header
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${user?.name || 'Employee'} - Timesheet`, 50, pageY + 80);
      
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.fillStyle = '#374151';
      ctx.fillText(`Email: ${user?.email || 'N/A'}`, 50, pageY + 120);
      ctx.fillText(`Period: All Records`, 50, pageY + 155);
      ctx.fillText(`Generated: ${new Date().toLocaleString()}`, 50, pageY + 190);

      // Records table header
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.fillText('Date', 50, pageY + 240);
      ctx.fillText('Clock In', 200, pageY + 240);
      ctx.fillText('Clock Out', 350, pageY + 240);
      ctx.fillText('Duration', 500, pageY + 240);

      // Records
      ctx.font = '18px Arial, sans-serif';
      ctx.fillStyle = '#374151';
      
      const startIndex = page * recordsPerPage;
      const endIndex = Math.min(startIndex + recordsPerPage, userRecords.length);
      
      for (let i = startIndex; i < endIndex; i++) {
        const record = userRecords[i];
        const y = pageY + 270 + ((i - startIndex) * lineHeight);
        
        const clockIn = new Date(record.clockIn).toLocaleString();
        const clockOut = record.clockOut 
          ? new Date(record.clockOut).toLocaleString() 
          : 'Ongoing';
        const duration = `${Math.floor(record.duration / 60)}h ${record.duration % 60}m`;
        const date = new Date(record.clockIn).toLocaleDateString();
        
        // Highlight ongoing sessions
        if (!record.clockOut) {
          ctx.fillStyle = '#dbeafe';
          ctx.fillRect(45, y - 20, pageWidth - 90, lineHeight - 2);
          ctx.fillStyle = '#1e40af';
          ctx.font = 'bold 18px Arial, sans-serif';
        } else {
          ctx.fillStyle = '#374151';
          ctx.font = '18px Arial, sans-serif';
        }
        
        ctx.fillText(`${i + 1}. ${date}`, 50, y);
        ctx.fillText(clockIn.slice(0, 16), 200, y);
        ctx.fillText(clockOut.slice(0, 16), 350, y);
        ctx.fillStyle = '#3b82f6';
        ctx.font = 'bold 18px Arial, sans-serif';
        ctx.fillText(duration, 500, y);
      }

      // Page footer
      ctx.fillStyle = '#6b7280';
      ctx.font = '16px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Page ${page + 1} of ${totalPages}`, pageWidth / 2, pageY + pageHeight - 40);
      ctx.textAlign = 'left';
    }

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${user?.name || 'employee'}_timesheet.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  // ✅ CANVAS PDF - BULK ALL EMPLOYEES
  const generateBulkPDF = () => {
    const filteredRecords = timeRecords
      .filter(record => {
        const user = users.find(u => u.id === record.userId);
        const matchesSearch = !searchTerm || 
          (user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user?.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesTeam = filterTeam === 'all' || record.teamId === filterTeam;
        return matchesSearch && matchesTeam;
      });

    if (filteredRecords.length === 0) {
      alert('No records match your filters');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const pageHeight = 1000;
    const pageWidth = 800;
    const recordsPerPage = 25;
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    
    canvas.height = pageHeight * totalPages;
    canvas.width = pageWidth;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let page = 0; page < totalPages; page++) {
      const pageY = page * pageHeight;
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, pageY, pageWidth, pageHeight);
      
      // Header
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 44px Arial, sans-serif';
      ctx.fillText('TeamFlow - All Timesheets', 50, pageY + 70);
      
      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.fillStyle = '#374151';
      ctx.fillText(`Total Records: ${filteredRecords.length}`, 50, pageY + 110);
      ctx.fillText(`Generated: ${new Date().toLocaleString()}`, 50, pageY + 140);

      // Table header
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.fillText('Employee', 50, pageY + 200);
      ctx.fillText('Team', 200, pageY + 200);
      ctx.fillText('Clock In', 300, pageY + 200);
      ctx.fillText('Duration', 450, pageY + 200);

      // Records
      ctx.font = '18px Arial, sans-serif';
      ctx.fillStyle = '#374151';
      
      const startIndex = page * recordsPerPage;
      const endIndex = Math.min(startIndex + recordsPerPage, filteredRecords.length);
      
      for (let i = startIndex; i < endIndex; i++) {
        const record = filteredRecords[i];
        const y = pageY + 230 + ((i - startIndex) * 22);
        const user = users.find(u => u.id === record.userId);
        const team = teams.find(t => t.id === record.teamId);
        
        const clockIn = new Date(record.clockIn).toLocaleString().slice(0, 16);
        const duration = `${Math.floor(record.duration / 60)}h ${record.duration % 60}m`;
        
        ctx.fillText(user?.name?.slice(0, 15) || 'Unknown', 50, y);
        ctx.fillText(team?.name?.slice(0, 12) || 'N/A', 200, y);
        ctx.fillText(clockIn, 300, y);
        ctx.fillStyle = '#3b82f6';
        ctx.font = 'bold 18px Arial, sans-serif';
        ctx.fillText(duration, 450, y);
      }

      // Page footer
      ctx.fillStyle = '#6b7280';
      ctx.font = '16px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Page ${page + 1} of ${totalPages}`, pageWidth / 2, pageY + pageHeight - 40);
      ctx.textAlign = 'left';
    }

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `teamflow_all_timesheets.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  // Filter records for table
  const filteredRecords = timeRecords
    .filter(record => {
      const user = users.find(u => u.id === record.userId);
      const matchesSearch = !searchTerm || 
        (user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user?.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesTeam = filterTeam === 'all' || record.teamId === filterTeam;
      return matchesSearch && matchesTeam;
    })
    .sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Timesheets</h1>
          <p className="text-gray-500 mt-1">
            {filteredRecords.length} records • Export to PDF instantly
          </p>
        </div>
        <Button 
          onClick={generateBulkPDF} 
          className="bg-green-600 hover:bg-green-700 w-full lg:w-auto flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download All ({filteredRecords.length})
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-6 rounded-2xl shadow-sm border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Teams</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Clock In
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map(record => {
                const user = users.find(u => u.id === record.userId);
                const team = teams.find(t => t.id === record.teamId);
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                          <span className="font-semibold text-white text-sm">
                            {user?.name?.[0] || '?'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                          <div className="text-sm text-gray-500">{user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {team?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.clockIn).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                        {Math.floor(record.duration / 60)}h {record.duration % 60}m
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        size="sm"
                        onClick={() => generateIndividualPDF(record.userId)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No timesheets found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or team filter</p>
        </div>
      )}
    </div>
  );
}
