import { ProfileData } from "lemmy-js-client";

/**
 * Utility functions for working with ProfileData
 */

/**
 * Get the username from ProfileData
 * @param profileData The user's profile data
 * @returns The username, preferring person.name if available
 */
export function getUsername(profileData: ProfileData): string {
  return profileData.person?.name || "";
}

/**
 * Get the display name from ProfileData
 * @param profileData The user's profile data
 * @returns The display name, preferring person.displayName if available
 */
export function getDisplayName(profileData: ProfileData): string | undefined {
  return profileData.person?.displayName || "";
}

/**
 * Get the avatar URL from ProfileData
 * @param profileData The user's profile data
 * @returns The avatar URL, preferring person.avatar if available
 */
export function getAvatarUrl(profileData: ProfileData): string | undefined {
  return profileData.person?.avatar || "";
}

/**
 * Get the bio from ProfileData
 * @param profileData The user's profile data
 * @returns The bio, preferring person.bio if available
 */
export function getBio(profileData: ProfileData): string | null | undefined {
  return profileData.person?.bio || profileData.person.bio;
}

/**
 * Get the email from ProfileData
 * @param profileData The user's profile data
 * @returns The email, preferring localUser.email if available
 */
export function getEmail(profileData: ProfileData): string | undefined {
  return profileData.localUser?.email || profileData.contact.email;
}

/**
 * Check if the user's email is verified
 * @param profileData The user's profile data
 * @returns Whether the email is verified, preferring localUser.emailVerified if available
 */
export function isEmailVerified(profileData: ProfileData): boolean {
  return profileData.localUser?.emailVerified ?? false;
}

/**
 * Check if the user is an admin
 * @param profileData The user's profile data
 * @returns Whether the user is an admin
 */
export function isAdmin(profileData: ProfileData): boolean {
  return profileData.localUser?.admin ?? false;
}

/**
 * Get the user's role
 * @param profileData The user's profile data
 * @returns The user's role
 */
export function getRole(profileData: ProfileData): string {
  // Return a default role or empty string as roles property is not available in the new structure
  return "";
}