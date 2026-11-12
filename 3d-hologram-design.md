# 3D Hologram Design Plan

## Color Palette (Black Cyan Blue)
- **bg-base**: `#050a10` — Deep black base
- **cyan-primary**: `#00e5ff` — Bright cyan (primary accent)
- **cyan-secondary**: `#0091f4` — Stronger cyan for depth
- **cyan-tertiary**: `#52eaff` — Lighter cyan for highlights
- **glow-emitter**: `#00ffcc` — Cyan-green glow for hologram effect
- **text-subtle**: `#3a7a99` — Muted cyan-text for readability

## Design Philosophy
A single dominant 3D hologram moment — one orchestrated page-load sequence — rather than scattered effects. The hologram should feel like a digital artifact emerging from the dark sky, not a generic template effect.

## Three.js Scene Structure
- **Container**: Fixed-position canvas overlaying the hero/section area
- **Scene**: Dark base with ambient cyan lighting
- **Primary Model**: A geometric form (sphere/hedron) as the hologram subject
- **Particles**: Floating cyan particles that react to mouse/touch
- **Glow Effect**: Soft outward glow using bloom-like shader
- **Interaction**: Mouse-following rotation + particle attraction

## CSS Integration
- Canvas sits below hero content (z-index: 5) but above vignette
- Respect `prefers-reduced-motion` — disable animation, show static hologram
- Theme-aware: works in both dark and light modes
- Scroll-independent: stays in viewport position

## Key Visual Elements
1. **Central hologram sphere** with cyan outline and internal structure
2. **Orbiting particles** that form a subtle ring around the hologram
3. **Mouse-following tilt** — hologram rotates gently toward cursor
4. **Pulse animation** — subtle size pulse on page load
5. **Glayer overlay** — radial gradient that follows mouse

## Accessibility
- `prefers-reduced-motion` media query disables all animation
- Keyboard-focusable explanation of the 3D effect
- ARIA-label on canvas: "Holographic display with cyan blue lighting"
- Reduced motion shows static glowing geometric form

## Implementation Phases
1. **Phase 1**: Three.js setup, scene, camera, renderer
2. **Phase 2**: Hologram geometry with cyan material
3. **Phase 3**: Particle system and glow effects
4. **Phase 4**: Mouse interaction and animation loop
5. **Phase 5**: Reduced motion fallback, responsiveness