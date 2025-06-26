import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ExecException } from 'child_process';

// Importa o JSON diretamente, garantindo que a estrutura seja validada em tempo de compilação.
import initialVersionInfo from './version';

// --- Interfaces e Tipos ---
interface VersionFile {
    version: string;
}

const execPromise = promisify(exec);

// --- Constantes de Configuração ---
const VERSION_FILE_PATH = path.join(__dirname, '../version.json');
const MIGRATIONS_DIR = './migrations/migrations';

// --- Funções Auxiliares para Gerenciar o Estado ---

/**
 * Atualiza o arquivo version.json com a nova versão de forma síncrona.
 * @param newVersion A nova string de versão a ser salva.
 */
function updateVersionFile(newVersion: string): void {
    try {
        const content: VersionFile = {
            version: newVersion,
        };
        // Usa JSON.stringify com formatação para manter o arquivo legível.
        fs.writeFileSync(VERSION_FILE_PATH, JSON.stringify(content, null, 4), 'utf8');
        console.log(`📝 Arquivo de versão atualizado para: ${newVersion}`);
    } catch (error) {
        console.error(`❌ Falha ao escrever no arquivo de versão (${VERSION_FILE_PATH}).`);
        if (error instanceof Error) {
            console.error(error.message);
        }
        // Interrompe o processo para evitar inconsistência de estado.
        process.exit(1);
    }
}

// --- Lógica Principal do Script ---

async function main() {
    const args: string[] = process.argv.slice(2);
    const target: string | undefined = args[0];
    let actualVersion: string = initialVersionInfo.version;

    if (!target) {
        console.error("❌ Nome da migração de destino não fornecido.");
        console.error("Uso: npx ts-node scripts/migrate.ts -- <nome_da_migracao>");
        process.exit(1);
    }

    const allVersions: string[] = fs.readdirSync(MIGRATIONS_DIR);
    console.log("ℹ️ Versões disponíveis na pasta:", allVersions);

    await runUntil(target, actualVersion, allVersions);
}

async function runUntil(targetMigration: string, currentVersion: string, allVersions: string[]): Promise<void> {
    let actualVersion = currentVersion;
    const currentIndex = allVersions.indexOf(actualVersion);
    const targetIndex = allVersions.indexOf(targetMigration);

    if (currentIndex === -1) {
        console.error(`❌ A versão atual "${actualVersion}" (do .json) não foi encontrada na pasta de migrações.`);
        process.exit(1);
    }
    if (targetIndex === -1) {
        console.error(`❌ A versão de destino "${targetMigration}" não foi encontrada na pasta de migrações.`);
        process.exit(1);
    }

    if (currentIndex === targetIndex) {
        console.log("\n✅ A versão atual já é a versão de destino. Nenhuma ação necessária.");
        return;
    }

    try {
        if (targetIndex < currentIndex) {
            // Lógica de DOWNGRADE
            console.log(`\n⬇️  Iniciando downgrade de "${actualVersion}" para "${targetMigration}"...`);
            for (let i = currentIndex; i > targetIndex; i--) {
                const migrationToUndo = allVersions[i];
                console.log(`Executando DOWNGRADE (para reverter ${migrationToUndo})`);
                await execPromise("cross-env TS_NODE_PROJECT=./migrations/tsconfig.knex.json knex migrate:down --knexfile ./migrations/knex-config.ts").catch(err => {
                    console.error(err)
                });

                const newVersion = allVersions[i - 1];
                updateVersionFile(newVersion);
                actualVersion = newVersion;
                console.log(`✅ Downgrade concluído. Nova versão: ${actualVersion}`);
            }
        } else {
            // Lógica de UPDATE
            console.log(`\n⬆️  Iniciando update de "${actualVersion}" para "${targetMigration}"...`);
            for (let i = currentIndex + 1; i <= targetIndex; i++) {
                const migrationToApply = allVersions[i];
                console.log(`Executando: npm run update (para aplicar ${migrationToApply})`);
                
                await execPromise("cross-env TS_NODE_PROJECT=./migrations/tsconfig.knex.json knex migrate:up --knexfile ./migrations/knex-config.ts").catch(err => {
                    console.error(err)
                });

                const newVersion = allVersions[i];
                updateVersionFile(newVersion);
                actualVersion = newVersion;
                console.log(`✅ Update concluído. Nova versão: ${actualVersion}`);
            }
        }

        console.log("\n🎉 Processo de migração finalizado com sucesso!");
    } catch (error) {
        const err = error as ExecException; // Fazendo o type cast do erro do exec
        console.error(`❌ Ocorreu um erro durante a execução do comando npm.`);
        console.error(`Comando falhou com o código de saída: ${err.code}`);
        console.error('--- SAÍDA DO ERRO (stderr) ---');
        console.error(err.stderr);
        console.error('-----------------------------');
        console.log('O arquivo version.json não foi alterado devido ao erro.');
        process.exit(1);
    }
}

// Inicia a execução do script.
main();