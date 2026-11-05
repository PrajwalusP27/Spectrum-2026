export const sports = ['Volleyball', 'Throwball', 'Carrom'];
export function parseMembers(value) { return value.split(/\r?\n/).map((name) => name.trim()).filter(Boolean); }
export function validateRegistration(data) {
  const errors = {};
  if (!sports.includes(data.sport)) errors.sport = 'Choose a sport.';
  for (const key of ['collegeName', 'teamName', 'representativeName']) if (!data[key]?.trim()) errors[key] = 'This field is required.';
  if (!/^(?:\+?91)?[6-9]\d{9}$/.test((data.contactNumber || '').replace(/[\s()-]/g, ''))) errors.contactNumber = 'Enter a valid Indian mobile number.';
  const members = parseMembers(data.teamMembers || '');
  if (!members.length) errors.teamMembers = 'Enter at least one player name, one per line.';
  if (data.sport === 'Carrom' && members.length !== 2) errors.teamMembers = 'Carrom is a doubles event. Enter exactly two player names.';
  return errors;
}
