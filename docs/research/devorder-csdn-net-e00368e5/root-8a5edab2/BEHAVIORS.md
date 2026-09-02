# Behaviors

- Reference interaction model: click-driven buttons and forms, normal document scroll, brief color and shadow transitions.
- The adapted page uses normal document scroll and a sticky header.
- Priority is a three-option radio group with a clear selected state.
- The description displays an 800-character counter.
- Native required fields prevent incomplete submission; the confirmation checkbox is also required.
- Submit stores a capped browser-local payload and swaps the form for a success panel. No network request is made until the backend team wires `/api/requirements`.
- Buttons lift by one pixel on hover and settle on active press; controls use visible keyboard focus rings.
- Responsive behavior: two columns from 1024px; one column below 1024px; compact header and reduced spacing below 640px.
