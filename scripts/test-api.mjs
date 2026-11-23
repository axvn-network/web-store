const token = process.env.SUPABASE_MGMT_TOKEN || '';
const ref = 'iiibvihzfnyncrwcdvyt';

async function testEndpoint(method, path, body) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  console.log(`${method} ${path} -> Status:`, res.status);
  const text = await res.text();
  console.log('Body:', text.slice(0, 200));
}

async function main() {
  await testEndpoint('PATCH', '/database/password', { password: 'BetaShop2026@SecureDb!' });
  await testEndpoint('PUT', '/database/password', { password: 'BetaShop2026@SecureDb!' });
  await testEndpoint('PUT', '/config/database/password', { password: 'BetaShop2026@SecureDb!' });
  await testEndpoint('PATCH', '/config/database/password', { password: 'BetaShop2026@SecureDb!' });
  await testEndpoint('PUT', '/config/database', { password: 'BetaShop2026@SecureDb!' });
  await testEndpoint('PATCH', '/config/database', { password: 'BetaShop2026@SecureDb!' });
}

main().catch(console.error);
