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

// PUT - Update vault item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<VaultItemType>>> {
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
    const vaultItem = await VaultItem.findOneAndUpdate(
      { _id: params.id, userId: auth.userId },
      {
        title,
        username, // already encrypted on client side
        password, // already encrypted on client side
        url: url || '',
        notes: notes || '', // already encrypted on client side
      },
      { new: true }
    );

    if (!vaultItem) {
      return NextResponse.json({
        success: false,
        error: 'Vault item not found'
      }, { status: 404 });
    }

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
    console.error('Update vault item error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// DELETE - Delete vault item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  try {
    const auth = verifyToken(request);
    if (!auth) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    await connectDB();
    const vaultItem = await VaultItem.findOneAndDelete({
      _id: params.id,
      userId: auth.userId
    });

    if (!vaultItem) {
      return NextResponse.json({
        success: false,
        error: 'Vault item not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Vault item deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete vault item error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
