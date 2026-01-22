// src/contexts/DatabaseContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import initSqlJs from 'sql.js';
import { useCompany } from './CompanyContext';

const DatabaseContext = createContext<any>(null);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<any>(null);
  const [timeRecords, setTimeRecords] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();

  useEffect(() => {
    if (!currentCompany?.id) return;

    initSqlJs({ 
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    }).then((SQL) => {
      fetch(`/db/${currentCompany.id}.db`)
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
          const database = new SQL.Database(new Uint8Array(buffer));
          setDb(database);
          loadData(database);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Database load failed:', err);
          setLoading(false);
        });
    });
  }, [currentCompany?.id]);

  const loadData = (database: any) => {
    try {
      const timeRecordsResult = database.exec("SELECT * FROM time_records WHERE company_id = ? ORDER BY clock_in DESC", [currentCompany!.id]);
      const usersResult = database.exec("SELECT * FROM users WHERE company_id = ? ORDER BY name", [currentCompany!.id]);
      const teamsResult = database.exec("SELECT * FROM teams WHERE company_id = ?", [currentCompany!.id]);
      
      setTimeRecords(timeRecordsResult[0]?.values || []);
      setUsers(usersResult[0]?.values || []);
      setTeams(teamsResult[0]?.values || []);
    } catch (err) {
      console.error('Load data error:', err);
    }
  };

  const addTimeRecord = (record: any) => {
    if (!db || !currentCompany) return;
    try {
      const stmt = db.prepare(`
        INSERT INTO time_records (id, user_id, team_id, company_id, clock_in, clock_out, duration) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.bind([
        `tr-${Date.now()}`,
        record.user_id,
        record.team_id || null,
        currentCompany.id,
        record.clock_in,
        record.clock_out || null,
        record.duration || 0
      ]);
      stmt.step();
      stmt.free();
      loadData(db);
    } catch (err) {
      console.error('Add record error:', err);
    }
  };

  return (
    <DatabaseContext.Provider value={{
      timeRecords, users, teams, companies,
      addTimeRecord,
      loading
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase must be used within DatabaseProvider');
  return context;
};
