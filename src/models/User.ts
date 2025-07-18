import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Change this interface to not extend mongoose.Document directly
export interface IUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  bio?: string;
  role: 'owner' | 'renter' | 'broker' | 'admin';
  avatar?: string;
  notifications: {
    email: {
      marketing: boolean;
      newMessages: boolean;
      propertyUpdates: boolean;
      accountAlerts: boolean;
    };
    push: {
      newMessages: boolean;
      propertyUpdates: boolean;
      accountAlerts: boolean;
    };
  };
  privacy: {
    showPhone: boolean;
    showEmail: boolean;
    profileVisibility: 'public' | 'registered' | 'private';
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Add this type for the Mongoose model
export type UserDocument = mongoose.Document & IUser;

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    bio: { type: String },
    role: { 
      type: String, 
      enum: ['owner', 'renter', 'broker', 'admin'],
      default: 'renter'
    },
    avatar: { type: String },
    notifications: {
      email: {
        marketing: { type: Boolean, default: true },
        newMessages: { type: Boolean, default: true },
        propertyUpdates: { type: Boolean, default: true },
        accountAlerts: { type: Boolean, default: true },
      },
      push: {
        newMessages: { type: Boolean, default: true },
        propertyUpdates: { type: Boolean, default: true },
        accountAlerts: { type: Boolean, default: true },
      },
    },
    privacy: {
      showPhone: { type: Boolean, default: false },
      showEmail: { type: Boolean, default: false },
      profileVisibility: { 
        type: String, 
        enum: ['public', 'registered', 'private'],
        default: 'registered'
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: err) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);

export default User;