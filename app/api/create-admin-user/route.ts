import admin from 'firebase-admin';
import { NextRequest } from 'next/server';

const app =
    admin.apps.length === 0
        ? admin.initializeApp({
              credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACC!)),
              databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
          })
        : admin.app();

const auth = app.auth();

export async function POST(request: NextRequest) {
    // check for api key in headers
    try {
        const apiKey = request.headers.get('x-api-key');
        if (!apiKey || apiKey !== process.env.API_KEY) {
            return new Response('Unauthorized', { status: 401 });
        }
        const reqJSON = await request.json();
        const { email, password } = reqJSON;

        if (!email || !password) {
            return new Response('Missing email or password', { status: 400 });
        }

        const user = await auth.createUser({
            email,
            password,
            displayName: 'Admin User',
        });
        const uid = user.uid;
        await auth.setCustomUserClaims(uid, { admin: true });
        return new Response(`Admin user created successfully: ${uid}`, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return new Response('Internal Server Error: ' + error.message, { status: 500 });
    }
}

// sample curl request
/*
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: sampleapikey" \
  -d '{"email": "admin@example.com", "password": "password"}' \
  http://localhost:3000/api/create-admin-user
*/
