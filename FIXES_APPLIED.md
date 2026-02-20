# Fixes Applied – Meter Management Project

This document lists every change made to make the project build cleanly, run correctly, and be deployment-ready.

---

## 1. Backend: Load environment variables before anything else

**Issue:** `PORT` and JWT secrets were read from `process.env` before `dotenv` was loaded (only `connectDB.ts` called `dotenv.config()`), so the server could use wrong or undefined config.

**Fix:** Load env at the very top of `server.ts` so all code sees env vars.

**File:** `backend/src/server.ts`

```ts
import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
// ... rest unchanged
```

---

## 2. Backend: Cross-platform copy-templates script

**Issue:** The `copy-templates` script used Unix commands (`mkdir -p`, `cp -r`) and Windows `xcopy`, which can fail on some setups and break the build.

**Fix:** Use Node.js to copy so the build works on any OS.

**File:** `backend/package.json`

```json
"copy-templates": "node -e \"const fs=require('fs');if(fs.existsSync('src/templates')){fs.cpSync('src/templates','dist/templates',{recursive:true});console.log('Templates copied');}else{console.log('Templates skip');}\""
```

---

## 3. Backend: Multer upload middleware

**Issue:** `uploadMiddleware.ts` was effectively empty, so `/api/admin/upload` had no multer config and uploads would fail.

**Fix:** Add multer with memory storage (for Cloudinary), file type filter, and limits.

**File:** `backend/src/middleware/uploadMiddleware.ts`

```ts
import multer from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per file
}).array('files', 10); // field name 'files', max 10 files
```

---

## 4. Backend: Upload controller type

**Issue:** Custom `UploadedFile` type and cast didn’t match Multer’s `Express.Multer.File` (which has `buffer` and `mimetype`).

**Fix:** Use `Express.Multer.File[]` and remove the redundant interface.

**File:** `backend/src/controllers/uploadController.ts`

- Replaced `(req as Request & { files?: UploadedFile[] })?.files` with `(req as Request & { files?: Express.Multer.File[] })?.files`.
- Removed the unused `UploadedFile` interface.

---

## 5. Backend: Admin logout route

**Issue:** Frontend called `POST /api/admin/auth/logout` but the backend had no logout route, so admin logout failed.

**Fix:** Add logout handler that invalidates the refresh token and register the route.

**File:** `backend/src/controllers/adminController.ts`

- Import: `import { verifyRefreshToken } from "../utils/jwt";`
- New method:

```ts
async logout(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: "Refresh token is required" });
    }
    const decoded = verifyRefreshToken(refreshToken);
    await userService.logout(decoded.userId, refreshToken);
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err: any) {
    return res.status(401).json({ success: false, error: err.message || "Invalid refresh token" });
  }
},
```

**File:** `backend/src/routes/adminRoutes.ts`

- Added: `router.post("/auth/logout", adminController.logout);`

---

## 6. Backend: Environment variable format (.env)

**Issue:** Spaces around `=` (e.g. `PORT = 4000`, `JWT_ACCESS_SECRET= value`) can lead to wrong or trimmed values in some setups.

**Fix:** Use no spaces: `KEY=value`.

**File:** `backend/.env`

- `PORT = 4000` → `PORT=4000`
- `MONGODB ='...'` → `MONGODB=...` (and removed extra quotes)
- `JWT_ACCESS_SECRET= rsmeterserviceaccesstoken` → `JWT_ACCESS_SECRET=rsmeterserviceaccesstoken`
- Same for `JWT_REFRESH_SECRET`.

---

## 7. Backend: .env.example and connectDB

**Issue:** No template for required env vars; MongoDB connection had no retries or options.

**Fix:** Add `backend/.env.example` with all required/optional vars (no real secrets). In `connectDB`, remove duplicate `dotenv.config()` (handled in `server.ts`), add retries and connection options.

**File:** `backend/.env.example` (created)

- Documents: `PORT`, `MONGODB`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `MAIL_*`, `CLOUDINARY_*`, `FRONTEND_URL`.

**File:** `backend/src/config/connectDB.ts`

- Removed `dotenv.config()`.
- Added retry loop (e.g. 5 attempts, 3s delay), `maxPoolSize: 10`, `serverSelectionTimeoutMS: 10000`, and clear error logging.

---

## 8. Frontend: API base URL from environment

**Issue:** API URL was hardcoded as `http://localhost:4000`, so production builds couldn’t point to the real backend.

**Fix:** Use `import.meta.env.VITE_API_URL` with a fallback to `http://localhost:4000`. Use the same base for refresh-token requests.

**File:** `sample frontend/src/api/apiClient/axios.ts`

