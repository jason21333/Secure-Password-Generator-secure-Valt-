import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { ApiResponse, AuthResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<AuthResponse>>> {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 6 characters long'
      }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User already exists with this email'
      }, { status: 400 });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      data: {
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email
        },
        token
      }
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    
    // More specific error messages for debugging
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'User already exists with this email'
      }, { status: 400 });
    }
    
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        error: Object.values(error.errors).map((err: any) => err.message).join(', ')
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: `Internal server error: ${error.message || 'Unknown error'}`
    }, { status: 500 });
  }
}
