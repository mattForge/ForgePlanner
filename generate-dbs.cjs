// generate-dbs.cjs - SIMPLE & RELIABLE
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const companies = [
  { id: 'global', name: 'Global Admin', users: [{ id: 'global-admin', name: 'Matt Coombes', email: 'mattcoombes247@gmail.com', role: 'superadmin' }] },
  { id: 'forge-academy', name: 'The Forge Academy', users: [{ id: 'forge-hr', name: 'Forge HR', email: 'hr@forge-academy.com', role: 'hr' }] }
];

companies.forEach(company => {
  console.log(`📝 Creating ${company.id}.db...`);
  
  const db = new Database(path.join('public', 'db', `${company.id}.db`));
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (id TEXT PRIMARY KEY, name TEXT, domain TEXT, is_global INTEGER);
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE, role TEXT, company_id TEXT);
    CREATE TABLE IF NOT EXISTS teams (id TEXT PRIMARY KEY, name TEXT, company_id TEXT);
    CREATE TABLE IF NOT EXISTS time_records (id TEXT PRIMARY KEY, user_id TEXT, team_id TEXT, company_id TEXT, clock_in TEXT, clock_out TEXT, duration INTEGER);
  `);
  
  // Insert data
  db.prepare('INSERT OR IGNORE INTO companies VALUES (?, ?, ?, ?)').run([company.id, company.name, company.id + '.com', company.id === 'global' ? 1 : 0]);
  company.users.forEach(user => {
    db.prepare('INSERT OR IGNORE INTO users VALUES (?, ?, ?, ?, ?)').run([user.id, user.name, user.email, user.role, company.id]);
  });
  
  console.log(`✅ Created ${company.id}.db`);
  db.close();
});

console.log('🎉 DONE!');
