import mongoose, { Schema, Document } from 'mongoose';

export interface IWebhookLog extends Document {
  apiKeyId: mongoose.Types.ObjectId;
  url: string;
  method: string;
  requestHeaders: Record<string, string>;
  requestBody: any;
  responseStatus?: number;
  responseHeaders?: Record<string, string>;
  responseBody?: any;
  duration?: number;
  error?: string;
  createdAt: Date;
}

const WebhookLogSchema = new Schema<IWebhookLog>({
  apiKeyId: { type: Schema.Types.ObjectId, ref: 'ApiKey', required: true },
  url: { type: String, required: true },
  method: { type: String, required: true },
  requestHeaders: { type: Object },
  requestBody: { type: Schema.Types.Mixed },
  responseStatus: { type: Number },
  responseHeaders: { type: Object },
  responseBody: { type: Schema.Types.Mixed },
  duration: { type: Number },
  error: { type: String },
}, { timestamps: true });

export default mongoose.models.WebhookLog || mongoose.model<IWebhookLog>('WebhookLog', WebhookLogSchema);
