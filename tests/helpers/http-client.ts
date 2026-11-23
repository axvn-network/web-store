import http from 'http';

export interface HttpResponse<T = any> {
  status: number;
  statusText: string;
  headers: Headers;
  data: T;
  text: string;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeoutMs?: number;
}

export class HttpClient {
  public baseUrl: string;
  public defaultTimeoutMs: number;

  constructor(baseUrl?: string, defaultTimeoutMs: number = 8000) {
    this.baseUrl = (baseUrl || process.env.TEST_BASE_URL || 'http://127.0.0.1:3000').replace(
      /\/$/,
      ''
    );
    this.defaultTimeoutMs = defaultTimeoutMs;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
    const fullUrl = path.startsWith('http://') || path.startsWith('https://')
      ? path
      : `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

    if (!params) return fullUrl;

    const url = new URL(fullUrl);
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null) {
        url.searchParams.set(key, String(val));
      }
    }
    return url.toString();
  }

  async get<T = any>(path: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    const url = this.buildUrl(path, options?.params);
    const timeout = options?.timeoutMs ?? this.defaultTimeoutMs;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/html, */*',
        ...(options?.headers || {}),
      },
      signal: AbortSignal.timeout(timeout),
    });

    const text = await res.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      data,
      text,
    };
  }

  async post<T = any>(
    path: string,
    body?: any,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    const url = this.buildUrl(path, options?.params);
    const timeout = options?.timeoutMs ?? this.defaultTimeoutMs;

    const headers: Record<string, string> = {
      Accept: 'application/json, */*',
      ...(options?.headers || {}),
    };

    let serializedBody: any = body;
    if (body !== undefined) {
      if (typeof body === 'object' && !(body instanceof FormData) && !(body instanceof URLSearchParams)) {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
        serializedBody = JSON.stringify(body);
      }
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: serializedBody,
      signal: AbortSignal.timeout(timeout),
    });

    const text = await res.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      data,
      text,
    };
  }

  async put<T = any>(
    path: string,
    body?: any,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    const url = this.buildUrl(path, options?.params);
    const timeout = options?.timeoutMs ?? this.defaultTimeoutMs;

    const headers: Record<string, string> = {
      Accept: 'application/json, */*',
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    };

    const res = await fetch(url, {
      method: 'PUT',
      headers,
      body: typeof body === 'object' ? JSON.stringify(body) : body,
      signal: AbortSignal.timeout(timeout),
    });

    const text = await res.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      data,
      text,
    };
  }

  async delete<T = any>(
    path: string,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    const url = this.buildUrl(path, options?.params);
    const timeout = options?.timeoutMs ?? this.defaultTimeoutMs;

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json, */*',
        ...(options?.headers || {}),
      },
      signal: AbortSignal.timeout(timeout),
    });

    const text = await res.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      data,
      text,
    };
  }

  async isServerListening(): Promise<boolean> {
    try {
      const url = new URL(this.baseUrl);
      return await new Promise((resolve) => {
        const req = http.get(
          {
            hostname: url.hostname,
            port: Number(url.port) || 3000,
            path: '/',
            timeout: 1500,
          },
          (res) => {
            resolve(true);
            res.resume();
          }
        );
        req.on('error', () => resolve(false));
        req.on('timeout', () => {
          req.destroy();
          resolve(false);
        });
      });
    } catch {
      return false;
    }
  }

  async waitForServer(timeoutMs: number = 15000): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const alive = await this.isServerListening();
      if (alive) return true;
      await new Promise((r) => setTimeout(r, 500));
    }
    return false;
  }
}

export const httpClient = new HttpClient();
