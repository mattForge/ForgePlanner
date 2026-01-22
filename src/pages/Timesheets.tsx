import React, { useState } from 'react';
import { Download, Search, FileText, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../hooks/useAuth';

declare global {
  interface Window {
    jsPDF: any;
  }
}

export function Timesheets() {
  const { timeRecords, users, teams } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');

  const filteredRecords = timeRecords
    .filter(record => {
      const user = users.find(u => u.id === record.userId);
      const matchesSearch = user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user?.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTeam = filterTeam === 'all' || record.teamId === filterTeam;
      return matchesSearch && matchesTeam;
    })
    .sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime());

  const generateIndividualPDF = (userId: string) => {
    const { jsPDF } = window;
    const userRecords = timeRecords.filter(r => r.userId === userId);
    const user = users.find(u => u.id === userId);
    
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`${user?.name || 'Employee'} Timesheet`, 20, 30);
    doc.setFontSize(12);
    doc.text(`Email: ${user?.email}`, 20, 45);
    
    let yPos = 60;
    userRecords.forEach((record, index) => {
      const clockIn = new Date(record.clockIn).toLocaleString();
      const clockOut = record.clockOut ? new Date(record.clockOut).toLocaleString() : 'Ongoing';
      const duration = `${Math.floor(record.duration / 60)}h ${record.duration % 60}m`;
      doc.text(`${index + 1}. ${clockIn} → ${clockOut} (${duration})`, 20, yPos);
      yPos += 10;
      if (yPos > 270) { doc.addPage(); yPos = 20; }
    });
    
    doc.save(`${user?.name}_timesheet.pdf`);
  };

  const generateBulkPDF = () => {
    const { jsPDF } = window;
    const doc = new jsPDF();
    let yPos = 30;
    
    doc.setFontSize(22);
    doc.text('TeamFlow - All Timesheets', 20, yPos);
    yPos += 20;
    
    filteredRecords.forEach(record => {
      const user = users.find(u => u.id === record.userId);
      const team = teams.find(t => t.id === record.teamId);
      const clockIn = new Date(record.clockIn).toLocaleString();
      const duration = `${Math.floor(record.duration / 60)}h ${record.duration % 60}m`;
      
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      doc.setFontSize(10);
      doc.text(`${user?.name} (${team?.name}) - ${clockIn} (${duration})`, 20, yPos);
      yPos += 8;
    });
    
    doc.save('teamflow_all_timesheets.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timesheets</h1>
          <p className="text-gray-500 mt-1">Manage employee timesheets & export PDFs</p>
        </div>
        <Button onClick={generateBulkPDF} className="bg-green-600 hover:bg-green-700 w-full lg:w-auto">
          <Download className="w-4 h-4 mr-2" /> Download All ({filteredRecords.length})
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 bg-white p-6 rounded-2xl shadow-sm border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Teams</option>
          {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Team</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Clock In</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Duration</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map(record => {
                const user = users.find(u => u.id === record.userId);
                const team = teams.find(t => t.id === record.teamId);
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                          <span className="font-semibold text-white text-sm">{user?.name?.[0]}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user?.name}</div>
                          <div className="text-sm text-gray-500">{user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{team?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(record.clockIn).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {Math.floor(record.duration / 60)}h {record.duration % 60}m
                    </td>
                    <td className="px-6 py-4 text-right">
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
    </div>
  );
}
