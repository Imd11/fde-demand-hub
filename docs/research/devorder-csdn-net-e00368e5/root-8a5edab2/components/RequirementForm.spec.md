# RequirementForm specification

## Overview

- Target file: `components/sites/devorder-csdn-net-e00368e5/root-8a5edab2/RequirementForm.tsx`
- Screenshot: N/A; browser screenshot capture was not required for this adapted, non-clone implementation.
- Interaction model: click-driven form with client-side completion state.

## DOM structure

Form card → title and guidance → labeled inputs → priority radio group → detail textarea and counter → schedule/budget row → contact row → confirmation → submit action → backend handoff note.

## Computed reference styles

- Reference card: white background, `1px solid rgba(17, 17, 20, 0.086)`, 11px radius, `0 1px 2px rgba(17, 20, 35, 0.055)` shadow.
- Reference textarea: `rgb(251, 251, 251)`, 1px translucent border, 3px radius, 13px type, 9.375px × 13.125px padding.
- Reference orange action: `rgb(224, 69, 32)`, matching border, warm-white label.
- Adaptation: larger 44px controls and 12–16px radii for comfortable internal use while preserving the restrained visual language.

## States and behaviors

- Required: title, type, priority, description, requester, contact, confirmation.
- Description limit: 800 characters with live counter.
- Priority buttons: selected option uses dark foreground and white text; unselected options use muted surface.
- Submission: generate `REQ-YYYYMMDD-XXXX`, cap local demo entries at 20, then render success panel.
- Failure to access browser storage does not block the visual success state.
- Success state offers “继续提交一个需求”.

## Assets

N/A. Lucide interface icons only.

## Text content

Product-specific Chinese labels and guidance for an internal FDE requirement intake flow. No reference-site copy is reused.

## Responsive behavior

- Desktop: form fields use paired columns where helpful.
- Mobile: all paired fields stack; full-width action; card padding reduces from 32px to 20px.
- Breakpoint: 640px for form rows; page layout switches at 1024px.
