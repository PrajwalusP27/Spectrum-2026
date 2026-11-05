
import mongoose from 'mongoose';

const sports = ['Volleyball', 'Throwball', 'Carrom'];

const registrationSchema = new mongoose.Schema({
  registrationId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  sport: {
    type: String,
    required: true,
    enum: sports,
    index: true
  },
  sportNormalized: {
    type: String,
    required: true
  },
  collegeName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  collegeNameNormalized: {
    type: String,
    required: true
  },
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  representativeName: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  teamMembers: {
    type: [{ type: String, trim: true, required: true }],
    required: true,
    validate: {
      validator: (members) =>
        members.length > 0 &&
        members.every((member) => member.length > 0),
      message: 'Every team member must have a name.'
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

registrationSchema.index({ sportNormalized: 1 });
registrationSchema.index({ collegeNameNormalized: 1 });
registrationSchema.index({ createdAt: -1 });

registrationSchema.pre('validate', function validateCarrom() {
  if (this.sport === 'Carrom' && this.teamMembers?.length !== 2) {
    this.invalidate(
      'teamMembers',
      'Carrom is a doubles event. Exactly two players are required.'
    );
  }
});

export default mongoose.model('Registration', registrationSchema);
