# lda-front

Site pessoal de Leandro Damasio em SvelteKit.

## Desenvolvimento

```bash
cd lda-front/lda-front
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Conteúdo

- A home usa copy literal do Next antigo, seção por seção.
- As notas são carregadas de `notes/*.mdx`.
- Em produção, o loader tenta primeiro o S3 público `rbx-content` no prefixo `lda/notes/` e cai para o arquivo local quando necessário.
- O formulário de contato permanece ativo e envia para o backend RBX Comms.

## Idiomas

- PT-BR: `leandrodamasio.rbx.ia.br`
- EN: `leandrodamasio.rbxsystems.ch`
