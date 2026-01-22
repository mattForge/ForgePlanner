import React, { useState } from 'react';
import { Download, Search, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../hooks/useAuth';

export function Timesheets() {
  const { timeRecords, users, teams } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');

  // ✅ HTML DOWNLOAD - INDIVIDUAL EMPLOYEE (Adobe Compatible)
  const generateIndividualPDF = (userId: string) => {
    const userRecords = timeRecords.filter(r => r.userId === userId);
    const user = users.find(u => u.id === userId);
    
    if (userRecords.length === 0) {
      alert('No records found');
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${user?.name} Timesheet</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 40px; 
      line-height: 1.6;
      color: #1f2937;
    }
    .header { 
      border-bottom: 4px solid #3b82f6; 
      padding-bottom: 30px; 
      margin-bottom: 40px; 
    }
    .header h1 { 
      font-size: 36px; 
      font-weight: bold; 
      color: #1f2937; 
      margin-bottom: 10px; 
    }
    .header p { 
      font-size: 18px; 
      color: #374151; 
      margin: 5px 0; 
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-top: 20px; 
    }
    th { 
      background: #f3f4f6; 
      padding: 15px; 
      text-align: left; 
      font-weight: bold; 
      color: #1f2937; 
      border-bottom: 2px solid #e5e7eb; 
    }
    td { 
      padding: 12px 15px; 
      border-bottom: 1px solid #e5e7eb; 
      font-size: 16px; 
    }
    tr:hover { background: #f9fafb; }
    .ongoing { background: #dbeafe !important; font-weight: bold; }
    .duration { 
      font-weight: bold; 
      color: #3b82f6; 
      text-align: right; 
    }
    @media print { body { padding: 20px; } }
    @page { margin: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${user?.name || 'Employee'} Timesheet</h1>
    <p><strong>Email:</strong> ${user?.email || 'N/A'}</p>
    <p><strong>Total Records:</strong> ${userRecords.length}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Clock In</th>
        <th>Clock Out</th>
        <th>Duration</th>
      </tr>
    </thead>
    <tbody>
      ${userRecords.map((record, index) => {
        const isOngoing = !record.clockOut;
        return `
        <tr ${isOngoing ? 'class="ongoing"' : ''}>
          <td>${new Date(record.clockIn).toLocaleDateString()}</td>
          <td>${new Date(record.clockIn).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</td>
          <td>${isOngoing ? 'Ongoing' : new Date(record.clockOut!).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</td>
          <td class="duration">${Math.floor(record.duration / 60)}h ${record.duration % 60}m</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user?.name || 'employee'}_timesheet.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ✅ HTML DOWNLOAD - BULK ALL EMPLOYEES
  const generateBulkPDF = () => {
    const filteredRecords = timeRecords.filter(record => {
      const user = users.find(u => u.id === record.userId);
      return !searchTerm || 
        (user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user?.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterTeam === 'all' || record.teamId === filterTeam);
    });

    if (filteredRecords.length === 0) {
      alert('No records match filters');
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>TeamFlow - All Timesheets</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      max-width: 1000px; 
      margin: 0 auto; 
      padding: 40px; 
      line-height: 1.6;
      color: #1f2937;
    }
    .header { 
      border-bottom: 4px solid #3b82f6; 
      padding-bottom: 30px; 
      margin-bottom: 40px; 
    }
    .header h1 { 
      font-size: 36px; 
      font-weight: bold; 
      color: #1f2937; 
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-top: 20px; 
    }
    th { 
      background: #f3f4f6; 
      padding: 15px; 
      text-align: left; 
      font-weight: bold; 
      color: #1f2937; 
      border-bottom: 2px solid #e5e7eb; 
    }
    td { 
      padding: 12px 15px; 
      border-bottom: 1px solid #e5e7eb; 
      font-size: 16px; 
    }
    tr:hover { background: #f9fafb; }
    .duration { 
      font-weight: bold; 
      color: #3b82f6; 
      text-align: right; 
    }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>TeamFlow - Complete Timesheets</h1>
    <p><strong>Total Records:</strong> ${filteredRecords.length}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Employee</th>
        <th>Team</th>
        <th>Clock In</th>
        <th>Duration</th>
      </tr>
    </thead>
    <tbody>
      ${filteredRecords.slice(0, 100).map(record => {
        const user = users.find(u => u.id === record.userId);
        const team = teams.find(t => t.id === record.teamId);
        return `
        <tr>
          <td>${user?.name || 'Unknown'}</td>
          <td>${team?.name || 'N/A'}</td>
          <td>${new Date(record.clockIn).toLocaleString()}</td>
          <td class="duration">${Math.floor(record.duration / 60)}h ${record.duration % 60}m</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teamflow_all_timesheets.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter records
  const filteredRecords = timeRecords
    .filter(record => {
      const user = users.find(u => u.id === record.userId);
      return (!searchTerm || 
        (user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user?.email?.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (filterTeam === 'all' || record.teamId === filterTeam);
    })
    .sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Timesheets</h1>
          <p className="text-gray-500 mt-1">{filteredRecords.length} records found</p>
        </div>
        <Button 
          onClick={generateBulkPDF} 
          className="bg-green-600 hover:bg-green-700 w-full lg:w-auto flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download All ({filteredRecords.length})
        </Button>
      </div>

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

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Team</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Clock In</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
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
                          <span className="font-semibold text-white text-sm">{user?.name?.[0] || '?'}</span>
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

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
