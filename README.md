# Gio Nail Design ✨

Projeto restaurado por engenharia reversa a partir da publicação de produção no Netlify (`https://gionaildesign.netlify.app/`).

## 💅 Visão Geral
Website profissional para Nail Designer com design responsivo, galeria de trabalhos, agendamento interativo com integração direta ao WhatsApp e painel administrativo integrado com banco de dados **Turso (LibSQL)**.

## 📁 Estrutura do Projeto

```
gionails/
├── index.html              # Página principal (Landing page)
├── admin.html              # Painel Administrativo de agendamentos
├── package.json            # Configuração e dependências do projeto
├── package-lock.json       # Bloqueio de versões exatas de dependências
├── favicon.ico             # Ícone do site
├── assets/
│   ├── css/
│   │   └── style.css       # Estilos da landing page (Paleta Gold/Blush/Dark)
│   ├── js/
│   │   ├── main.js         # Lógica da landing page e modal de agendamento
│   │   ├── db.js           # Funções de integração HTTP com o Turso DB
│   │   └── config.js       # Configurações de conexão do Turso
│   └── images/             # Todas as fotos da galeria, perfil e banners
└── README.md
```

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js instalado (v16+)

### Instalação e Execução
1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor local:
   ```bash
   npm run dev
   ```
   Ou com Python se preferir:
   ```bash
   python -m http.server 3000
   ```

3. Abra no navegador:
   - **Landing Page:** [http://localhost:3000/](http://localhost:3000/)
   - **Painel Administrativo:** [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

---

## 🔐 Painel Administrativo (`admin.html`)
- **Senha padrão:** `1234`
- **Funcionalidades:**
  - Visualização de agendamentos pendentes, agendados para hoje e concluídos
  - Ação para marcar agendamentos como concluídos
  - Ação para cancelar agendamento e abrir WhatsApp com mensagem personalizada para o cliente
  - Botão de contato direto via WhatsApp com o número do cliente

---

## 🗄️ Banco de Dados (Turso)
O projeto conecta-se à API HTTP do Turso através do arquivo `assets/js/db.js` e credenciais em `assets/js/config.js`.
Tabela utilizada:
```sql
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
```

---

## 📤 Como Subir de Volta para o GitHub

1. Se ainda não tiver um repositório criado no GitHub, crie um novo repositório vazio (ex: `gionails` ou `gionaildesign`).
2. No terminal desta pasta, vincule e suba o código:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```
