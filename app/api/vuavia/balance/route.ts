import { NextResponse } from 'next/server';
import { getVuaViaBalance } from '@/lib/vuaViaService';

export async function GET() {
  try {
    const data = await getVuaViaBalance();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
