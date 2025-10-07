import { NextRequest, NextResponse } from 'next/server';
import { generatePassword } from '@/lib/passwordGenerator';
import { PasswordGeneratorOptions, ApiResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ password: string; strength: any }>>> {
  try {
    const options: PasswordGeneratorOptions = await request.json();

    // Validate options
    if (!options.length || options.length < 4 || options.length > 128) {
      return NextResponse.json({
        success: false,
        error: 'Password length must be between 4 and 128 characters'
      }, { status: 400 });
    }

    if (!options.includeUppercase && !options.includeLowercase && !options.includeNumbers && !options.includeSymbols) {
      return NextResponse.json({
        success: false,
        error: 'At least one character type must be selected'
      }, { status: 400 });
    }

    const password = generatePassword(options);
    const strength = {
      score: password.length >= 12 ? 5 : password.length >= 8 ? 4 : 3,
      label: password.length >= 12 ? 'Strong' : password.length >= 8 ? 'Good' : 'Fair',
      color: password.length >= 12 ? 'text-green-500' : password.length >= 8 ? 'text-yellow-500' : 'text-red-500'
    };

    return NextResponse.json({
      success: true,
      data: { password, strength }
    });

  } catch (error: any) {
    console.error('Password generation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate password'
    }, { status: 500 });
  }
}
