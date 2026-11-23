const token = process.env.SUPABASE_MGMT_TOKEN || '';
const ref = 'iiibvihzfnyncrwcdvyt';

export async function runSql(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  try {
    return { status: res.status, data: JSON.parse(text) };
  } catch {
    return { status: res.status, data: text };
  }
}

async function main() {
  const { status, data } = await runSql("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
  console.log('Status:', status);
  console.log('Total Tables in Supabase:', data?.length);
  console.log('Tables:', data?.map(t => t.table_name));
}

main().catch(console.error);
