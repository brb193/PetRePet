# PRD — PetRePet

## 1. Objetivo deste documento

Este documento descreve o produto e especifica as telas para criar um protótipo visual no Google Stitch. O código atual é a fonte de verdade para as funcionalidades existentes. Telas de cadastro e gestão descritas como **propostas** são uma expansão visual coerente com o modelo de dados, mas ainda não estão implementadas no sistema.

## 2. Visão do produto

**PetRePet** é um sistema web de gestão para uma clínica veterinária. Seu objetivo é reunir em um só lugar as informações de clientes, animais, equipe veterinária e atendimentos, incluindo diagnósticos e prescrições.

O sistema deve ser simples de aprender e usar durante a rotina da clínica. A experiência deve priorizar identificação rápida do animal e do tutor, consulta de informações essenciais e acesso às ações permitidas para cada perfil.

### Público-alvo

- **Administrador:** configura perfis e usuários e tem acesso amplo às áreas de gestão.
- **Recepcionista:** organiza clientes, pets e atendimentos.
- **Veterinário:** consulta pets e atendimentos e registra prescrições.

Os três nomes de perfil são definidos no projeto: `ADMIN`, `RECEPCIONISTA` e `VETERINARIO`.

## 3. Escopo e estado atual

### Implementado no código

- Autenticação por e-mail e senha.
- Sessão autenticada e encerramento de sessão.
- Redirecionamento da página inicial para login ou dashboard, conforme a sessão.
- Dashboard com saudação, nome do usuário, perfil e navegação filtrada pelo perfil.
- Modelos de dados para perfis, usuários, clientes, pets, atendimentos e prescrições.
- Layout responsivo básico com Bootstrap 5.

### Ainda não implementado

Embora apareçam como opções de menu no dashboard, as páginas de gestão não estão implementadas no código atual. Não há, neste momento, CRUD de perfis, usuários, clientes, pets, atendimentos ou prescrições, nem indicadores ou agenda funcional.

Para o protótipo, as telas dessas áreas abaixo devem ser tratadas como **propostas de interface**, não como descrição de comportamento já disponível.

## 4. Estrutura de navegação

### ADMIN

- Dashboard
- Perfis
- Usuários
- Clientes
- Pets
- Atendimentos
- Sair

### RECEPCIONISTA

- Dashboard
- Clientes
- Pets
- Atendimentos
- Sair

### VETERINARIO

- Dashboard
- Pets
- Atendimentos
- Prescrições
- Sair

O dashboard atual apresenta os itens como cartões de navegação. No protótipo expandido, usar uma navegação lateral em telas desktop e um menu recolhível em telas menores, preservando exatamente as permissões e os nomes por perfil acima.

## 5. Requisitos das telas

### 5.1 Login — implementado

**Objetivo:** permitir acesso ao sistema da clínica.

**Elementos existentes:**

- Marca/nome PetRePet.
- Texto de apoio: “Acesse o sistema da clínica veterinária.”
- Campo de e-mail.
- Campo de senha.
- Botão primário “Entrar”.
- Mensagem de erro quando os dados são inválidos ou estão ausentes.
- E-mail informado permanece preenchido após erro; senha não deve ser exibida novamente.

**Comportamento:** ao autenticar, seguir para o dashboard. Se já houver sessão ativa, abrir diretamente o dashboard.

**Direção visual para Stitch:** página limpa e acolhedora, formulário centralizado em cartão, boa hierarquia, foco no formulário e sem distrações. Não inventar login social, recuperação de senha ou cadastro público: essas funcionalidades não estão especificadas no produto atual.

### 5.2 Dashboard — implementado, com expansão visual proposta

**Objetivo:** orientar o usuário e oferecer acesso rápido às áreas liberadas para seu perfil.

**Conteúdo implementado:**

- Título “PetRePet”.
- Subtítulo “Painel de gestão da clínica”.
- Saudação com o nome do usuário.
- Identificação do perfil.
- Cartões de navegação conforme o perfil.
- Ação “Sair”.

**Proposta visual:** manter a saudação como elemento secundário e dar destaque aos acessos principais. Pode-se representar uma visão geral da rotina, mas não desenhar números, gráficos ou alertas como dados existentes: não há indicadores implementados nem dados de dashboard definidos.

### 5.3 Perfis — proposta (ADMIN)

**Objetivo:** visualizar os perfis disponíveis para controle de acesso.

**Tela de lista:** tabela ou lista com nome do perfil e quantidade de usuários, se esse dado estiver disponível no protótipo. Ações de visualizar/editar só devem aparecer como elementos conceituais; o modelo atual armazena o nome do perfil e o relaciona aos usuários.

**Dados conhecidos:** nome do perfil. Perfis padrão: Administrador, Veterinário e Recepcionista (valores internos: `ADMIN`, `VETERINARIO`, `RECEPCIONISTA`).

### 5.4 Usuários — proposta (ADMIN)

**Objetivo:** apresentar a equipe com acesso ao sistema.

**Lista:** nome, e-mail e perfil; busca por nome/e-mail e filtro por perfil podem ser representados como controles visuais propostos.

**Formulário:** nome, e-mail, senha e perfil.

**Modelo conhecido:** usuário tem nome, e-mail único, senha armazenada de forma protegida e um perfil. Para protótipo, não mostrar senha em listas ou detalhes.

### 5.5 Clientes — proposta (ADMIN e RECEPCIONISTA)

**Objetivo:** cadastrar e consultar tutores dos pets.

**Lista:** nome, CPF e telefone; indicar também a quantidade de pets quando útil.

**Formulário:** nome, CPF, telefone e endereço (opcional).

**Detalhe do cliente:** dados de contato e pets associados, se desejado como extensão visual do modelo.

