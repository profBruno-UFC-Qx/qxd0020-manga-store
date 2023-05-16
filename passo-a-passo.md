# Executando a Manga Store

Aqui você encontra o passo a passo necessário para executar o projeto da Manga Store.

Primeiramente precisamos configurar e executar o **backend**. Atualmente existem duas opções. 

* Backend utilizando Strapi. Opção mais simples.
* Backend construído usando Node, Express, Type ORM e SQLite.


## Backend usando Strapi

O primeiro passo para rodar este backend é entra na pasta dele e instalar as suas dependências.

```
cd strapi-backend
yarn install # ou npm install
```

Depois disso você deve executá-lo com o seguinte comando:

```
yarn develop # ou npm run develop
```

Será necessário criar um usuário que será o **Administrador** do Strapi.


### Populando o backend

O backend será populado usando o código contido na pasta: **populateStrapi**.
Antes de executá-lo será necessário tornar pública as seguintes: /api/upload/ e /api/mangas

Para isso siga os vá até:

```
Settings -> USERS & PERMISSIONS PLUGIN -> Roles
```

Neste tela clique em **Public**.

Na seção **Permissions**, vá até Manga e libere a rota **create**. Então vá até Upload e libere a rota **upload**.

Agora você já pode executar o código da pasta **populateStrapi**. Para isso siga os seguintes passos:

```
cd populateStrapi
yarn install # npm install
yarn dev # ou npm run dev
```
Você deve ver no console várias mensagens referentes a adição de dados no backend, quando o console parar de ser atualizado, você pode matar a execução do processo usando CTLR-C.

Pronto, agora você deve **bloquear** as rotas recém liberadas.

### Liberando as rotas que garantem o funcionamento da Manga Store

Depois disso, será necessário configurar as rodas da públicas da API do Strapi, **já que por padrão elas são privadas**.

Antes disso crie o papel **Admin** que será utilizado pelo o admin da Manga Store. Para isso siga vá em:

```
Settings -> USERS & PERMISSIONS PLUGIN -> Roles -> Add new role
```
**É IMPORTANTE QUE O NOME DO PAPEL SEJA Admin**

Agora vá até:

```
Settings -> USERS & PERMISSIONS PLUGIN -> Roles
```

Neste tela clique em **Admin**.

Em Manga libere as seguintes rotas:

* create, update e delete

Em Upload libere as seguitnes rotas:

* upload

Agora volte até: 

```
Settings -> USERS & PERMISSIONS PLUGIN -> Roles
```

Neste tela clique em **Public**.

Em Comment libere as seguintes rotas:

* find

Em Manga libere as seguitnes rotas:

* find, findOne

Em Upload libere as seguitnes rotas:

* find, findOne


Agora o backend usando Strapi está pronto.

## Backend usando Node + Express


O primeiro passo para rodar este backend é entra na pasta dele e instalar as suas dependências.

```
cd backend
yarn install # ou npm install
```
Antes de você executar o projeto você precisará criar o arquivo chamado **.env**. Ele deve possuir o seguinte conteúdo:

DB_DATABASE=NOME_DO_ARQUIVO_QUE_SERA_USADO_PELO_SQLITE
SECRET_KEY=UMA_STRING_QUALQUER_QUE_SERA_O_SEGREDO_DA_API

Agora você deve executar o backend com:

```
yarn dev # ou npm run serve
```

Para popular o backend uso o seguinte commando:

```
yarn seed # ou npm run seed
```

Voilá. Tudo pronto. Lembrando que esse backend roda na porta 8080.


## Executando o frontend

Aqui os passos são mais simples. 

```
cd frontend
yarn install # ou npm install
```

Depois disso você deve executá-lo com o seguinte comando:

```
yarn dev # ou npm run dev
```

Façam bom proveito.
