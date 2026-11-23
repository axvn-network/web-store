import http from 'http';
import { URL } from 'url';
import fs from 'fs';
import path from 'path';

export interface MockServerOptions {
  port?: number;
  apiKey?: string;
  initialBalance?: number;
}

export class MockPartnerServer {
  private server: http.Server | null = null;
  public port: number;
  public apiKey: string;
  public balance: number;
  public latencyMs: number = 0;
  public simulate502: boolean = false;
  public simulateTimeout: boolean = false;
  private productStock: Record<string, number> = {
    '4': 74,
    '55': 25,
    '1': 10,
    '11': 0, // out of stock
  };
  private orderStore: Map<string, any> = new Map();

  constructor(options?: MockServerOptions) {
    this.port = options?.port || 3999;
    this.apiKey =
      options?.apiKey ||
      '2cd87d67c9b19e9ab7b6a0a944cefbe3jm90cW4wgsqhp7BiXbdnauUK8EMH3FC5';
    this.balance = options?.initialBalance ?? 1500000.0;

    // Seed default fixture order
    this.orderStore.set('TK98765432', {
      trans_id: 'TK98765432',
      product_id: 4,
      amount: 1,
      total_price: 30000,
      accounts: ['admin_vps_user|SecurePass2026!|2FA-SECRET-JBSWY3DPEHPK3PXP'],
      status: 'success',
    });
  }

  public setBalance(newBalance: number) {
    this.balance = newBalance;
  }

  public setStock(productId: string | number, stock: number) {
    this.productStock[String(productId)] = stock;
  }

  public setLatency(ms: number) {
    this.latencyMs = ms;
  }

  public setSimulate502(enable: boolean) {
    this.simulate502 = enable;
  }

  public setSimulateTimeout(enable: boolean) {
    this.simulateTimeout = enable;
  }

  public reset() {
    this.balance = 1500000.0;
    this.latencyMs = 0;
    this.simulate502 = false;
    this.simulateTimeout = false;
    this.productStock = {
      '4': 74,
      '55': 25,
      '1': 10,
      '11': 0,
    };
  }

