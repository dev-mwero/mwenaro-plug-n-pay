import mongoose, { Schema, Document } from 'mongoose';

export interface IApiKey extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  key: string; // Hashed key
  prefix: string; // First few chars for identification: mpl_live_...
  isLive: boolean;
  lastUsedAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ApiKeySchema = new Schema<IApiKey>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  prefix: { type: String, required: true },
  isLive: { type: Boolean, default: false },
  lastUsedAt: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.ApiKey || mongoose.model<IApiKey>('ApiKey', ApiKeySchema);
