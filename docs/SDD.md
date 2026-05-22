# Software Design Document (SDD) - OrcaFácil (euCotei)

## 1. Visão Geral
O **OrcaFácil** (internamente chamado de *euCotei*) é uma aplicação web voltada para prestadores de serviços, cujo objetivo principal é facilitar a criação, gestão e geração de orçamentos em formato PDF.
Atualmente, o projeto está estruturado em uma arquitetura monolítica, contendo toda a interface (HTML), estilos (CSS) e lógica de negócio (JavaScript) em um único arquivo (`index.html`). A aplicação funciona inteiramente no lado do cliente (Client-Side), garantindo agilidade e suporte offline via PWA.

## 2. Arquitetura Atual
- **Monolito Single-File**: Todo o código está concentrado no `index.html` (aprox. 1000 linhas).
- **Tecnologias Base**: HTML5, Vanilla CSS com variáveis para o design system, Vanilla JavaScript (ES6+).
- **PWA**: Possui arquivo `manifest.json` e metas para instalação mobile.
- **Gerador de PDF**: Utiliza a biblioteca externa `jspdf` via CDN.
- **Armazenamento**: Depende inteiramente do `localStorage` do navegador para persistir dados, sem um backend ou banco de dados remoto ativo.

## 3. Modelo de Dados (LocalStorage)
O banco de dados local utiliza as seguintes chaves para persistência:
- `ec_sess`: Armazena o *username* do usuário logado no momento.
- `ec_acc`: Armazena um objeto JSON com todos os usuários cadastrados. As chaves são os usernames, e os valores contêm a senha (codificada em base64) e o nome da empresa.
- `ec_emp_{user}`: Objeto JSON com as configurações da empresa do usuário, contendo campos como: `nome`, `doc`, `tel`, `email`, `site`, `end`, `validade`, `pagamento`, `obs`.
- `ec_logo_{user}`: Imagem da logo da empresa em formato Base64.
- `ec_orc_{user}`: Array contendo todos os orçamentos gerados pelo usuário.
- `ec_cnt_{user}`: Contador de orçamentos para gerar IDs sequenciais (Nº 001, 002, etc).

## 4. Estrutura de Interface e Telas
O design é responsivo, apresentando Sidebar em Desktop e Bottom Navigation em Mobile. As seções da interface são ativadas/desativadas via manipulação de classes CSS (ex: `.active` e `display: none`).

### 4.1. Tela de Autenticação (`#auth-screen`)
- Abas para Login e Criação de Conta.
- Validação básica de campos.
- Registro cria chaves automáticas para o novo usuário no `localStorage`.

### 4.2. Aplicação Principal (`#app`)
- **Navegação**: 
  - Desktop: Sidebar (`.sidebar`) com perfil do usuário e botão de sair.
  - Mobile: Header (`.mobile-header`) com a logo e logout, e Bottom Nav (`.bottom-nav`).
- **Dashboard (Orçamentos)**: 
  - Cards com métricas de negócio (Total, Pendentes, Valor Total).
  - Tabela listando os orçamentos (Nº, Cliente, Data, Status, Total).
  - Empty State caso não existam orçamentos.
- **Minha Empresa**: 
  - Formulário para upload de Logo.
  - Dados cadastrais (Nome/Razão Social, CPF/CNPJ, Contatos, Endereço).
  - Definição de padrões para orçamentos (validade, pagamento, observações).

### 4.3. Modais (Overlays)
- **Modal de Orçamento (`#ov-orca`)**: Formulário central onde se informa dados do cliente, itens/serviços, pagamentos e observações. É a partir dele que os orçamentos são salvos e os PDFs são gerados.
- **Modal de Item (`#ov-item`)**: Formulário filho para adicionar um novo serviço ou produto ao orçamento, com cálculo automático de subtotal.

## 5. Fluxos e Processos Principais
- **Autenticação e Sessão**: O JS checa ao iniciar se existe `ec_sess`. Se existir, pula a tela de auth e carrega os dados referentes àquele `{user}`.
- **Edição de Orçamentos**: Clicar em um item da tabela popula o `currentItems` e abre o Modal já preenchido.
- **Geração do PDF**: A função `gerarPDF()` instancia um `jsPDF`, desenha retângulos, insere textos alinhados dinamicamente com base nas margens (`doc.text`, `doc.rect`, `doc.line`) e realiza as quebras de linha para observações e itens na tabela do PDF, para então acionar o download do arquivo.

## 6. Pontos Críticos para Refatoração
A atual estrutura funciona de modo autônomo, porém impõe algumas limitações para evolução:
1. **Dificuldade de Manutenção**: O arquivo HTML de mais de 900 linhas mistura responsabilidades (UI, Estilos, Lógica, Armazenamento, Geração de PDF).
2. **Escalabilidade**: Adicionar novas rotas, modais ou integrações (como backends de verdade ou APIs) tornará o arquivo inavegável.
3. **Reusabilidade de UI**: Não existem componentes (como inputs estilizados e cards); tudo depende de repetição de HTML ou muito seletor CSS específico.
4. **Segurança e Estado**: Senhas guardadas no localStorage em Base64 não são seguras, e a gestão de estado global (ex: variáveis `user`, `empresa`, `orcamentos`) é mutável e pode causar bugs difíceis de rastrear.

*(Este documento servirá de base para a arquitetura do novo projeto modular.)*
