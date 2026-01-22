import React, { useState, useRef } from 'react';
import { Download, Search, FileText, Calendar, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../hooks/useAuth';

export function Timesheets() {
  const { timeRecords, users, teams } = useData();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');
  const individualRef = useRef<HTMLDivElement>(null);
  const bulkRef = useRef<HTMLDivElement>(null);

  // ✅ ADOBE-COMPATIBLE PDF - INDIVIDUAL
  const generateIndividualPDF = async (userId: string) => {
    const userRecords = timeRecords.filter(r => r.userId === userId);
    const user = users.find(u => u.id === userId);
    
    if (userRecords.length === 0) {
      alert('No time records for this employee');
      return;
    }

    try {
      // Create temporary HTML for canvas
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
          <h1 style="font-size: 36px; font-weight: bold; color: #1f2937; margin: 0;">${user?.name} Timesheet</h1>
          <p style="font-size: 18px; color: #374151; margin: 10px 0;">Email: ${user?.email}</p>
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
      
      // Convert to canvas → PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      // Create REAL PDF
      const { jsPDF } = window.jspdf;
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * 208 / canvas.width);
      const pageHeight = 295;
      let heightLeft = imgHeight;
      let position = 0;
      
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(imgData, 'PNG', 10, 10, 190, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, 190, imgHeight);
        heightLeft -= pageHeight;
      }
      
      doc.save(`${user?.name}_timesheet.pdf`);
      document.body.removeChild(tempDiv);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed. Try refreshing the page.');
    }
  };

  // ✅ BULK PDF
  const generateBulkPDF = async () => {
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
          <h1 style="font-size: 36px; font-weight: bold; color: #1f2937; margin: 0;">TeamFlow Timesheets</h1>
          <p style="font-size: 18px; color: #374151; margin: 10px 0;">All Employee Records</p>
          <p style="font-size: 16px; color: #6b7280; margin: 5px 0;">Total: ${filteredRecords.length} records | Generated: ${new Date().toLocaleString()}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 15px; text-align: left; font-weight: bold; color: #1f2937;">Employee</th>
              <th style="padding: 15px; text-align: left; font-weight: bold; color: #1f2937;">Team</th>
              <th style="padding: 15px; text-align: left; font-weight: bold; color: #1f2937;">Clock In</th>
              <th style="padding: 15px; text-align: right; font-weight: bold; color: #1f2937;">Duration</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords.slice(0, 50).map(record => {
              const user = users.find(u => u.id === record.userId);
              const team = teams.find(t => t.id === record.teamId);
              return `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px; font-size: 16px;">${user?.name || 'Unknown'}</td>
                  <td style="padding: 12px; font-size: 16px;">${team?.name || 'N/A'}</td>
                  <td style="padding: 12px; font-size: 16px;">${new Date(record.clockIn).toLocaleString()}</td>
                  <td style="padding: 12px; font-size: 16px; font-weight: bold; color: #3b82f6; text-align: right;">
                    ${Math.floor(record.duration / 60)}h ${record.duration % 60}m
                  </td>
                </tr>
              `;
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
      let heightLeft = imgHeight;
      
      const doc = new jsPDF('p', 'mm', 'a4');
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
      alert('Bulk PDF generation failed');
    }
  };

  // Filter logic (same as before)
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
      {/* Header + Bulk Download */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Timesheets</h1>
          <p className="text-gray-500 mt-1">Download employee timesheets as PDF</p>
        </div>
        <Button onClick={generateBulkPDF} className="bg-green-600 hover:bg-green-700 w-full lg:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Download All ({filteredRecords.length})
        </Button>
      </div>

      {/* Filters */}
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

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Team</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Clock In</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Duration</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
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
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to
