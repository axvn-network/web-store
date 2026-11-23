import { NextResponse } from 'next/server';
import { getThapCamServices } from '@/lib/thapCamMmoService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('serviceType') as any;

    const data = await getThapCamServices(serviceType);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
