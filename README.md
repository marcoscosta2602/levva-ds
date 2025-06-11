# Levva Design System

Este é o repositório oficial do **Levva Design System**, baseado em tecnologias modernas como React, Tailwind CSS e Radix UI. Ele foi desenvolvido com foco em reutilização, consistência visual e facilidade de personalização para produtos white label.

## ✨ Tecnologias Utilizadas

- [React 18+](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📦 Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/sua-org/levva-ds.git
   cd levva-ds
   ```

2. **Instale as dependências**:
   ```bash
   pnpm install
   ```

3. **Rode o app principal (`apps/levva-ds`) localmente**:
   ```bash
   pnpm dev --filter apps/levva-ds
   ```

---

## 🎨 Personalização

Você pode alterar facilmente:
- **Cores** e **tipografia** no arquivo `tailwind.config.ts`
- Tokens de tema em `components/theme.ts` (se aplicável)
- Componentes reutilizáveis em `apps/levva-ds/components/ui`

### Exemplo de cor padrão Levva:
```ts
colors: {
  primary: '#ffc800',
  secondary: '#292829',
}
fontFamily: {
  sans: ['Poppins', 'sans-serif'],
}
```

---

## 🧱 Estrutura do Projeto

```
levva-ds/
├── apps/
│   └── levva-ds/       → App principal que consome os componentes
├── components/
│   └── ui/             → Componentes reutilizáveis do design system
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 📄 Licença

Este projeto é distribuído sob a licença MIT. Consulte o arquivo `LICENSE.md` para mais informações.