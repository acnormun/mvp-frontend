# Projeto Front-End: Agrupamentos de Madeira

Este projeto é uma aplicação front-end simples em HTML, CSS (com Bootstrap) e JavaScript puro. Ele consome uma API em Flask e permite gerenciar agrupamentos de madeira.

---

## 📦 Funcionalidades

- ✅ Cadastro de agrupamentos com ID, quantidade de toras e peso
- ✅ Listagem de agrupamentos
- ✅ Edição de agrupamentos via modal
- ✅ Exclusão
- ✅ Navegação entre páginas com JS
- ✅ Estilização com Bootstrap 5.3
- ✅ Comunicação com API externa para cálculo de frete (via botão ou integração futura)

---

## 🚀 Como rodar

### Método 1: Localmente

1. Clone o repositório:
```bash
git clone https://github.com/seuusuario/mvp-sprint1-webapp.git
cd mvp-sprint1-webapp
```

2. Rode a API back-end Flask localmente (em outra aba ou container).

3. Abra o `index.html` em seu navegador.

> **Importante:** a API precisa estar rodando em `http://127.0.0.1:5000` para o front funcionar corretamente.

### Método 2: Usando Docker

1. Clone o repositório:
```bash
git clone https://github.com/acnormun/mvp-frontend.git
cd mvp-frontend
```

2. Construa a imagem Docker:
```bash
docker build -t mvp-frontend .
```

3. Execute o container:
```bash
docker run -p 80:80 mvp-frontend
```

4. Acesse a aplicação em `http://localhost:80`

> **Nota:** Certifique-se de que a API back-end esteja acessível e configurada corretamente para comunicação com o front-end.

---

## 🧱 Estrutura de Arquivos

```
📁 mvp-sprint1-webapp
├── index.html
├── style.css
├── app.js
├── Dockerfile
└── nginx.conf
```

---

## 🌐 Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript ES6
- Bootstrap 5.3
- Docker
- Nginx

---

## 🧪 Integração com API

Esta aplicação faz requisições RESTful para os seguintes endpoints da API em Flask:

- `GET /buscar_agrupamentos`
- `POST /cadastrar_agrupamento`
- `PUT /editar_agrupamento/<id>`
- `DELETE /deletar_agrupamento/<id>`

---

## 📜 Licença

Projeto open-source sob licença MIT.

---

Feito por ACNormun 🐝
