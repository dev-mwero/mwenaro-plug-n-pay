import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentConfig extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'PAYBILL' | 'TILL' | 'MOBILE';
  shortcode: string;
  passkey?: string;
  consumerKey?: string;
  consumerSecret?: string;
  isLive: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentConfigSchema = new Schema<IPaymentConfig>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['PAYBILL', 'TILL', 'MOBILE'], required: true },
  shortcode: { type: String, required: true },
  passkey: { type: String },
  consumerKey: { type: String },
  consumerSecret: { type: String },
  isLive: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.PaymentConfig || mongoose.model<IPaymentConfig>('PaymentConfig', PaymentConfigSchema);