**Modelo conhecido:** CPF é único; endereço é opcional. O cadastro de pets está relacionado ao cliente.

### 5.6 Pets — proposta (ADMIN, RECEPCIONISTA e VETERINARIO)

**Objetivo:** consultar o cadastro e o histórico de cada animal.

**Lista:** nome do pet, espécie, raça, tutor e, quando informado, data de nascimento.

**Formulário:** nome, espécie, raça, data de nascimento (opcional) e cliente/tutor.

**Detalhe do pet:** resumo do animal e dados do tutor; pode apresentar atendimentos relacionados como extensão visual do modelo.

**Modelo conhecido:** pet pertence a um cliente; espécie e raça são campos de texto; data de nascimento é opcional.

### 5.7 Atendimentos — proposta (ADMIN, RECEPCIONISTA e VETERINARIO)

**Objetivo:** organizar e consultar atendimentos veterinários.

**Lista:** data e hora, pet, tutor, veterinário e status. Permitir destaque visual do status, sem presumir um fluxo além do valor padrão `AGENDADO`.

**Formulário:** pet, veterinário, data/hora, diagnóstico, status e valor. Diagnóstico e valor são opcionais no modelo. A data do atendimento recebe a data/hora atual por padrão.

**Detalhe:** dados do atendimento, pet, veterinário, diagnóstico, status, valor e prescrições associadas.

**Nota:** o modelo possui um campo de status textual com padrão `AGENDADO`, mas não define uma lista fechada de estados nem transições. Não inventar estados adicionais como concluído ou cancelado como regra do sistema.

### 5.8 Prescrições — proposta (VETERINARIO)

**Objetivo:** apresentar medicamentos e instruções ligados a um atendimento.

**Lista/detalhe:** atendimento relacionado, medicamento, dosagem e instruções.

**Formulário:** atendimento, medicamento, dosagem e instruções (opcional).

**Modelo conhecido:** toda prescrição pertence a um atendimento; medicamento e dosagem são obrigatórios; instruções são opcionais.

## 6. Fluxos principais

### Acesso ao sistema

1. Usuário abre o sistema.
2. Sem sessão, é direcionado ao login.
3. Informa e-mail e senha.
4. Em caso de erro, visualiza uma mensagem clara e pode tentar novamente.
5. Em caso de sucesso, acessa o dashboard com o nome e o perfil corretos.
6. Ao selecionar “Sair”, encerra a sessão e retorna ao login.

### Rotina prevista da clínica (proposta)

1. Recepção localiza ou cadastra um cliente.
2. Associa um pet ao cliente.
3. Registra ou consulta um atendimento, associando pet e veterinário.
4. Veterinário consulta os dados do pet e do atendimento e registra diagnóstico e prescrição.
5. Usuários acessam apenas as áreas correspondentes ao seu perfil.

Este fluxo orienta os protótipos; exceto autenticação e navegação do dashboard, os passos ainda não representam funcionalidades implementadas.

## 7. Direção visual

- **Idioma:** português do Brasil em toda a interface; datas e valores em formatos brasileiros.
- **Personalidade:** acolhedora, profissional, confiável e ligada ao cuidado animal; evitar estética infantil ou excessivamente lúdica.
- **Estilo:** interface web contemporânea, limpa, organizada e fácil de ler em ambiente de trabalho.
- **Hierarquia:** títulos claros, ações primárias evidentes, informações secundárias discretas.
- **Componentes:** formulários com rótulos persistentes, tabelas/listas legíveis, cartões de resumo, badges de perfil/status e confirmações para ações destrutivas caso apareçam no protótipo.
- **Cores:** base clara e neutra, com uma cor primária consistente para ações e navegação; contraste suficiente para texto e estados.
- **Ícones:** simples e acompanhados de rótulos quando a ação não for universalmente reconhecível.
- **Responsividade:** priorizar desktop para tabelas e rotinas administrativas; adaptar listas e formulários a telas estreitas sem perda de ações importantes.
- **Acessibilidade:** contraste adequado, navegação por teclado, foco visível, campos associados aos rótulos e mensagens de erro compreensíveis.

O código atual usa Bootstrap 5 com fundo claro, cartões, botões primários e layout responsivo básico. A direção acima mantém essa base sem exigir que Stitch replique o layout existente pixel a pixel.

## 8. Dados de exemplo para o protótipo

Usar dados fictícios, claramente não reais. Exemplo para preencher as telas:

- Usuária: Marina Costa — `RECEPCIONISTA`
- Veterinário: Dr. Rafael Lima — `VETERINARIO`
- Cliente: Ana Souza — telefone fictício e CPF mascarado/fictício
- Pet: Luna — Cachorro — SRD
- Atendimento: Luna com Dr. Rafael Lima — status `AGENDADO`
- Prescrição: medicamento e dosagem fictícios, vinculados a um atendimento

Não utilizar dados pessoais reais nem representar os dados de exemplo como registros existentes.

## 9. Instrução resumida para gerar as telas no Google Stitch

Crie um protótipo responsivo em português do Brasil para o PetRePet, um sistema profissional e acolhedor de gestão de clínica veterinária. Gere telas de login, dashboard por perfil e telas conceituais de lista, cadastro e detalhe para perfis, usuários, clientes, pets, atendimentos e prescrições conforme este PRD. Respeite as permissões de navegação de ADMIN, RECEPCIONISTA e VETERINARIO; mantenha uma identidade visual clara, acessível e consistente; use apenas dados fictícios. Diferencie o login e o dashboard existentes das páginas de gestão propostas. Não invente métricas, agenda funcional, recuperação de senha, login social ou regras de status não especificadas.
