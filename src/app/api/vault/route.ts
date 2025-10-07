import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VaultItem from '@/models/VaultItem';
import jwt from 'jsonwebtoken';
import { ApiResponse, VaultItem as VaultItemType } from '@/types';

// Middleware to verify JWT token
function verifyToken(request: NextRequest): { userId: string; email: string } | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any;
    return { userId: decoded.userId, email: decoded.email };
  } catch (error) {
    return null;
  }
}

// GET - Fetch all vault items for user
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<VaultItemType[]>>> {
  try {
    const auth = verifyToken(request);
    if (!auth) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    await connectDB();
    const vaultItems = await VaultItem.find({ userId: auth.userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: vaultItems.map(item => ({
        _id: item._id.toString(),
        userId: item.userId.toString(),
        title: item.title,
        username: item.username, // encrypted
        password: item.password, // encrypted
        url: item.url,
        notes: item.notes, // encrypted
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }))
    });

  } catch (error: any) {
    console.error('Get vault items error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// POST - Create new vault item
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<VaultItemType>>> {
  try {
    const auth = verifyToken(request);
    if (!auth) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const { title, username, password, url, notes } = await request.json();

    if (!title || !username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Title, username, and password are required'
      }, { status: 400 });
    }

    await connectDB();
    const vaultItem = new VaultItem({
      userId: auth.userId,
      title,
      username, // already encrypted on client side
      password, // already encrypted on client side
      url: url || '',
      notes: notes || '', // already encrypted on client side
    });

    await vaultItem.save();

    return NextResponse.json({
      success: true,
      data: {
        _id: vaultItem._id.toString(),
        userId: vaultItem.userId.toString(),
        title: vaultItem.title,
        username: vaultItem.username,
        password: vaultItem.password,
        url: vaultItem.url,
        notes: vaultItem.notes,
        createdAt: vaultItem.createdAt,
        updatedAt: vaultItem.updatedAt,
      }
    });

  } catch (error: any) {
    console.error('Create vault item error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
