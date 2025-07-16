import mongoose from 'mongoose';

export interface IProperty extends mongoose.Document {
  title: string;
  description: string;
  location: string;
  price: number;
  originalPrice?: number;
  images: string[];
  beds: number;
  baths: number;
  parking: boolean;
  furnished: boolean;
  area: number;
  type: 'Apartment' | 'Villa' | 'House' | 'Office' | 'Shop' | 'Land';
  status: 'For Rent' | 'For Sale';
  featured: boolean;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new mongoose.Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    images: [{ type: String, required: true }],
    beds: { type: Number, required: true },
    baths: { type: Number, required: true },
    parking: { type: Boolean, default: false },
    furnished: { type: Boolean, default: false },
    area: { type: Number, required: true },
    type: { 
      type: String, 
      enum: ['Apartment', 'Villa', 'House', 'Office', 'Shop', 'Land'],
      required: true 
    },
    status: { 
      type: String, 
      enum: ['For Rent', 'For Sale'],
      required: true 
    },
    featured: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Property = mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);

export default Property;