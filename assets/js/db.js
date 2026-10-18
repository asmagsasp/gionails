import { dbConfig } from './config.js';

// Como o SDK do LibSQL é pesado para rodar direto no navegador sem um bundler, 
// usaremos a API HTTP do Turso (LibSQL Remote Protocol) que é nativa e rápida.

export async function executeQuery(sql, args = []) {
    try {
        const response = await fetch(`${dbConfig.url.replace('libsql://', 'https://')}/v2/pipeline`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${dbConfig.authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requests: [
                    { type: 'execute', stmt: { sql, args: args.map(arg => ({ type: 'text', value: String(arg) })) } },
                    { type: 'close' }
                ]
            })
        });

        const data = await response.json();

        if (data.results && data.results[0] && data.results[0].response) {
            const result = data.results[0].response.result;

            // Formatar o resultado para ser mais fácil de usar (array de objetos)
            if (result.rows && result.cols) {
                return result.rows.map(row => {
                    const obj = {};
                    result.cols.forEach((col, i) => {
                        obj[col.name] = row[i].value;
                    });
                    return obj;
                });
            }
            return result;
        }
        return data;
    } catch (error) {
        console.error("Erro no Banco de Dados:", error);
        throw error;
    }
}

export async function initDb() {
    const sql = `
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            service TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            phone TEXT NOT NULL, 
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;
    return executeQuery(sql);
}
