// import mongoose, { Schema, model, models } from "mongoose";

// // TypeScript interface for type safety
// export interface IUser {
//   name: string;
//   email: string;
//   password: string;
//   role: "admin" | "user";
//   resetToken?: string;
//   resetExpires?: Date;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// // Mongoose schema definition
// const UserSchema = new Schema<IUser>(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true, lowercase: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["admin", "user"], default: "user" },
//     resetToken: { type: String },
//     resetExpires: { type: Date },
//   },
//   { timestamps: true }
// );

// // Avoid duplicate model creation (Next.js / serverless safe)
// const User = models.User || model<IUser>("User", UserSchema);

// export default User;

import mongoose, { Schema, InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema>;

export const User = mongoose.models.User || mongoose.model("user", userSchema);
