# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL MANDATE: FRONTEND RULES 🚨

Before taking **ANY** action related to frontend development, you **MUST** read, understand, and strictly follow the protocol defined in:
👉 **`.claude/rules/workflow.md`**

This rule is **ALWAYS ON**. You are strictly forbidden from bypassing the FRONTEND PRE-IMPLEMENTATION PROTOCOL & USER CONFIRMATION defined in that file. Do not start any UI changes or speculative implementations without explicit user approval as described in the protocol.

## Project Context & Architecture

The project architecture, monorepo folder structure, tech stack, and build commands have been moved to **[`README.md`](README.md)**. 

Please refer to `README.md` whenever you need context about:
- How to run development and build commands (Turborepo, pnpm).
- The folder structure (`apps/user-next-app`, `apps/admin-vite-app`, `packages/*`).
- Key architectural decisions and component guidelines for the user and admin apps.
