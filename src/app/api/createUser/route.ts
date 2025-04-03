// api/createUser/page.tsx
import { NextResponse } from 'next/server';
import { createUser } from '../../../backend/User/createUser'; 


export async function POST(req: Request) {
  try {
    const userData = await req.json(); 

    await createUser(userData); 
    
    return NextResponse.json({ message: 'User created successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
