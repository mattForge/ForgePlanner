// generate-dbs.cjs - FIXED for Node.js sql.js
const sql = require('sql.js');
const fs = require('fs');
const path = require('path');

const schema = `
PRAGMA foreign_keys = ON;

CREATE TABLE companies (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, domain TEXT UNIQUE, is_global INTEGER DEFAULT 0
);

CREATE TABLE users (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, 
  role TEXT CHECK(role IN ('member', 'hr', 'admin', 'superadmin')), 
  company_id TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE teams (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, company_id TEXT NOT NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE time_records (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL, team_id TEXT, company_id TEXT NOT NULL,
  clock_in DATETIME NOT NULL, clock_out DATETIME, duration INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
`;

const companies = [
  { 
    id: 'global', 
    name: 'Global Admin', 
    users: [
      { id: 'global-admin', name: 'Matt Coombes', email: 'mattcoombes247@gmail.com', role: 'superadmin' }
    ], 
    teams: [], 
    timeRecords: [] 
  },
  
  { 
    id: 'forge-academy', 
    name: 'The Forge Academy', 
    users: [
      { id: 'forge-hr', name: 'Forge HR Manager', email: 'hr@forge-academy.com', role: 'hr' },
      { id: 'forge-member1', name: 'Forge Employee 1', email: 'employee1@forge-academy.com', role: 'member' },
      { id: 'forge-member2', name: 'Forge Employee 2', email: 'employee2@forge-academy.com', role: 'member' }
    ], 
    teams: [
      { id: 'forge-team-1', name: 'Teaching Team' },
      { id: 'forge-team-2', name: 'Admin Team' }
    ], 
    timeRecords: [
      { id: 'tr1', user_id: 'forge-hr', team_id: 'forge-team-1', clock_in: '2026-01-20 09:00:00', clock_out: '2026-01-20 17:30:00', duration: 450 },
      { id: 'tr2', user_id: 'forge-member1', team_id: 'forge-team-1', clock_in: '2026-01-20 08:30:00', clock_out: '2026-01-20 16:45:00', duration: 495 }
    ]
  }
];

async function createDB(companyData) {
  // FIX: Initialize SQL properly for Node.js
  const SQL = sql.default ? sql.default : sql;
  const db = new SQL.Database();
  
  db.run(schema);
  
  // Insert company
  db.run("INSERT INTO companies (id, name, domain, is_global) VALUES (?, ?, ?, ?)", 
    [companyData.id, companyData.name, companyData.id + '.com', companyData.id === 'global' ? 1 : 0]);
  
  // Insert users
  companyData.users.forEach(user => {
    db.run("INSERT INTO users (id, name, email, role, company_id) VALUES (?, ?, ?, ?, ?)", 
      [user.id, user.name, user.email, user.role, companyData.id]);
  });
  
  // Insert teams
  companyData.teams.forEach(team => {
    db.run("INSERT INTO teams (id, name, company_id) VALUES (?, ?, ?)", 
      [team.id, team.name, companyData.id]);
  });
  
  // Insert time records
  companyData.timeRecords.forEach(record => {
    db.run("INSERT INTO time_records (id, user_id, team_id, company_id, clock_in, clock_out, duration) VALUES (?, ?, ?, ?, ?, ?, ?)", 
      [record.id, record.user_id, record.team_id || null, companyData.id, record.clock_in, record.clock_out || null, record.duration || 0]);
  });
  
  const dbBytes = db.export();
  const dbDir = path.join('public', 'db');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  
  fs.writeFileSync(path.join(dbDir, `${companyData.id}.db`), Buffer.from(dbBytes));
  console.log(`✅ Created ${companyData.id}.db`);
  db.close();
}

companies.forEach(company => {
  createDB(company);
});

console.log('🎉 All databases created!');
