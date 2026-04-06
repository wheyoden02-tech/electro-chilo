# TECH_STACK.md — ElectroRepara

## Stack Principal
- **Framework**: React 18 + TypeScript 5
- **Bundler**: Vite 5
- **Estilos**: Tailwind CSS v3 con design tokens en `index.css`
- **Componentes**: shadcn/ui (customizados con tema cyberpunk)
- **Animaciones**: Framer Motion para micro-interacciones
- **Íconos**: Lucide React

## Hero — Slot GSAP
El Hero contiene un `div#gsap-hero-container` preparado para recibir una animación GSAP de 3 capas PNG (Nintendo Switch desarmada).

### Integración esperada:
1. Importar GSAP y ScrollTrigger
2. Colocar 3 imágenes PNG (carcasa, placa, joy-cons) como `position: absolute` dentro de `#gsap-hero-container`
3. Animar con timeline GSAP: parallax de capas al hacer scroll
4. Las imágenes deben tener `z-index` escalonado

## Estructura de Archivos
```
src/
├── components/
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── ServicesGrid.tsx
│   ├── TrustSection.tsx
│   ├── Footer.tsx
│   └── WhatsAppFloat.tsx
├── pages/
│   └── Index.tsx
└── index.css (design system)
```
