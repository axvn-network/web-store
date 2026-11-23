import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { mapProductRow, createProduct } from '@/lib/adminDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');

    let query = supabaseAdmin
      .from('Product')
      .select('*, category:Category(name, slug), brand:Brand(name, slug)')
      .eq('status', 'ACTIVE')
      .order('createdAt', { ascending: false });

    if (category && category !== 'all') {
      const cleanCat = category.replace(/^\//, '').replace(/^danh-muc\//, '');
      query = query.or(`category.slug.eq.${cleanCat},category.name.ilike.%${cleanCat}%`);
    }

    if (brand && brand !== 'all') {
      query = query.ilike('brand.name', `%${brand}%`);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    const products = (data || []).map((p) => mapProductRow(p, true));

    return NextResponse.json({ success: true, data: products, total: products.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = body.title || body.name;
    const price = body.price;
    const category = body.category || body.categoryId;

    if (!title || price === undefined || !category) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ tên, giá và danh mục sản phẩm' },
        { status: 400 }
      );
    }

    const newProduct = await createProduct(body);

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
