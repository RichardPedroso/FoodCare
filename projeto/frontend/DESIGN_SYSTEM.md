# FoodCare - Sistema de Design

## 📋 Visão Geral

Este documento descreve o sistema de design clean e moderno implementado para o projeto FoodCare, mantendo a paleta de cores original e melhorando significativamente a experiência do usuário.

## 🎨 Paleta de Cores

### Cores Principais
```css
--primary-bg: #f3decc;        /* Fundo principal */
--secondary-bg: #f7dec7;      /* Fundo secundário */
--card-bg: #ffffff;           /* Fundo dos cards */
--primary-color: #9e6730;     /* Cor primária (marrom) */
--primary-hover: #cc7c46;     /* Hover da cor primária */
--primary-dark: #7a4f24;      /* Versão escura da cor primária */
```

### Cores de Destaque
```css
--accent-green: #537e37;      /* Verde principal */
--accent-green-light: #5a863d; /* Verde claro */
--accent-red: #b03648;        /* Vermelho para alertas */
--accent-orange: #ff952b;     /* Laranja para links */
```

### Cores de Texto
```css
--text-primary: #2a2a2a;      /* Texto principal */
--text-secondary: #666666;    /* Texto secundário */
--text-light: #999999;        /* Texto claro */
```

## 🔧 Componentes Base

### Botões
```html
<!-- Botão Primário -->
<button class="btn btn-primary">Ação Principal</button>

<!-- Botão Secundário -->
<button class="btn btn-secondary">Ação Secundária</button>

<!-- Botão de Sucesso -->
<button class="btn btn-success">Confirmar</button>

<!-- Botão de Perigo -->
<button class="btn btn-danger">Excluir</button>

<!-- Botão Grande -->
<button class="btn btn-primary btn-large">Botão Grande</button>

<!-- Botão Pequeno -->
<button class="btn btn-primary btn-sm">Pequeno</button>
```

### Cards
```html
<div class="card">
  <h3>Título do Card</h3>
  <p>Conteúdo do card...</p>
</div>
```

### Container
```html
<div class="container">
  <!-- Conteúdo com largura máxima e centralizado -->
</div>
```

## 📐 Sistema de Espaçamento

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
```

### Classes Utilitárias
```html
<!-- Margens -->
<div class="mt-sm">Margin top small</div>
<div class="mb-lg">Margin bottom large</div>

<!-- Padding -->
<div class="p-md">Padding medium</div>

<!-- Flexbox -->
<div class="flex items-center justify-between gap-md">
  <span>Item 1</span>
  <span>Item 2</span>
</div>
```

## 📱 Responsividade

O sistema utiliza breakpoints padrão:
- **Mobile**: até 480px
- **Tablet**: 481px - 768px
- **Desktop**: 769px+

### Grid Responsivo
```html
<div class="actions-grid">
  <!-- Itens se ajustam automaticamente -->
</div>
```

## 🎭 Animações

### Fade In
```html
<div class="fade-in">
  <!-- Conteúdo com animação de entrada -->
</div>
```

### Transições
```css
/* Transições pré-definidas */
--transition-fast: 0.15s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.5s ease;
```

## 📝 Tipografia

### Tamanhos de Fonte
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 2rem;      /* 32px */
```

### Classes de Texto
```html
<h1 class="text-center font-bold">Título Centralizado</h1>
<p class="text-secondary">Texto secundário</p>
<span class="text-success">Texto de sucesso</span>
<span class="text-danger">Texto de erro</span>
```

## 🎯 Boas Práticas

### 1. Estrutura de Página
```html
<div class="page-container">
  <div class="container">
    <header class="page-header fade-in">
      <h1 class="page-title">Título da Página</h1>
      <p class="page-subtitle">Subtítulo explicativo</p>
    </header>
    
    <main class="page-content">
      <!-- Conteúdo principal -->
    </main>
  </div>
</div>
```

### 2. Cards de Ação
```html
<div class="action-card card" routerLink="/destino">
  <div class="action-icon">🎯</div>
  <h3>Título da Ação</h3>
  <p>Descrição da ação</p>
  <mat-icon class="action-arrow">arrow_forward</mat-icon>
</div>
```

### 3. Formulários
```html
<form class="auth-form">
  <div class="form-group">
    <mat-form-field appearance="outline" class="full-width">
      <mat-label>Campo</mat-label>
      <input matInput placeholder="Placeholder">
      <mat-icon matPrefix>icon_name</mat-icon>
    </mat-form-field>
  </div>
</form>
```

## ♿ Acessibilidade

### Estados de Foco
Todos os elementos interativos possuem estados de foco visíveis:
```css
.btn:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

### Contraste
- Todas as combinações de cores atendem aos padrões WCAG AA
- Textos possuem contraste mínimo de 4.5:1

### Navegação por Teclado
- Todos os elementos são acessíveis via teclado
- Ordem de tabulação lógica e intuitiva

## 🚀 Como Aplicar em Novas Páginas

1. **Estrutura Base**:
   ```html
   <div class="page-container">
     <div class="container">
       <!-- Seu conteúdo aqui -->
     </div>
   </div>
   ```

2. **Use as Classes Utilitárias**:
   - Prefira classes utilitárias para espaçamentos
   - Use o sistema de grid responsivo
   - Aplique animações com `fade-in`

3. **Mantenha a Consistência**:
   - Use sempre as variáveis CSS definidas
   - Siga os padrões de nomenclatura
   - Teste em diferentes dispositivos

## 📦 Arquivos Principais

- `src/styles.css` - Sistema de design global
- `src/app/views/land/land.component.*` - Página de landing
- `src/app/views/account/sign-in/sign-in.component.*` - Login
- `src/app/views/account/sign-up/sign-up.component.*` - Cadastro
- `src/app/views/app/main/main.component.*` - Dashboard principal
- `src/app/views/app/about-us/about-us.component.*` - Sobre nós

## 🎉 Resultado

O novo sistema de design oferece:
- ✅ Interface limpa e moderna
- ✅ Experiência de usuário aprimorada
- ✅ Responsividade completa
- ✅ Acessibilidade garantida
- ✅ Manutenção simplificada
- ✅ Paleta de cores original preservada
- ✅ Animações suaves e profissionais

---

**Desenvolvido com ❤️ para o projeto FoodCare**