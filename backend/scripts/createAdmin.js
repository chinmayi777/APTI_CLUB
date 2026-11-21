import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import db from '../config/db.js';

dotenv.config();

const rl = readline.createInterface({ input, output });

async function createAdmin() {
  try {
    const [existingAdmins] = await db.execute(
      "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
    );

    if (existingAdmins.length > 0) {
      console.log('An Admin account already exists. Setup stopped.');
      return;
    }

    const fullName = (await rl.question('Admin full name: ')).trim();
    const email = (await rl.question('Admin email: ')).trim().toLowerCase();
    const password = await rl.question('Admin password: ');

    if (!fullName || !email || password.length < 8) {
      console.log('Enter a name, valid email and password of at least 8 characters.');
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await db.execute(
      `INSERT INTO users
       (full_name, email, password_hash, role)
       VALUES (?, ?, ?, 'admin')`,
      [fullName, email, passwordHash]
    );

    console.log('Admin account created successfully!');
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('This email is already registered.');
    } else {
      console.error('Admin creation failed:', error.message);
    }
  } finally {
    rl.close();
    await db.end();
  }
}

createAdmin();
