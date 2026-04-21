const fs = require('fs');
const file = 'src/app/login/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/ref=\{el => sectionsRef\.current\[(\d+)\] = el\}/g, 'ref={el => { sectionsRef.current[$1] = el; }}');
content = content.replace('Cpu, Database, Cloud, Zap\n} from "lucide-react";', 'Cpu, Database, Cloud\n} from "lucide-react";');

fs.writeFileSync(file, content);
console.log('Fixed page.tsx');
