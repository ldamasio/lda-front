# lda-front
Site pessoal de Leandro Damasio em SvelteKit.
## Desenvolvimento
cd lda-front/lda-front
npm install
- A home usa copy literal do Next antigo, seção por seção.
- As notas e o blog são carregados server-side do Contabo S3 (`rbx-content`) sem fallback local.
- O formulário de contato permanece ativo e envia para o backend RBX Comms.
- PT-BR: `leandrodamasio.rbx.ia.br`
- EN: `leandrodamasio.rbxsystems.ch`
- Idiomas extras usam prefixo de path (`/pt`, `/de`, `/es`, `/fr`, `/it`, `/zh`).