  public start(): Promise<void> {
    if (this.server) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.server = http.createServer(async (req, res) => {
        if (this.simulateTimeout) {
          // Do not reply, trigger client timeout
          return;
        }

        if (this.latencyMs > 0) {
          await new Promise((r) => setTimeout(r, this.latencyMs));
        }

        if (this.simulate502) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', msg: 'Bad Gateway Simulation' }));
          return;
        }

        const reqUrl = new URL(req.url || '/', `http://127.0.0.1:${this.port}`);
        const pathname = reqUrl.pathname;
        const method = req.method?.toUpperCase();

        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        // Parse query params
        const apiKey = reqUrl.searchParams.get('api_key');

        // 1. Profile endpoint
        if (pathname === '/api/profile.php') {
          if (!apiKey) {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'error', msg: 'Thiếu api_key' }));
            return;
          }
          if (apiKey !== this.apiKey) {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'error', msg: 'API Key không hợp lệ' }));
            return;
          }
          res.writeHead(200);
          res.end(
            JSON.stringify({
              status: 'success',
              msg: 'Lấy dữ liệu thành công!',
              data: {
                username: 'hoangbom98',
                money: this.balance.toFixed(2),
              },
            })
          );
          return;
        }

        // 2. Products Catalog endpoint
        if (pathname === '/api/products.php') {
          if (!apiKey || apiKey !== this.apiKey) {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'error', msg: 'API Key không hợp lệ' }));
            return;
          }
          // Load fixture
          const fixturePath = path.join(__dirname, '../fixtures/products_catalog_valid.json');
          const data = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
          // Reflect current stock adjustments
          for (const cat of data.categories) {
            if (cat.products) {
              for (const p of cat.products) {
                if (this.productStock[String(p.id)] !== undefined) {
                  p.amount = this.productStock[String(p.id)];
                }
              }
            }
          }
          res.writeHead(200);
          res.end(JSON.stringify(data));
          return;
        }

        // 3. Product Detail endpoint
        if (pathname === '/api/product.php') {
          if (!apiKey || apiKey !== this.apiKey) {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'error', msg: 'API Key không hợp lệ' }));
            return;
          }
          const productId = reqUrl.searchParams.get('product');
          if (productId === '4') {
            const stock = this.productStock['4'] ?? 74;
            res.writeHead(200);
            res.end(
              JSON.stringify({
                status: 'success',
                msg: 'Lấy dữ liệu thành công!',
                product: [
                  {
                    id: 4,
                    name: 'VPS TRIAL 1 CORE - 1 RAM - 25GB SSD',
                    price: 30000,
                    amount: stock,
                    description:
                      'Bảo hành 30 ngày, die đổi mới, Chọn LOCAL tại đây ạ: https://prnt.sc/PFiJBW_YR-WG',
                    flag: null,
                    min: 1,
                    max: 1000000,
                  },
                ],
              })
            );
            return;
          } else if (productId === '11') {
            res.writeHead(200);
            res.end(
              JSON.stringify({
                status: 'success',
                msg: 'Lấy dữ liệu thành công!',
                product: [
                  {
                    id: 11,
                    name: 'AWS 32Vcpu',
                    price: 199000,
                    amount: this.productStock['11'] ?? 0,
                    description: 'Bảo hành login 24h',
                    flag: null,
                    min: 1,
                    max: 1000000,
                  },
                ],
              })
            );
            return;
          } else {
            // Non-existent or empty
            res.writeHead(200);
            res.end(
              JSON.stringify({
                status: 'success',
                msg: 'Lấy dữ liệu thành công!',
                product: [],
              })
            );
            return;
          }
        }

        // 4. Buy Product endpoint
        if (pathname === '/api/buy_product' || pathname === '/api/buy_product.php') {
          let bodyStr = '';
          if (method === 'POST') {
            for await (const chunk of req) {
              bodyStr += chunk;
            }
          }
          const postParams = new URLSearchParams(bodyStr);
          const effectiveApiKey =
            postParams.get('api_key') || reqUrl.searchParams.get('api_key');
          const action = postParams.get('action') || reqUrl.searchParams.get('action');
          const id = postParams.get('id') || reqUrl.searchParams.get('id');
          const amount = Number(
            postParams.get('amount') || reqUrl.searchParams.get('amount') || 1
          );
          const coupon =
            postParams.get('coupon') || reqUrl.searchParams.get('coupon');

          if (!effectiveApiKey || effectiveApiKey !== this.apiKey) {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'error', msg: 'API Key không hợp lệ' }));
            return;
          }

          if (!id || id === 'undefined' || id === '') {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'error', msg: 'ID sản phẩm không hợp lệ!' }));
            return;
          }

          if (amount <= 0 || isNaN(amount)) {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'error', msg: 'Số lượng không hợp lệ!' }));
            return;
          }

          if (coupon && (coupon.includes('FAKE') || coupon.includes('EXPIRED'))) {
            res.writeHead(200);
            res.end(
              JSON.stringify({
                status: 'error',
                msg: 'Mã giảm giá không hợp lệ hoặc đã hết hạn!',
              })
            );
            return;
          }

          if (id === '999999' || id === 'NON_EXISTENT_999999') {
            res.writeHead(200);
            res.end(
              JSON.stringify({
                status: 'error',
                msg: 'Sản phẩm không tồn tại trong hệ thống',
              })
            );
            return;
          }

          const currentStock = this.productStock[String(id)] ?? 50;
          if (currentStock < amount) {
            res.writeHead(200);
            res.end(
              JSON.stringify({
                status: 'error',
                msg: 'Sản phẩm đã hết hàng hoặc không đủ số lượng!',
              })
            );
            return;
          }

          const unitPrice = id === '4' ? 30000 : 120000;
          const totalPrice = unitPrice * amount;

          if (this.balance < totalPrice || amount === 999999) {
            res.writeHead(200);
            res.end(
              JSON.stringify({
                status: 'error',
                msg: 'Số dư không đủ, vui lòng nạp thêm',
              })
            );
            return;
          }

          // Successful purchase
          this.balance -= totalPrice;
          this.productStock[String(id)] = Math.max(0, currentStock - amount);
          const transId = `TK${Date.now().toString().slice(-8)}`;
          const credentials = [
            `user_vps_${id}|P@ss_${transId}|2FA-SECRET-TK-${id}`,
          ];

          this.orderStore.set(transId, {
            trans_id: transId,
            product_id: id,
            amount,
            total_price: totalPrice,
            accounts: credentials,
            status: 'success',
          });

          res.writeHead(200);
          res.end(
            JSON.stringify({
              status: 'success',
              msg: 'Mua hàng thành công!',
              trans_id: transId,
              data: credentials,
            })
          );
          return;
        }

        // 5. Order detail endpoint
        if (pathname === '/api/order.php') {
          if (!apiKey || apiKey !== this.apiKey) {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'error', msg: 'API Key không hợp lệ' }));
            return;
          }
          const orderId = reqUrl.searchParams.get('order');
          if (!orderId) {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'error', msg: 'Thiếu order' }));
            return;
          }

          const order = this.orderStore.get(orderId);
          if (order) {
            res.writeHead(200);
            res.end(
              JSON.stringify({
                status: 'success',
                msg: 'Lấy dữ liệu thành công!',
                data: order,
              })
            );
            return;
          } else {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'error', msg: 'Đơn hàng không tồn tại' }));
            return;
          }
        }

        // Default 404
        res.writeHead(404);
        res.end(JSON.stringify({ status: 'error', msg: 'Not found' }));
      });

      this.server.listen(this.port, '127.0.0.1', () => {
        resolve();
      });

      this.server.on('error', (err) => {
        reject(err);
      });
    });
  }

  public stop(): Promise<void> {
    if (!this.server) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      this.server?.close((err) => {
        this.server = null;
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

// Global instance for convenience
export const mockPartnerServer = new MockPartnerServer();
