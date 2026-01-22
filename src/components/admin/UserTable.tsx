import React, { useState } from 'react';
import { User, Team, useData } from '../../contexts/DataContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Trash2, Edit2, KeyRound } from 'lucide-react';
import { EditUserModal } from './EditUserModal';
interface UserTableProps {
  users: User[];
  teams: Team[];
}
export function UserTable({ users, teams }: UserTableProps) {
  const { deleteUser, updateUser } = useData();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const getTeamName = (teamIds: string[]) => {
    if (!teamIds.length) return 'No Team';
    const team = teams.find((t) => t.id === teamIds[0]);
    return team ? team.name : 'Unknown Team';
  };
  const handleResetPassword = (user: User) => {
    if (
    confirm(
      `Reset password for ${user.name}? They will receive a one-time password.`
    ))
    {
      // Generate a simple OTP (in production, this would be more secure)
      const otp = `${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
      updateUser(user.id, {
        oneTimePassword: otp,
        requiresPasswordChange: true
      });
      // Show OTP to admin (in production, this would be emailed)
      alert(
        `Password reset successful!\n\nOne-Time Password: ${otp}\n\nPlease share this with ${user.name}. They will be required to change their password on next login.`
      );
    }
  };
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-6 text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="py-4 px-6 text-sm font-medium text-gray-500">
                Email
              </th>
              <th className="py-4 px-6 text-sm font-medium text-gray-500">
                Role
              </th>
              <th className="py-4 px-6 text-sm font-medium text-gray-500">
                Team
              </th>
              <th className="py-4 px-6 text-sm font-medium text-gray-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) =>
            <tr
              key={user.id}
              className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">

                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        {user.name}
                      </span>
                      {user.requiresPasswordChange &&
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                          Password Reset Required
                        </span>
                    }
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="py-4 px-6">
                  <Badge variant={user.role === 'admin' ? 'purple' : 'blue'}>
                    {user.role}
                  </Badge>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {getTeamName(user.teamIds)}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                    onClick={() => setEditingUser(user)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit user">

                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                    onClick={() => handleResetPassword(user)}
                    className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                    title="Reset password">

                      <KeyRound className="w-4 h-4" />
                    </button>
                    <button
                    onClick={() => {
                      if (
                      confirm('Are you sure you want to delete this user?'))
                      {
                        deleteUser(user.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete user">

                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingUser &&
      <EditUserModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser} />

      }
    </>);

}