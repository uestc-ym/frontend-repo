import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ttf2woff2 from 'ttf2woff2';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 配置
const srcTtf = path.join(__dirname, 'fontOrigin/DouyinSansBold.ttf');
const distDir = path.join(__dirname, '');
const distTtf = path.join(distDir, 'DouyinSansBold.ttf');
const distWoff2 = path.join(distDir, 'DouyinSansBold.woff2');
const htmlPath = './font.html';

// 1. 复制原始字体到处理目录
fs.mkdirSync(distDir, { recursive: true });
fs.copyFileSync(srcTtf, distTtf);

// 强制切换到当前脚本所在目录 -- 针对npm run font命令执行目录变更
process.chdir(__dirname)

// 2. font-spider 瘦身（输出到 distDir）
execSync(`font-spider ${htmlPath} --output ${distDir} --formats ttf --no-backup`, { stdio: 'inherit' });

// ttf转换woff2
const ttf = fs.readFileSync(distTtf);
const woff2 = ttf2woff2(ttf);
fs.writeFileSync(distWoff2, woff2);

console.log('✅ 字体瘦身转换完成');