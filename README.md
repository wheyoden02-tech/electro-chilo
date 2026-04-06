# ElectroRepara — Documentación + Overview del Proyecto  
**Última actualización:** 06/04/2026  
**Estado:** 🔄 *Pendiente de nueva revisión cuando se actualicen componentes o el roadmap*

---

## 🏔️ Visión General  
ElectroRepara es una plataforma web moderna desarrollada con **React + TypeScript + Vite**, diseñada para mostrar servicios técnicos especializados en dispositivos Apple, consolas Nintendo, consolas retro, PC y más.

El proyecto combina:

- Branding local enfocado en Chiloé  
- Animaciones cyberpunk (Framer Motion)
- UI moderna (Shadcn/UI + Tailwind)
- Secciones claras orientadas a conversión (WhatsApp CTA)
- Una sección especial llamada **Retro Zone**, que integra un emulador web con estética de “arcade digital”.

---

## 📁 Estructura Principal

```
src/
│── components/      → Navbar, Hero, Servicios, Trust, Footer, WhatsAppFloat
│── pages/           → Index, InteractiveZone, NotFound
│── hooks/           → useIsMobile, useToast
│── lib/             → utils (cn)
│── test/            → vitest + setup matchMedia
│── assets/          → imágenes (Switch Hero, etc.)
public/
│── emulator/        → Emulador (no revisado por solicitud)
│── roms/            → Roms (no revisado por solicitud)
```

---

## 🎨 Stack Tecnológico

### Core
- **React 18**
- **TypeScript 5**
- **Vite 5**

### Estilos y UI
- **TailwindCSS** con design tokens
- **shadcn/ui** (componentes reutilizables)
- **Lucide icons**

### Motion & Animación
- **Framer Motion** (interacciones y transiciones)
- Espacio reservado para **GSAP + ScrollTrigger** en Hero  
  (pendiente según ROADMAP)

### Otros
- Sistema de toasts personalizado
- Utils (clsx + twMerge)
- Tests con **Vitest** + Testing Library

---

## 🧩 Componentes principales

### ✔ Navbar
- Menú responsivo  
- Animación en entrada  
- Enlace destacado a “Retro Zone”  

### ✔ HeroSection
- Títulos animados  
- Burbujas de iluminación y patrones  
- Imagen flotante de Nintendo Switch  
- **Slot GSAP pendiente**: `#hero-exploded-layout`

### ✔ ServicesGrid
Servicios técnicos con animaciones stagger + hover.

### ✔ TrustSection
Pilares de confianza, testimonios y casos de éxito (placeholder).

### ✔ Footer
Gran CTA hacia WhatsApp + info de horario y ubicación.

### ✔ WhatsAppFloat
Botón flotante animado para cotizar rápido.

---

## 🎮 Retro Zone (InteractiveZone)
Página altamente interactiva:

- Efecto Matrix Canvas animado
- Loader animado al abrir un juego
- Lista de juegos retro seleccionables
- Transiciones suaves con AnimatePresence
- Carga dinámica del emulador vía:  
  `/emulator/index.html?rom=ARCHIVO&system=gba|snes`

⚠ **Por instrucción del usuario, no se revisó el contenido del emulador.**

---

## 🌐 ROADMAP — Próximas Mejoras

### 1. 🎮 Hero GSAP Animation  
Implementar animación de capas con parallax en `#gsap-hero-container`.

### 2. ⭐ Google Business Reviews  
Conectar API → reemplazar testimonios estáticos.

### 3. 📋 Formulario de Cotización Avanzado  
Multi-step + validación + integración WhatsApp/Email.

### 4. 🖼 Casos de Éxito reales  
Galería before/after.

### 5. 🗺 Google Maps  
Mapa integrado con ruta al taller.

---

## 🧪 Tests  
- Vitest instalado y configurado.  
- Polyfill de matchMedia en `setup.ts`.  
- Test básico incluido (`example.test.ts`).

---

## 📌 Notas importantes

- Proyecto bien estructurado y listo para crecer.  
- Excelente base visual y de branding.  
- Sistema Retro Zone muy completo y funcional.  
- Pendientes importantes: GSAP + Google Reviews + Formulario avanzado.

---

## 🔄 Revisión requerida  
Este archivo debe actualizarse nuevamente cuando:

- Se implemente GSAP en Hero  
- Se integren Google Reviews  
- Se agregue el formulario multi-step  
- Se actualicen casos reales o galería  
- Se modifique la Retro Zone o emulador  

**Marca:** `README v1.0 — Revisar en próxima actualización del Roadmap.`