import { MockPartnerServer } from './mock-partner-server';
import { HttpClient } from './http-client';
import { DbHelpers } from './db-helpers';

export interface TestContext {
  isLive: boolean;
  partnerBaseUrl: string;
  appBaseUrl: string;
  mockServer: MockPartnerServer;
  httpClient: HttpClient;
  dbHelpers: DbHelpers;
}

export interface TestCase {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4;
  feature: 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'CROSS' | 'APP';
  run: (ctx: TestContext) => Promise<void>;
}
