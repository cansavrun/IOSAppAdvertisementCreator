import {
  initializeApp,
  getApps,
  cert,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

let _adminAuth: Auth | null = null;

function getAdminAuth(): Auth {
  if (_adminAuth) return _adminAuth;

  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Missing Firebase Admin environment variables");
    }

    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }

  _adminAuth = getAuth();
  return _adminAuth;
}

// Lazy proxy
export const adminAuth = new Proxy({} as Auth, {
  get(_target, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getAdminAuth() as any)[prop];
  },
});
