import mongoose from 'mongoose';

export interface IFavorite extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  property: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema = new mongoose.Schema<IFavorite>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate favorites
FavoriteSchema.index({ user: 1, property: 1 }, { unique: true });

const Favorite = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;