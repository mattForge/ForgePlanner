import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useData, Role, User } from '../../contexts/DataContext';
interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}
export function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    teamId: user.teamIds[0] || ''
  });
  const { updateUser, teams } = useData();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(user.id, {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      teamIds: [formData.teamId]
    });
    onClose();
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose} />

          <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          exit={{
            opacity: 0,
            scale: 0.95
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Edit User</h2>
                <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600">

                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value
                  })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />

                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value
                  })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />

                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                    value={formData.role}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as Role
                    })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">

                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Team
                    </label>
                    <select
                    required
                    value={formData.teamId}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      teamId: e.target.value
                    })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">

                      <option value="">Select Team</option>
                      {teams.map((team) =>
                    <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                    )}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}