// generate-dbs.cjs - DEBUG VERSION WITH ERROR HANDLING
const sql = require('sql.js');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking sql.js import...');
console.log('sql.js:', sql);
console.log('sql.default:', sql.default);

try {
  const SQL = sql.default || sql;
  console.log('✅ SQL initialized:', SQL.Database ? 'YES' : 'NO');

  const schema = `
PRAGMA foreign_keys = ON;
CREATE TABLE companies (id TEXT PRIMARY KEY, name TEXT NOT NULL, domain TEXT UNIQUE, is_global INTEGER DEFAULT 0);
CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, role TEXT, company_id TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE teams (id TEXT PRIMARY KEY, name TEXT NOT NULL, company_id TEXT NOT NULL);
CREATE TABLE time_records (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, team_id TEXT, company_id TEXT NOT NULL, clock_in DATETIME NOT NULL, clock_out DATETIME, duration INTEGER DEFAULT 0);
  `;

  const companies = [
    { id: 'global', name: 'Global Admin', users: [{ id: 'global-admin', name: 'Matt Coombes', email: 'mattcoombes247@gmail.com', role: 'superadmin' }] },
    { id: 'forge-academy', name: 'The Forge Academy', users: [{ id: 'forge-hr', name: 'Forge HR', email: 'hr@forge-academy.com', role: 'hr' }] }
  ];

  companies.forEach(companyData => {
    try {
      console.log(`📝 Creating ${companyData.id}.db...`);
      const db = new SQL.Database();
      db.run(schema);
      db.run("INSERT INTO companies VALUES (?, ?, ?, ?)", [companyData.id, companyData.name, companyData.id + '.com', 0]);
      
      companyData.users.forEach(user => {
        db.run("INSERT INTO users VALUES (?, ?, ?, ?, ?)", [user.id, user.name, user.email, user.role, companyData.id]);
      });

      const dbBytes = db.export();
      const dbPath = path.join('public', 'db', `${companyData.id}.db`);
      fs.writeFileSync(dbPath, Buffer.from(dbBytes));
      console.log(`✅ SAVED ${companyData.id}.db (${dbBytes.length} bytes)`);
      db.close();
    } catch (err) {
      console.error(`❌ FAILED ${companyData.id}:`, err.message);
    }
  });

  console.log('🎉 All databases created!');
} catch (error) {
  console.error('💥 FATAL ERROR:', error.message);
  console.error('Stack:', error.stack);
}
