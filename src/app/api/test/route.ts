import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      env: {
        mongodb_uri_exists: !!process.env.MONGODB_URI,
        nextauth_secret_exists: !!process.env.NEXTAUTH_SECRET,
        nextauth_url_exists: !!process.env.NEXTAUTH_URL
      }
    });
    
  } catch (error: any) {
    console.error('Test connection error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Connection failed',
      env: {
        mongodb_uri_exists: !!process.env.MONGODB_URI,
        nextauth_secret_exists: !!process.env.NEXTAUTH_SECRET,
        nextauth_url_exists: !!process.env.NEXTAUTH_URL
      }
    }, { status: 500 });
  }
}
