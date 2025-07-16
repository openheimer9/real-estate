import mongoose from 'mongoose';

export interface ISubscription extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  plan: 'Basic' | 'Standard' | 'Premium';
  status: 'active' | 'inactive' | 'pending' | 'cancelled';
  expiresAt: Date;
  listings: {
    used: number;
    total: number;
  };
  paymentMethod: {
    type: string;
    last4?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  billingCycle: 'monthly' | 'yearly';
  autoRenew: boolean;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new mongoose.Schema<ISubscription>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { 
      type: String, 
      enum: ['Basic', 'Standard', 'Premium'],
      required: true 
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'pending', 'cancelled'],
      default: 'active' 
    },
    expiresAt: { type: Date, required: true },
    listings: {
      used: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    paymentMethod: {
      type: { type: String, required: true },
      last4: { type: String },
      expiryMonth: { type: Number },
      expiryYear: { type: Number },
    },
    billingCycle: { 
      type: String, 
      enum: ['monthly', 'yearly'],
      default: 'monthly' 
    },
    autoRenew: { type: Boolean, default: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;