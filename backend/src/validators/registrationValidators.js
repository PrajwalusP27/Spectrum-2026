import { body, param } from 'express-validator';

const phonePattern = /^(?:\+?91)?[6-9]\d{9}$/;
export const registrationRules = [
  body('sport').trim().isIn(['Volleyball', 'Throwball', 'Carrom']).withMessage('Choose Volleyball, Throwball or Carrom.'),
  body('collegeName').trim().isLength({ min: 2, max: 120 }).withMessage('College name must be 2 to 120 characters.'),
  body('teamName').trim().isLength({ min: 1, max: 100 }).withMessage('Team name is required and must be under 100 characters.'),
  body('representativeName').trim().isLength({ min: 2, max: 100 }).withMessage('Representative name must be 2 to 100 characters.'),
  body('contactNumber').trim().custom((value) => phonePattern.test(value.replace(/[\s()-]/g, ''))).withMessage('Enter a valid Indian mobile number.'),
  body('teamMembers').custom((value, { req }) => {
    if (!Array.isArray(value)) throw new Error('Enter team member names as a list.');
    const members = value.map((name) => typeof name === 'string' ? name.trim() : '');
    if (members.some((name) => !name)) throw new Error('Every team member must have a name.');
    if (!members.length) throw new Error('Enter at least one team member.');
    if (members.some((name) => name.length > 100)) throw new Error('Each team member name must be under 100 characters.');
    if (req.body.sport === 'Carrom' && members.length !== 2) throw new Error('Carrom is a doubles event. Exactly two players are required.');
    req.body.teamMembers = members;
    return true;
  })
];
export const registrationIdRule = [param('registrationId').trim().matches(/^SP26-[A-F0-9]{10}$/).withMessage('Invalid registration ID.')];
