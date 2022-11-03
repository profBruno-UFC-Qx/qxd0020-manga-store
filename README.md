# Manga Store

Uma loja online destinada a vendas de Mangás.

Para executar este projeto siga os passos descritos no arquivo [passo-a-passo](passo-a-passo.md)

## Membros da equipe

Bruno Góis Mateus, 2142315, Engenharia de Software

## Papéis ou tipos de usuário da aplicação

- Usuário não registrado
- Usuário registrado
- Administrador

## Entidades ou tabelas do sistema

- Usuário
- Mangá
- Comentário

## Principais funcionalidades da aplicação

- Usuário não registrador poderão ver os mangá e os comentários feitos por usuários registrados.
- Usuário registrador pode listar os mangás e seus detalhes, assim como usuários não registrados. 
Adicionalmente, eles podem escrever comentários sobre os mangás.
- O adminstrador da loja pode: adicionar, remover e editar os mangás.

## Tecnologias e frameworks utilizados

**Frontend:**

- VueJS v3.0, Vue-Router e Pinia.
- Axios

**Backend:**

- Strapi


## Operações implementadas para cada entidade da aplicação


| Entidade| Criação | Leitura | Atualização | Remoção |
| --- | --- | --- | --- | --- |
| Usuário |  |  |  |  |
| Mangá | X  | X |  X | X |
| Comentário | X |  X  |  |  |

> Lembre-se que é necessário implementar o CRUD de pelo menos duas entidades.

## Rotas da API REST utilizadas

| Método HTTP | URL |
| --- | --- |
| POST | /auth/local |
| GET | /users/me |
| GET | /api/mangas |
| GET | /api/mangas/{id} |
| POST | /api/mangas |
| PUT | /api/mangas/{id} |
| DELETE | /api/mangas/{id} |
