import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../contexts/DataContext';
interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { addTeam } = useData();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTeam({
      name,
      description,
      memberIds: []
    });
    setName('');
    setDescription('');
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
                <h2 className="text-lg font-bold text-gray-900">
                  Create New Team
                </h2>
                <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600">

                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Team Name
                  </label>
                  <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g. Marketing" />

                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-24 resize-none"
                  placeholder="What does this team do?" />

                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Team</Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}