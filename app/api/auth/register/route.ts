import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/src/lib/firebaseAdmin';

const VALID_STAFF_CODES = new Set(
  [process.env.STAFF_CODE_1, process.env.STAFF_CODE_2].filter(Boolean)
);

export async function POST(req: NextRequest) {
  try {
    const { idToken, role, staffCode, fullName, phoneNumber, age, comorbidities } =
      await req.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }

    // Verify the caller is who they say they are
    const decoded = await adminAuth.verifyIdToken(idToken);
    const { uid, email } = decoded;

    // Server-side role determination — client input is untrusted
    const assignedRole =
      role === 'staff' && staffCode && VALID_STAFF_CODES.has(staffCode)
        ? 'staff'
        : 'patient';

    await adminDb.collection('users').doc(uid).set({
      email: email ?? '',
      role: assignedRole,
      fullName: fullName ?? '',
      phoneNumber: phoneNumber ?? '',
      age: age ?? '',
      comorbidities: comorbidities ?? [],
      createdAt: new Date(),
    });

    return NextResponse.json({ role: assignedRole });
  } catch (err: any) {
    console.error('[register] error:', err.message);
    return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
  }
}
