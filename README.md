# Workflash Tecnologia — Landing Page v1

Site estático responsivo em HTML, CSS e JavaScript.

## Visualizar
Abra `index.html` no navegador, ou utilize a extensão Live Server no VS Code.

## Personalizar antes de publicar
1. No `script.js`, substitua `CONTATO@SEU-DOMINIO.COM.BR` pelo endereço comercial real. Até lá, o formulário avisa que falta configurar o destinatário e não envia nada.
2. Revise os textos de serviços, a descrição institucional e os dados da empresa.
3. O símbolo em `assets/logo-symbol.svg` é uma **reconstrução vetorial aproximada** do conceito aprovado em imagem; substitua pelo vetor oficial quando ele estiver disponível.
4. Confira domínio, DNS e HTTPS antes de divulgar. Não há integração de backend no formulário; ele abre o aplicativo de e-mail do visitante.

## Publicar no GitHub Pages
1. Crie um repositório, adicione os arquivos preservando as pastas e faça o push.
2. Em Settings > Pages, selecione Deploy from a branch, branch `main`, pasta `/ (root)`.
3. Quando o domínio estiver registrado, configure `www.workflash.tec.br` como Custom domain nas configurações de Pages e crie os registros DNS conforme as instruções atuais do GitHub.
4. Ative Enforce HTTPS quando disponível. O domínio indicado não foi verificado como registrado.

## Estrutura
- `index.html` — conteúdo e SEO básico
- `styles.css` — identidade visual e responsividade
- `script.js` — menu, ano e formulário via e-mail
- `assets/` — símbolo e favicon

## Futuro
Separar seções em páginas de Soluções, Abordagem, Sobre e Contato; integrar formulário com serviço de backend e adicionar política de privacidade adequada.
