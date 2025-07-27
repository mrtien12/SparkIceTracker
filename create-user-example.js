// Example script to create users - For Admin Use Only
// Run this script in Node.js environment with database access

import { createUserWithRandomPassword } from './server/admin-utils.js';

// Example usage:
async function createUser(username) {
  try {
    const result = await createUserWithRandomPassword({ username });
    
    console.log('✅ User created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Username:', result.user.username);
    console.log('🔑 Generated Password:', result.password);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Share this password securely with the user!');
    console.log('📝 The user should change this password after first login.');
    
    return result;
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    throw error;
  }
}

// Examples:
// createUser('john.doe');
// createUser('jane.smith');
// createUser('admin.user');

export { createUser };