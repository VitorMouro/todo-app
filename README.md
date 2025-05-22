<p align="center">
  <!-- Logo SVG -->
  <img src="docs/vilista_full_light.svg" alt="Logo Vilista" height="80" />
</p>

---

Este projeto é um aplicativo de lista de tarefas (Todo App) desenvolvido como forma de estudo e aprimoramento em tecnologias modernas de desenvolvimento web.

## 📸 Imagens do Projeto

![](docs/video.mp4)

## ✨ Funcionalidades

- Cadastro e autenticação de usuários
- Criação, edição e exclusão de listas de tarefas
- Adição, edição e remoção de tarefas
- Marcação de status das tarefas (pendente, em andamento, concluída)
- Visualização de tarefas por lista
- Interface responsiva e moderna
- Temas claro e escuro

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React, TypeScript, Vite, TailwindCSS, Radix UI, Lucide Icons, ShadCN
- **Backend:** Node.js, Express, TypeScript, PostgreSQL
- **Outros:** Axios, React Router, ESLint, Zod, Passport, Docker

## 🚀 Como rodar o projeto localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/VitorMouro/vilista.git
   cd vilista
   ```

2. **Configure as variáveis de ambiente:**
   ```bash
   cp template.env .env
   # Edite o .env conforme necessário
   ```

3. **Suba os containers com Docker Compose:**
   ```bash
   docker compose up --build
   ```

4. **Acesse:**  
   Abra [http://localhost:5173](http://localhost:5173) no navegador.

## 📚 Observações

- Este projeto foi desenvolvido para fins de estudo e aprimoramento pessoal.
- Sinta-se à vontade para utilizar, modificar e sugerir melhorias!

## 📝 Licença

Uso livre para fins de estudo e aprendizado.

## 🔮 Melhorias Futuras / TODOs

- Implementar testes automatizados (unitários e integração)
- Adicionar autenticação via OAuth (Google, GitHub)
- Melhorar acessibilidade
- Internacionalização
- Notificações em tempo real
- Upload de arquivos/anexos nas tarefas
- Melhorias de performance e otimização
- Refatoração e modularização do código
- Suporte a Markdown
- Modo Vi