- `const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";`
- `axios.create({ baseURL, withCredentials: true });`
- Refresh token URLs: `axios.post(\`${baseURL}/api/admin/auth/refreshToken\", ...)` and same for `/api/user/refreshToken`.

---

## 9. Frontend: .env.example and Vite env types

**Issue:** No template for frontend env; TypeScript didn’t know about `VITE_*` vars.

**Fix:** Add `sample frontend/.env.example` and extend `ImportMetaEnv` in `vite-env.d.ts`.

**File:** `sample frontend/.env.example` (created)

- `VITE_API_URL=http://localhost:4000`
- Optional `VITE_GOOGLE_CLIENT_ID` commented.

**File:** `sample frontend/src/vite-env.d.ts`

- Added `ImportMetaEnv` with `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID` (optional).

---

## 10. Frontend: User logout clears all auth data

**Issue:** Redux logout only cleared `userInfo` and `accessToken`, leaving `userToken`, `userData`, and `refreshToken`, so the user could appear still logged in.

**Fix:** Clear all user-related keys in the logout reducer.

**File:** `sample frontend/src/store/Slice/userSlice.ts`

```ts
logout: (state) => {
  state.userInfo = null;
  localStorage.removeItem("userInfo");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userToken");
  localStorage.removeItem("userData");
  localStorage.removeItem("refreshToken");
},
```

---

## 11. Frontend: userInfo type and role

**Issue:** After login, code stored `role` in `userInfo`, but the type only had `_id`, `name`, `email`, which could cause type/lint issues.

**Fix:** Add optional `role` to the `userInfo` interface.

**File:** `sample frontend/src/store/Slice/userSlice.ts`

```ts
export interface userInfo {
  _id: string;
  name: string;
  email: string;
  role?: string;
}
```

---

## 12. Frontend: Admin logout – static import

**Issue:** Header used `await import('@/api/adminApi')` for logout while other files imported `adminApi` statically, which triggered a Vite warning about mixed static/dynamic usage and chunking.

**Fix:** Use a static import and call the same logout function.

**File:** `sample frontend/src/components/layout/Header.tsx`

- Added: `import { logout as adminLogout } from '@/api/adminApi';`
- Replaced: `const { logout } = await import('@/api/adminApi'); await logout();` with `await adminLogout();`

---

## 13. Frontend: Product image upload field name

**Issue:** Backend expects multipart field `files` (multer `.array('files', 10)`), but the frontend sent `images`, so uploads failed.

**Fix:** Append files under the name `files` in FormData.

**File:** `sample frontend/src/api/adminApi.ts`

- In `uploadProductImages`: `formData.append("images", file)` → `formData.append("files", file)`.

---

## 14. Frontend: Build chunk size warning

**Issue:** Default Vite chunk size warning (500 kB) was noisy for this app size.

**Fix:** Set a slightly higher limit so the build doesn’t warn unnecessarily.

**File:** `sample frontend/vite.config.ts`

```ts
build: {
  chunkSizeWarningLimit: 600,
},
```

---

## 15. .gitignore – security and structure

**Issue:** `.env` was not ignored (risk of committing secrets); paths referred to `.Backend` and `.sample fr` (typos).

**Fix:** Ignore env files and standard build/IDE paths; fix folder names.

**File:** `.gitignore`

- Added: `backend/.env`, `.env`, `.env.local`, `.env.*.local`, `dist`, `backend/dist`, `sample frontend/dist`, `.idea`, `.vscode`, `*.log`, `.DS_Store`.
- Corrected: `backend/node_modules`, `sample frontend/node_modules` (replacing the old typo entries).

---

## Summary

- **Backend:** Env loading, copy-templates, upload middleware, upload types, admin logout, .env format, DB connection with retries, .env.example.
- **Frontend:** API URL from env, .env.example, env types, user logout cleanup, userInfo role, admin logout static import, upload field name `files`, chunk warning limit.
- **Repo:** .gitignore updated so `.env` and build artifacts are not committed.

After these changes:

1. Backend builds with `npm run build` (from `backend/`).
2. Frontend builds with `npm run build` (from `sample frontend/`).
3. Auth (user + admin login/signup/JWT/refresh and logout) is consistent and uses the same base URL and token handling.
4. Admin upload uses multer and the correct `files` field.
5. Env is documented and typed; secrets stay out of git.

**Run for production:**

- Backend: set `PORT`, `MONGODB`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, etc. in `.env` (or your host’s env); then `npm run build` and `npm start`.
- Frontend: set `VITE_API_URL` to your backend URL, then `npm run build` and serve the `dist/` folder (or deploy to Vercel/Netlify with the same env).
