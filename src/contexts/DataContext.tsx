import React, { useEffect, useState, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

// ✅ UPDATED: Added 'hr' role
export type Role = 'admin' | 'member' | 'hr';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role; // ✅ Now supports 'hr'
  teamIds: string[];
  avatar?: string;
  requiresPasswordChange?: boolean;
  oneTimePassword?: string | null;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigneeId: string;
  teamId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
}

export interface TimeRecord {
  id: string;
  userId: string;
  teamId: string;
  clockIn: string;
  clockOut: string | null;
  duration: number; // in minutes
}

interface DataContextType {
  users: User[];
  teams: Team[];
  tasks: Task[];
  timeRecords: TimeRecord[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  deleteTeam: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addTimeRecord: (record: Omit<TimeRecord, 'id'>) => void;
  updateTimeRecord: (id: string, updates: Partial<TimeRecord>) => void;
  getUsersByTeam: (teamId: string) => User[];
  getTasksByTeam: (teamId: string) => Task[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock Data - ADDED HR USER + SAMPLE TIME RECORDS
const SEED_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'Engineering',
    description: 'Core product development',
    createdAt: new Date().toISOString()
  },
  {
    id: 'team-2',
    name: 'Marketing',
    description: 'Growth and brand awareness',
    createdAt: new Date().toISOString()
  },
  {
    id: 'team-3',
    name: 'Design',
    description: 'UI/UX and brand assets',
    createdAt: new Date().toISOString()
  }
];

const SEED_USERS: User[] = [
  // Admin Users
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
    teamIds: ['team-1', 'team-2', 'team-3']
  },
  {
    id: 'user-5',
    name: 'Matt Coombes',
    email: 'mattcoombes247@gmail.com',
    password: 'password',
    role: 'admin',
    teamIds: ['team-1', 'team-2', 'team-3']
  },
  // ✅ NEW HR USER
  {
    id: 'user-6',
    name: 'HR Manager',
    email: 'hr@example.com',
    password: 'password',
    role: 'hr' as Role,  // ✅ HR ROLE
    teamIds: ['team-1', 'team-2', 'team-3']
  },
  // Member Users
  {
    id: 'user-2',
    name: 'Alex Developer',
    email: 'alex@example.com',
    password: 'password',
    role: 'member',
    teamIds: ['team-1']
  },
  {
    id: 'user-3',
    name: 'Sarah Designer',
    email: 'sarah@example.com',
    password: 'password',
    role: 'member',
    teamIds: ['team-3']
  },
  {
    id: 'user-4',
    name: 'Mike Marketer',
    email: 'mike@example.com',
    password: 'password',
    role: 'member',
    teamIds: ['team-2']
  }
];

const SEED_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Update Authentication',
    description: 'Implement JWT',
    assigneeId: 'user-2',
    teamId: 'team-1',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-03-01',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'Q1 Campaign',
    description: 'Plan social media',
    assigneeId: 'user-4',
    teamId: 'team-2',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-03-10',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'Design System',
    description: 'Update color palette',
    assigneeId: 'user-3',
    teamId: 'team-3',
    status: 'done',
    priority: 'high',
    dueDate: '2024-02-20',
    createdAt: new Date().toISOString()
  }
];

// ✅ NEW: Sample Time Records for PDF testing
const SEED_TIME_RECORDS: TimeRecord[] = [
  {
    id: 'time-1',
    userId: 'user-2',
    teamId: 'team-1',
    clockIn: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8h ago
    clockOut: new Date().toISOString(),
    duration: 480 // 8 hours
  },
  {
    id: 'time-2',
    userId: 'user-3',
    teamId: 'team-3',
    clockIn: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6h ago
    clockOut: new Date().toISOString(),
    duration: 360 // 6 hours
  },
  {
    id: 'time-3',
    userId: 'user-4',
    teamId: 'team-2',
    clockIn: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7h ago
    clockOut: null, // Ongoing
    duration: 420 // 7 hours so far
  },
  {
    id: 'time-4',
    userId: 'user-2',
    teamId: 'team-1',
    clockIn: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
    clockOut: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    duration: 180 // 3 hours
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('tf_users');
    return stored ? JSON.parse(stored) : SEED_USERS;
  });
  
  const [teams, setTeams] = useState<Team[]>(() => {
    const stored = localStorage.getItem('tf_teams');
    return stored ? JSON.parse(stored) : SEED_TEAMS;
  });
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem('tf_tasks');
    return stored ? JSON.parse(stored) : SEED_TASKS;
  });
  
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>(() => {
    const stored = localStorage.getItem('tf_timeRecords');
    return stored ? JSON.parse(stored) : SEED_TIME_RECORDS; // ✅ Uses new sample data
  });

  // Persistence
  useEffect(() => localStorage.setItem('tf_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('tf_teams', JSON.stringify(teams)), [teams]);
  useEffect(() => localStorage.setItem('tf_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('tf_timeRecords', JSON.stringify(timeRecords)), [timeRecords]);

  // Actions (unchanged)
  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: uuidv4() };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(users.map((u) => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const addTeam = (team: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam = { ...team, id: uuidv4(), createdAt: new Date().toISOString() };
    setTeams([...teams, newTeam]);
  };

  const deleteTeam = (id: string) => {
    setTeams(teams.filter((t) => t.id !== id));
    setUsers(users.map((u) => ({
      ...u,
      teamIds: u.teamIds.filter((tid) => tid !== id)
    })));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = { ...task, id: uuidv4(), createdAt: new Date().toISOString() };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const addTimeRecord = (record: Omit<TimeRecord, 'id'>) => {
    const newRecord = { ...record, id: uuidv4() };
    setTimeRecords([...timeRecords, newRecord]);
  };

  const updateTimeRecord = (id: string, updates: Partial<TimeRecord>) => {
    setTimeRecords(timeRecords.map((r) => r.id === id ? { ...r, ...updates } : r));
  };

  const getUsersByTeam = (teamId: string) => {
    return users.filter((u) => u.teamIds.includes(teamId));
  };

  const getTasksByTeam = (teamId: string) => {
    return tasks.filter((t) => t.id === teamId);
  };

  return (
    <DataContext.Provider
      value={{
        users,
        teams,
        tasks,
        timeRecords,
        addUser,
        updateUser,
        deleteUser,
        addTeam,
        deleteTeam,
        addTask,
        updateTask,
        deleteTask,
        addTimeRecord,
        updateTimeRecord,
        getUsersByTeam,
        getTasksByTeam
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
