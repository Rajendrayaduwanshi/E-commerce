import mongoose, { Schema, InferSchemaType } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    jti: { type: String, required: true, unique: true }, // refresh token id
    userAgent: { type: String },
    ip: { type: String },
    revoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Mongo TTL index (auto delete expired sessions)
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type SessionDoc = InferSchemaType<typeof sessionSchema>;

export const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);
