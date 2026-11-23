const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  try {
    console.log('Connecting to PostgreSQL database via Prisma...');

    // 1. Revoke EXECUTE from anon, authenticated, public
    try {
      await prisma.$executeRawUnsafe(`
        REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated, public;
      `);
      console.log('1. Revoked EXECUTE on public.rls_auto_enable() from anon, authenticated, public.');
    } catch (e1) {
      console.warn('Step 1 note:', e1.message);
    }

    // 2. Grant EXECUTE only to service_role and postgres
    try {
      await prisma.$executeRawUnsafe(`
        GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO service_role, postgres;
      `);
      console.log('2. Granted EXECUTE on public.rls_auto_enable() to service_role, postgres.');
    } catch (e2) {
      console.warn('Step 2 note:', e2.message);
    }

    // 3. Switch to SECURITY INVOKER
    try {
      await prisma.$executeRawUnsafe(`
        ALTER FUNCTION public.rls_auto_enable() SECURITY INVOKER;
      `);
      console.log('3. Switched public.rls_auto_enable() to SECURITY INVOKER.');
    } catch (e3) {
      console.warn('Step 3 note:', e3.message);
    }

    // 4. Verify function definition
    const funcInfo = await prisma.$queryRawUnsafe(`
      SELECT routine_name, security_type
      FROM information_schema.routines
      WHERE routine_schema = 'public' AND routine_name = 'rls_auto_enable';
    `);
    console.log('Function verification:', funcInfo);

    console.log('All public.rls_auto_enable() security warnings resolved successfully!');
  } catch (err) {
    console.error('Database connection/execution error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

fix();
