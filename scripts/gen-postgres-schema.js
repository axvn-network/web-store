const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf-8');
content = content.replace('provider = "sqlite"', 'provider = "postgresql"');
fs.writeFileSync('prisma/schema.postgresql.prisma', content, 'utf-8');
console.log('Created prisma/schema.postgresql.prisma successfully');
