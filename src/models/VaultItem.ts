import mongoose, { Document, Schema } from 'mongoose';

export interface IVaultItem extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  username: string; // encrypted
  password: string; // encrypted
  url: string;
  notes: string; // encrypted
  createdAt: Date;
  updatedAt: Date;
}

const VaultItemSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  url: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Index for efficient queries
VaultItemSchema.index({ userId: 1 });
VaultItemSchema.index({ title: 'text', notes: 'text' });

export default mongoose.models.VaultItem || mongoose.model<IVaultItem>('VaultItem', VaultItemSchema);
