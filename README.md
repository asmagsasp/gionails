# Gio Nail Design & Plataforma Multi-Tenant para Salões ✨

Website profissional e plataforma SaaS para Nail Designers e Salões de Beleza com agendamento online integrado ao WhatsApp, personalização visual completa em tempo real e painel administrativo integrado ao banco de dados **Turso (LibSQL)**.

---

## 💅 Visão Geral do Sistema Multi-Tenant

O projeto suporta múltiplos salões/clientes em uma **única instalação**:
- Cada salão possui sua própria landing page personalizada (textos, logotipo, fotos, serviços, preços e paleta de cores).
- Cada salão possui seu próprio painel administrativo isolado para gerenciar apenas seus agendamentos e seu próprio site.
- **Super Admin Integrado:** Crie e publique um novo salão em 20 segundos!

---

## 🌐 Como Funciona o Roteamento de Salões

- **Salão Padrão (Gio Nail Design):**
  - Landing Page: `https://seu-site.vercel.app/` ou `http://localhost:3000/`
  - Painel Admin: `https://seu-site.vercel.app/admin.html?salon=gionails`
- **Qualquer Outro Salão (ex: `bellanails`):**
  - Landing Page: `https://seu-site.vercel.app/s/bellanails` ou `?salon=bellanails`
  - Painel Admin: `https://seu-site.vercel.app/admin.html?salon=bellanails`

---

## 🔐 Painel Administrativo (`admin.html`)

- **Senha Padrão do Salão:** `1234` (ou a senha configurada para aquele salão)
- **Senha Master (Super Admin):** `adminmaster` (permite gerenciar qualquer salão e cadastrar novos clientes)

### 📌 Abas Disponíveis no Painel:
1. **📅 Agendamentos:**
   - Visualização de agendamentos com filtros em abas: *Todos*, *Pendentes*, *Para Hoje*, *Concluídos* e *Cancelados*
   - Layout responsivo automático em Cards para smartphone
   - Concluir, Cancelar (com confirmação para WhatsApp) e Excluir definitivo do banco
2. **🎨 Personalizar Site:**
   - Altere o Nome, Frase de impacto, Textos "Sobre Mim", Telefone WhatsApp, Instagram e Endereço
   - **Seletor de Cor Primária (HEX):** Mude a cor do site em tempo real (Dourado, Rosa Pink, Roxo, Esmeralda, etc.)
   - Foto de perfil e imagem de fundo do topo
3. **💅 Meus Serviços:**
   - Adicione novos serviços com nome, descrição, ícone e preço
   - Altere preços rapidamente e exclua serviços obsoletos
4. **📸 Galeria de Fotos:**
   - Adicione fotos ao portfólio via URL
   - Exclua fotos antigas com 1 clique
5. **👑 Super Admin (Modo Master):**
   - Cadastre um novo salão preenchendo apenas Nome, Slug, WhatsApp e Cor
   - O sistema gera o site, copia os serviços e fotos base e entrega os links prontos na hora!

---

## 🗄️ Estrutura do Banco de Dados (Turso)

1. **`salons`**: Dados cadastrais, cores e textos de cada salão
2. **`services`**: Tabela de serviços associada por `salon_id`
3. **`gallery`**: Portfólio de imagens associado por `salon_id`
4. **`bookings`**: Agendamentos realizados vinculados a cada `salon_id`

---

## 🚀 Como Executar Localmente

```bash
npm run dev
```
Acesse: [http://localhost:3000/](http://localhost:3000/) | Admin: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

---

## 📤 Deploy na Vercel

O projeto possui `vercel.json` configurado com rotas dinâmicas `/s/:salon`.
Ao enviar para o GitHub (`git push origin main`), o deploy na Vercel é 100% automático.


