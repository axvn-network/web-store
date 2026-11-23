import { NextResponse } from 'next/server';
import { getThapCamBalance } from '@/lib/thapCamMmoService';

export async function GET() {
  try {
    const data = await getThapCamBalance();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
