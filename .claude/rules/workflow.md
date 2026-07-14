SYSTEM RULE: FRONTEND PRE-IMPLEMENTATION PROTOCOL & USER CONFIRMATION
CRITICAL MANDATE
You are STRICTLY FORBIDDEN from automatically implementing, modifying, or accepting any frontend code changes immediately after receiving a user prompt. You MUST execute a comprehensive architectural inspection, reusability audit, logic breakdown, and strict confirmation protocol first. No freestyle coding or speculative implementations are allowed without explicit user approval.

⚡ THE FAST-TRACK EXCEPTION
Applicable Conditions: If the user's request qualifies as a Trivial UI Task (e.g., fixing typos in text, adjusting minor CSS/Tailwind spacing classes without affecting layouts, updating simple static config values, or when the total lines of code changed is < 10 lines and carries zero risk of breaking component states or global styles).

Action: The AI is permitted to BYPASS Phase 3 (no confirmation required) and proceed with execution immediately. For all other cases, the protocol below is non-negotiable.

PHASE 1: MANDATORY UI & ARCHITECTURE INSPECTION
Before responding with any implementation plan or code:

Analyze Folder Structure & Hierarchy: Scan the frontend directory tree (Next.js App/Pages directory or React Admin structure) to understand where files belong.

Review Existing Design Tokens & Syntax: Check existing styles, naming conventions, custom hooks, and state management patterns to maintain 100% architectural consistency.

Reusability & Common Asset Audit (CRITICAL): * Actively scan the project for existing global/local common components (e.g., Buttons, Modals, DataGrids), shared hooks (e.g., useAuth, useFetch), or utility functions.

If a matching common element already exists, you MUST reuse it instead of creating a duplicate.

If the required logic/UI can be abstracted into a generic, reusable asset, you MUST plan to set it up as a common element first.

Complex UI Logic Identification: Pinpoint intricate state transformations, heavy useEffect hooks, complex form handling (e.g., dynamic forms), or conditional rendering logic that might become difficult to read.

PHASE 2: CLARIFICATION & DOUBLE-CHECK
If there is ANY ambiguity, missing design requirements, layout conflicts, or edge cases in the user's request:

STOP IMMEDIATELY.

List your technical questions or UI/UX concerns clearly to the user.

Do not make layout, styling, or state management assumptions on behalf of the user.

PHASE 3: THE GATEKEEPER (MANDATORY USER CONFIRMATION)
Even if the requirements are 100% clear, you MUST present a structured summary of your plan to the user first.

Your response MUST end with a strict hold, using this exact format:

🔍 [Summary of your understanding of the frontend architecture, page hierarchies, and affected components]

💡 [Brief proposed UI/UX solution and layout approach]

🧩 [Reusability & Common Component Plan: Verification of existing shared components/hooks to be reused, OR a detailed blueprint for creating a new common element if abstraction is possible to maintain DRY principles]

🧠 [Complex Logic & State Breakdown: A comprehensive, step-by-step explanation of convoluted state behaviors, lifecycle hooks, complex conditional styling, dynamic form handlings, or any tricky logic. Freestyle coding is forbidden until this is approved]

🚀 [Performance & Optimization Confirmation: Breakdown of frontend optimization strategies, including dynamic code-splitting/lazy-loading, rendering optimization (SSR/ISR/CSR controls), image optimization, and bundle size management]

🧪 [Verification & Testing Plan: List of testing scenarios including manual user flows, responsive design breakpoint validations (Mobile/Desktop), cross-browser checking hooks, or component unit test approaches]

❓ [Any lingering questions, potential UI/UX regressions, or layout risks needing clarification]

🛑 AWAITING CONFIRMATION: Please review and approve the frontend plan above. I will NOT proceed with any file creations, component updates, or styling modifications until I receive explicit approval (e.g., "OK", "Proceed", "Go ahead", or specific feedback).