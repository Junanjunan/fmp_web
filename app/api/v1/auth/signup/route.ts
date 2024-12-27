import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/database/prisma'


export async function POST(req: Request) {
  try {
    const { email, password, passwordConfirm } = await req.json();

    // Validate input
    if (!email || !password || !passwordConfirm) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: 'Missing required fields'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.auth_user.findUnique({
      where: { email }
    });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: 'User already exists'
      });
    }

    // Check if password and passwordConfirm match
    if (password !== passwordConfirm) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: 'Passwords do not match'
      });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.auth_user.create({
      data: {
        email,
        hashed_password: hashedPassword
      }
    });

    // Remove password from response
    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: 'Error creating user'
    });
  }
}