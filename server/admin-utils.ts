import { storage } from "./storage";
import { generateRandomPassword } from "./auth";
import { type CreateUserRequest } from "@shared/schema";

/**
 * Admin utility to create a new user with a randomly generated password
 * This should be run manually by admins to create user accounts
 */
export async function createUserWithRandomPassword(userData: CreateUserRequest): Promise<{ user: any; password: string }> {
  try {
    // Check if user already exists
    const existingUser = await storage.getUserByUsername(userData.username);
    if (existingUser) {
      throw new Error(`User with username '${userData.username}' already exists`);
    }

    // Generate random password
    const plainPassword = generateRandomPassword(12);

    // Create user with plain text password
    const user = await storage.createUser({
      username: userData.username,
      password: plainPassword
    });

    // Return user and plain password
    return {
      user: {
        id: user.id,
        username: user.username
      },
      password: plainPassword
    };
  } catch (error) {
    throw error;
  }
}

/**
 * List all users (admin function)
 */
export async function listAllUsers() {
  // Note: This would need to be implemented in storage if needed
  // For now, admins can query the database directly
  console.log("Use SQL query to list users: SELECT id, username FROM users;");
}

/**
 * Example usage for admin:
 * 
 * To create a new user:
 * ```javascript
 * import { createUserWithRandomPassword } from './server/admin-utils';
 * 
 * createUserWithRandomPassword({ username: "john.doe" })
 *   .then(result => {
 *     console.log("User created:");
 *     console.log("Username:", result.user.username);
 *     console.log("Generated Password:", result.password);
 *     console.log("IMPORTANT: Share this password securely with the user!");
 *   })
 *   .catch(error => console.error("Error:", error.message));
 * ```
 */