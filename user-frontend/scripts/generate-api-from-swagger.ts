#!/usr/bin/env NODE_ENV=development node --watch --no-warnings --experimental-specifier-resolution=node --loader ts-node/esm
import fs from 'node:fs/promises';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateApi } from 'swagger-typescript-api';

// 获取当前文件的 URL
const __filename = fileURLToPath(import.meta.url);
// 获取当前文件所在的目录
const __dirname = dirname(__filename);
// 生成的文件目录
const directory = path.resolve(__dirname, '../src/service/api');
// swagger.json文件地址
const swaggerJsonUrl = 'http://localhost:3000/swagger.json';
// 模版文件路径
const templates = path.resolve(__dirname, './templates');

/* NOTE: all fields are optional expect one of `input`, `url`, `spec` */
try {
  await generateApi({
    // set to `false` to prevent the tool from writing to disk
    output: directory,
    url: swaggerJsonUrl,
    templates,
    modular: true,
    httpClientType: 'axios',
    cleanOutput: true,
  });
  const files = await fs.readdir(directory);

  for (const file of files) {
    // 删除注释
    if (file.endsWith('.ts')) {
      const oldPath = path.join(directory, file);
      const data = await fs.readFile(oldPath, 'utf8');
      const newData = data
        .replaceAll(
          /\/\* eslint-disable \*\/\n\/\* tslint:disable \*\/\n\/\*\n \* -{63}\n \* ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API +##\n \* ## +##\n \* ## AUTHOR: acacode +##\n \* ## SOURCE: https:\/\/github.com\/acacode\/swagger-typescript-api ##\n \* -{63}\n \*\//g,
          '',
        )
        .replace(/\n{2}/, '');

      await fs.writeFile(oldPath, newData, 'utf8');
    }
    // 文件名不为data-contracts.ts和http-client.ts的文件需要重命名
    if (!['data-contracts.ts', 'http-client.ts'].includes(file)) {
      const oldPath = path.join(directory, file);
      const newPath = path.join(
        directory,
        file.charAt(0).toLowerCase() + file.slice(1, -3) + '-module.ts',
      );
      const oldData = await fs.readFile(oldPath, 'utf8');

      await fs.writeFile(newPath, oldData, 'utf8');
      await fs.unlink(oldPath);
    }
  }
} catch (error) {
  console.error(error);
}
