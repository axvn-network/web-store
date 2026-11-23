import { NextResponse } from 'next/server';
import { getTaiKhoanProducts, getTaiKhoanProductDetail } from '@/lib/taiKhoanService';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product');

    if (productId) {
      try {
        const detail = await getTaiKhoanProductDetail(productId);
        return NextResponse.json(detail);
      } catch (err: any) {
        // Fallback to Supabase
        const { data: p } = await supabaseAdmin
          .from('Product')
          .select('*')
          .or(`id.eq.${productId},partnerProductId.eq.${productId}`)
          .single();

        if (p) {
          return NextResponse.json({
            status: 'success',
            msg: 'Lấy chi tiết sản phẩm thành công (từ Supabase)',
            product: [
              {
                id: p.partnerProductId || p.id,
                name: p.name,
                price: p.originalPrice || p.price,
                amount: p.stockQuantity || 10,
                description: p.description,
              },
            ],
          });
        }
        return NextResponse.json(
          { status: 'error', msg: err.message || 'Không tìm thấy sản phẩm' },
          { status: 404 }
        );
      }
    }

    try {
      const data = await getTaiKhoanProducts();
      return NextResponse.json(data);
    } catch (err: any) {
      // Fallback: load synced partner catalog from Supabase
      const { data: dbProducts } = await supabaseAdmin
        .from('Product')
        .select('*')
        .ilike('partnerSource', '%taikhoan%');
      const { data: dbCategories } = await supabaseAdmin
        .from('Category')
        .select('*')
        .ilike('partnerSource', '%taikhoan%');

      const mappedCats = (dbCategories || []).map((cat) => ({
        id: cat.partnerId || cat.id,
        name: cat.name,
        parent_id: cat.parentId || 0,
        products: (dbProducts || [])
          .filter(
            (p) =>
              p.categoryId === cat.id ||
              String(p.partnerCategoryId) === String(cat.partnerId)
          )
          .map((p) => ({
            id: p.id.startsWith('tk-sp-') ? p.id.replace('tk-sp-', '') : p.id,
            name: p.name,
            price: p.retailPrice || p.partnerPrice || p.costPrice || 0,
            amount: 50,
            stock: 50,
            description: p.description || p.shortDesc || '',
          })),
      }));

      return NextResponse.json({
        status: 'success',
        msg: 'Lấy danh mục sản phẩm từ dữ liệu đã đồng bộ (Supabase)',
        categories: mappedCats,
        fallback: true,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', msg: error.message || 'Không thể lấy danh sách sản phẩm' },
      { status: 500 }
    );
  }
}
