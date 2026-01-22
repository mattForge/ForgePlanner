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

  // ✅ ADOBE-COMPATIBLE PDF - INDIVIDUAL EMPLOYEE
  const generateIndividualPDF = async (userId: string) => {
    const userRecords = timeRecords.filter(r => r.userId === userId);
    const user = users.find(u => u.id === userId);
    
    if (userRecords.length === 0) {
      alert('No time records for this employee');
      return;
    }

    try {
      // Create temporary HTML for PDF
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '40px';
      tempDiv.style.background = '#fff';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      tempDiv.innerHTML = `
        <div style="border-bottom: 4px solid #3b82f6; padding-bottom: 30px; margin-bottom: 40px;">
          <h1 style="font-size: 36px; font-weight: bold; color: #1f2937; margin: 0;">${user?.name || 'Employee'} Timesheet</h1>
          <p style="font-size: 18px; color: #374151; margin: 10px 0;">Email: ${user?.email || 'N/A'}</p>
          <p style="font-size: 16px; color: #6b7280; margin: 5px 0;">Generated: ${new Date().toLocaleString()}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 15px; text-align: left; font-weight: bold; color: #1f2937;">Date</th>
              <th style="padding: 15px; text-align: left; font-weight: bold; color: #1f2937;">Clock In</th>
              <th style="padding: 15px; text-align: left; font-weight: bold; color: #1f2937;">Clock Out</th>
              <th style="padding: 15px; text-align: right; font-weight: bold; color: #1f2937;">Duration</th>
            </tr>
          </thead>
          <tbody>
            ${userRecords.map((record, index) => `
              <tr style="border-bottom: 1px solid #e5e7eb; ${!record.clockOut ? 'background: #dbeafe;' : ''}">
                <td style="padding: 12px; font-size: 16px;">${new Date(record.clockIn).toLocaleDateString()}</td>
                <td style="padding: 12px; font-size: 16px;">${new Date(record.clockIn).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</td>
                <td style="padding: 12px; font-size: 16px;">${record.clockOut ? new Date(record.clockOut).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : 'Ongoing'}</td>
                <td style="padding: 12px; font-size: 16px; font-weight: bold; color: #3b82f6; text-align: right;">
                  ${Math.floor(record.duration / 60)}h ${record.duration % 60}m
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      document.body.appendChild(tempDiv);
      
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const { jsPDF } = window.jspdf;
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * 208 / canvas.width);
      const pageHeight = 295;
      let heightLeft = imgHeight;
      let position = 0;
      
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(imgData, 'PNG', 10, position, 190, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, 190, imgHeight);
        heightLeft -= pageHeight;
      }
      
      doc.save(`${user?.name || 'employee'}_timesheet.pdf`);
      document.body.removeChild(tempDiv);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed. Try again.');
    }
  };

  // ✅ BULK PDF - ALL EMPLOYEES
  const generateBulkPDF = async () => {
    const filteredRecords = timeRecords.filter(record => {
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

    try {
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '40px';
      tempDiv.style.background = '#fff';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      tempDiv.innerHTML = `
        <div style="border-bottom: 4px solid #3b82f6; padding-bottom: 30px; margin-bottom: 40px;">
          <h1 style="font-size: 36px; font-weight: bold; color: #1f2937;">TeamFlow - All Timesheets</h1>
          <p style="font-size: 18px; color: #374151;">Complete Employee Records</p>
          <p style="font-size: 16px; color: #6b7280;">Total: ${filteredRecords.length} records | ${new Date().toLocaleString()}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead><tr style="background: #f3f4f6;">
            <th style="padding: 15px; text-align: left; font-weight: bold; color: #1f2937;">Employee</th>
            <th style="padding: 15px; text-align: left; font-weight: bold; color: #1f2937;">Team</th>
            <th style="padding: 15px; text-align: left; font-weight: bold; color: #1f2937;">Clock In</th>
            <th style="padding: 15px; text-align: right; font-weight: bold; color: #1f2937;">Duration</th>
          </tr></thead>
          <tbody>
            ${filteredRecords.slice(0, 50).map(record => {
              const user = users.find(u => u.id === record.userId);
              const team = teams.find(t => t.id === record.teamId);
              return `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px;">${user?.name || 'Unknown'}</td>
                  <td style="padding: 12px;">${team?.name || 'N/A'}</td>
                  <td style="padding: 12px;">${new Date(record.clockIn).toLocaleString()}</td>
                  <td style="padding: 12px; font-weight: bold; color: #3b82f6; text-align: right;">
                    ${Math.floor(record.duration / 60)}h ${record.duration % 60}m
                  </td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      `;
      
      document.body.appendChild(tempDiv);
      
      const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true });
      const { jsPDF } = window.jspdf;
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * 208 / canvas.width);
      const pageHeight = 295;
      
      const doc = new jsPDF('p', 'mm', 'a4');
      let heightLeft = imgHeight;
      let position = 0;
      
      doc.addImage(imgData, 'PNG', 10, position, 190, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, 190, imgHeight);
        heightLeft -= pageHeight;
      }
      
      doc.save('teamflow_all_timesheets.pdf');
      document.body.removeChild(tempDiv);
      
    } catch (error) {
      console.error('Bulk PDF failed:', error);
      alert('Bulk PDF failed. Try again.');
    }
  };

  // Filter records
  const filteredRecords = timeRecords
    .filter(record => {
      const user = users.find(u => u.id === record.userId);
      const matchesSearch = !searchTerm || 
        (user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user?.email?.toLowerCase().includes(searchTerm.toLowerCase()));
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
            {filteredRecords.length} records • PDF export ready
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
