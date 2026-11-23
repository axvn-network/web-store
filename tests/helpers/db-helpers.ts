import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { supabase } from '../../lib/supabaseClient';

export interface TestCategoryInput {
  id?: string;
  name: string;
  slug: string;
  nameVi?: string;
  description?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface TestProductInput {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  costPrice: number;
  retailPrice: number;
  customPrice?: number | null;
  markupPercent?: number;
  partnerPrice?: number;
  partnerSource?: string;
  status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  unit?: string;
  description?: string;
  shortDesc?: string;
  thumbnail?: string | null;
}

export class DbHelpers {
  public admin = supabaseAdmin;
  public anon = supabase;

  /**
   * Cleans up all test entities prefixed with test-e2e-
   */
  async cleanupE2ERecords(): Promise<{ cleaned: number }> {
    let count = 0;
    try {
      // 1. Clean OrderItems and Orders
      const { data: testOrders } = await this.admin
        .from('Order')
        .select('id')
        .or('id.ilike.test-e2e-%,code.ilike.test-e2e-%,id.ilike.ord-test-%');

      if (testOrders && testOrders.length > 0) {
        const orderIds = testOrders.map((o) => o.id);
        await this.admin.from('OrderItem').delete().in('orderId', orderIds);
        const { count: deletedOrders } = await this.admin
          .from('Order')
          .delete()
          .in('id', orderIds);
        count += deletedOrders || testOrders.length;
      }

      // 2. Clean Product Variants & Stocks for test products
      const { data: testProducts } = await this.admin
        .from('Product')
        .select('id')
        .or('id.ilike.test-e2e-%,slug.ilike.test-e2e-%');

      if (testProducts && testProducts.length > 0) {
        const productIds = testProducts.map((p) => p.id);
        await this.admin.from('Stock').delete().in('productId', productIds);
        await this.admin.from('ProductVariant').delete().in('productId', productIds);
        const { count: deletedProds } = await this.admin
          .from('Product')
          .delete()
          .in('id', productIds);
        count += deletedProds || testProducts.length;
      }

      // 3. Clean Categories
      const { data: testCategories } = await this.admin
        .from('Category')
        .select('id')
        .or('id.ilike.test-e2e-%,slug.ilike.test-e2e-%');

      if (testCategories && testCategories.length > 0) {
        const catIds = testCategories.map((c) => c.id);
        const { count: deletedCats } = await this.admin
          .from('Category')
          .delete()
          .in('id', catIds);
        count += deletedCats || testCategories.length;
      }

      return { cleaned: count };
    } catch (err) {
      console.warn('DbHelpers.cleanupE2ERecords error:', err);
      return { cleaned: count };
    }
  }

  async createTestCategory(input: TestCategoryInput) {
    const record = {
      id: input.id || `test-e2e-cat-${Date.now()}`,
      name: input.name,
      nameVi: input.nameVi || input.name,
      slug: input.slug,
      description: input.description || 'Test category for E2E testing',
      parentId: input.parentId || null,
      sortOrder: input.sortOrder ?? 99,
      isActive: input.isActive ?? true,
      createdAt: new Date().toISOString(),
    };

    const { data, error } = await this.admin
      .from('Category')
      .upsert(record, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw new Error(`createTestCategory failed: ${error.message}`);
    return data;
  }

  async deleteTestCategory(id: string) {
    const { error } = await this.admin.from('Category').delete().eq('id', id);
    if (error) throw new Error(`deleteTestCategory failed: ${error.message}`);
    return true;
  }

  async createTestProduct(input: TestProductInput) {
    const now = new Date().toISOString();
    const record = {
      id: input.id,
      name: input.name,
      slug: input.slug,
      sku: input.sku,
      categoryId: input.categoryId,
      costPrice: input.costPrice,
      retailPrice: input.retailPrice,
      customPrice: input.customPrice ?? null,
      markupPercent: input.markupPercent ?? 20,
      partnerPrice: input.partnerPrice ?? input.costPrice,
      partnerSource: input.partnerSource ?? 'local',
      status: input.status ?? 'ACTIVE',
      unit: input.unit ?? 'Chiếc',
      description: input.description || 'E2E Test product description',
      shortDesc: input.shortDesc || 'E2E Test product',
      thumbnail: input.thumbnail ?? null,
      updatedAt: now,
      createdAt: now,
    };

    const { data, error } = await this.admin
      .from('Product')
      .upsert(record, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw new Error(`createTestProduct failed: ${error.message}`);
    return data;
  }

  async deleteTestProduct(id: string) {
    await this.admin.from('Stock').delete().eq('productId', id);
    await this.admin.from('ProductVariant').delete().eq('productId', id);
    const { error } = await this.admin.from('Product').delete().eq('id', id);
    if (error) throw new Error(`deleteTestProduct failed: ${error.message}`);
    return true;
  }

  async findProduct(id: string) {
    const { data, error } = await this.admin
      .from('Product')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`findProduct failed: ${error.message}`);
    return data;
  }

  async findCategory(id: string) {
    const { data, error } = await this.admin
      .from('Category')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`findCategory failed: ${error.message}`);
    return data;
  }

  async findOrder(idOrCode: string) {
    const { data, error } = await this.admin
      .from('Order')
      .select('*, items:OrderItem(*)')
      .or(`id.eq.${idOrCode},code.eq.${idOrCode}`)
      .maybeSingle();

    if (error) throw new Error(`findOrder failed: ${error.message}`);
    return data;
  }

  /**
   * Asserts public read access via anon client (RLS policy check)
   */
  async checkPublicAnonRead(tableName: string, limit: number = 3) {
    const { data, error } = await this.anon.from(tableName).select('*').limit(limit);
    if (error) {
      throw new Error(`Anon read failed on table ${tableName}: ${error.message}`);
    }
    return data;
  }

  /**
   * Scans Product and Category tables for Chinese characters
   */
  async verifyNoChineseStringsInDb(): Promise<{ found: number; violations: any[] }> {
    const chineseRegex = /[\u4e00-\u9fa5]/;
    const violations: any[] = [];

    // Scan Categories
    const { data: cats } = await this.admin.from('Category').select('id, name, slug');
    if (cats) {
      for (const c of cats) {
        if (chineseRegex.test(c.name || '') || chineseRegex.test(c.slug || '')) {
          violations.push({ table: 'Category', id: c.id, value: c.name });
        }
      }
    }

    // Scan Products
    const { data: prods } = await this.admin
      .from('Product')
      .select('id, name, slug, description')
      .limit(100);
    if (prods) {
      for (const p of prods) {
        if (
          chineseRegex.test(p.name || '') ||
          chineseRegex.test(p.slug || '') ||
          chineseRegex.test(p.description || '')
        ) {
          violations.push({ table: 'Product', id: p.id, value: p.name });
        }
      }
    }

    return { found: violations.length, violations };
  }
}

export const dbHelpers = new DbHelpers();
