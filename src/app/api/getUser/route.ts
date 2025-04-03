import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  const serviceAccount = require('../../../backend/serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const db = admin.firestore();

// Named export for GET request
export async function GET(req: Request) {
  const query = new URL(req.url).searchParams;
  const uid = query.get('uid'); // Get user ID from query params

  if (!uid || typeof uid !== 'string') {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userDoc.data(), { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
