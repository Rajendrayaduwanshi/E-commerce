"use client";

import LoginForm from "@/modules/auth/components/LoginForm";

export default function AdminLoginPage() {
  return <LoginForm role="admin" />;
}

// import { useState } from "react";
// import { z } from "zod";
// import { useRouter } from "next/navigation";
// import { Eye, EyeOff } from "lucide-react";
// import Alert from "@/shared/components/ui/Alert";

// const loginSchema = z.object({
//   email: z.string().email("Invalid email"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// export default function AdminLoginPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [alert, setAlert] = useState<{
//     type: "error" | "success";
//     messages: string[];
//   } | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const result = loginSchema.safeParse(form);
//     if (!result.success) {
//       const fieldErrors: Record<string, string> = {};
//       result.error.issues.forEach((err) => {
//         if (err.path[0]) {
//           fieldErrors[err.path[0].toString()] = err.message;
//         }
//       });
//       setErrors(fieldErrors);
//       return;
//     }

//     setLoading(true);
//     setErrors({});

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       if (res.ok) {
//         setAlert({
//           type: "success",
//           messages: ["Login successful! Redirecting..."],
//         });
//         setTimeout(() => router.push("/admin/dashboard"), 1500);
//       } else {
//         const data = await res.json();
//         setAlert({ type: "error", messages: [data.message || "Login failed"] });
//       }
//     } catch {
//       setAlert({ type: "error", messages: ["Something went wrong"] });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 font-sans">
//       {alert && (
//         <Alert
//           type={alert.type}
//           messages={alert.messages}
//           onClose={() => setAlert(null)}
//         />
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="bg-gray-900/80 backdrop-blur-lg shadow-2xl border border-gray-700 rounded-2xl p-8 w-full max-w-md"
//       >
//         <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-8 tracking-wide">
//           Admin Login
//         </h1>

//         {/* Email */}
//         <div className="mb-5">
//           <label className="block text-sm md:text-base font-medium text-gray-300 mb-2">
//             Email
//           </label>
//           <input
//             name="email"
//             type="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="Enter your email"
//             className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
//           />
//           {errors.email && (
//             <p className="text-red-400 text-xs mt-1">{errors.email}</p>
//           )}
//         </div>

//         {/* Password */}
//         <div className="mb-6">
//           <label className="block text-sm md:text-base font-medium text-gray-300 mb-2">
//             Password
//           </label>
//           <div className="relative">
//             <input
//               name="password"
//               type={showPassword ? "text" : "password"}
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
//             />
//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
//             >
//               {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
//             </span>
//           </div>
//           {errors.password && (
//             <p className="text-red-400 text-xs mt-1">{errors.password}</p>
//           )}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white py-3 rounded-lg disabled:opacity-50 font-semibold text-sm md:text-base"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         <p className="text-gray-400 text-xs md:text-sm text-center mt-5">
//           Don't have an account?{" "}
//           <a href="/admin/register" className="text-blue-400 hover:underline">
//             Register
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }
