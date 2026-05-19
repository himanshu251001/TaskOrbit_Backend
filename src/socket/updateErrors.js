const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'socketHandlers.js');
let code = fs.readFileSync(filePath, 'utf8');

// Add emitError function after prisma import
code = code.replace(
    /import \{ prisma \} from '\.\.\/lib\/prisma\.ts';/,
    `import { prisma } from '../lib/prisma.ts';\n\nfunction emitError(socket, type, event, message) {\n    socket.emit(\`error:\${type}\`, { event, message });\n}`
);

// Replace socket.emit('error:...', { event: '...', message: '...' })
const regex = /socket\.emit\('error:([^']+)',\s*\{\s*event:\s*'([^']+)',\s*message:\s*(`[^`]+`|'[^']+'|"[^"]+")\s*,?\s*\}\);/g;

code = code.replace(regex, (match, type, event, message) => {
    return `emitError(socket, '${type}', '${event}', ${message});`;
});

fs.writeFileSync(filePath, code);
console.log('Done!');
