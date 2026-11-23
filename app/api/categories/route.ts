import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('Category')
      .select('*')
      .eq('isActive', true)
      .order('sortOrder', { ascending: true });

    if (error) throw error;

    const { sanitizeWhiteLabel } = await import('@/lib/adminDb');

    const formatted = (categories || []).map((c) => ({
      id: c.id,
      name: sanitizeWhiteLabel(c.name),
      title: sanitizeWhiteLabel(c.name),
      nameVi: sanitizeWhiteLabel(c.nameVi || c.name),
      slug: c.slug,
      description: sanitizeWhiteLabel(c.description || 'Danh mục sản phẩm chính hãng tại BetaShop'),
      image: c.image,
      parentId: c.parentId,
      itemCount: 0,
      provider: 'BetaShop Official',
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = body.name || body.title;
    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Tên danh mục không được để trống' }, { status: 400 });
    }

    const { createCategory } = await import('@/lib/adminDb');
    const newCat = await createCategory(body);

    return NextResponse.json({ success: true, data: newCat }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu id danh mục cần xóa' }, { status: 400 });
    }

    const { deleteCategory } = await import('@/lib/adminDb');
    await deleteCategory(id);

    return NextResponse.json({ success: true, message: 'Đã xóa danh mục thành công' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
