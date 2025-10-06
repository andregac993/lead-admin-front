#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function removeJSXComments(code) {
  // Remove comentários JSX {/* ... */}
  return code.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "");
}

/**
 * Processa um arquivo
 */
function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo não encontrado: ${filePath}`);
    return;
  }

  console.log(`🔧 Processando: ${filePath}`);

  // Lê o arquivo
  let code = fs.readFileSync(filePath, "utf-8");

  // Conta quantos comentários JSX existem
  const matches = code.match(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g);
  const count = matches ? matches.length : 0;

  if (count === 0) {
    console.log(`   ℹ️  Nenhum comentário JSX encontrado`);
    return;
  }

  // Remove comentários JSX
  code = removeJSXComments(code);

  // Salva o arquivo
  fs.writeFileSync(filePath, code);

  console.log(`   ✅ Removidos ${count} comentário(s) JSX`);
}

/**
 * Processa múltiplos arquivos
 */
function processFiles(patterns) {
  const glob = require("glob");

  let allFiles = [];
  patterns.forEach((pattern) => {
    const files = glob.sync(pattern);
    allFiles = [...allFiles, ...files];
  });

  // Remove duplicatas
  allFiles = [...new Set(allFiles)];

  if (allFiles.length === 0) {
    console.log("❌ Nenhum arquivo encontrado");
    return;
  }

  console.log(`\n📂 Encontrados ${allFiles.length} arquivo(s)\n`);

  allFiles.forEach(processFile);

  console.log("\n🎨 Executando Biome para formatar e organizar...\n");
  try {
    execSync("npx biome check --write .", { stdio: "inherit" });
  } catch (error) {
    console.warn("⚠️  Biome encontrou alguns problemas");
  }

  console.log("\n✨ Concluído!");
}

// Execução
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
📋 Uso: node remove-jsx-comments.js <arquivo-ou-pattern>

Exemplos:
  node remove-jsx-comments.js src/App.tsx
  node remove-jsx-comments.js "src/**/*.tsx"
  node remove-jsx-comments.js "src/**/*.{ts,tsx,js,jsx}"

O script irá:
  ✅ Remover todos os comentários JSX {/* */}
  ✅ Executar Biome para formatar e organizar imports
  `);
  process.exit(0);
}

// Verifica se precisa do glob
if (args.some((arg) => arg.includes("*"))) {
  // Instala glob se necessário
  try {
    require("glob");
  } catch {
    console.log("📦 Instalando dependência glob...\n");
    execSync("npm install glob", { stdio: "inherit" });
  }
  processFiles(args);
} else {
  // Arquivo único
  processFile(path.resolve(args[0]));

  console.log("\n🎨 Executando Biome...\n");
  execSync(`npx biome check --write ${args[0]}`, { stdio: "inherit" });

  console.log("\n✨ Concluído!");
}
