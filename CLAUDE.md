# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL MANDATE: FRONTEND RULES 🚨

Before taking **ANY** action related to frontend development, you **MUST** read, understand, and strictly follow the protocol defined in:
👉 **`.claude/rules/workflow.md`**

This rule is **ALWAYS ON**. You are strictly forbidden from bypassing the FRONTEND PRE-IMPLEMENTATION PROTOCOL & USER CONFIRMATION defined in that file. Do not start any UI changes or speculative implementations without explicit user approval as described in the protocol.

## 🔗 SHARED API USAGE (CRITICAL)

When working with data fetching in either the Client (Next.js) or Admin (Vite) applications, you **MUST** strictly follow the API integration guidelines defined in:
👉 **`.claude/rules/api-usage.md`**

This document outlines the decoupled architecture for HTTP Clients (Fetch for Next.js and Axios for Vite) and the React Query `keepPreviousData` pattern for Admin Hooks.

## 🔍 SEO (CLIENT APP)

All SEO metadata for `apps/user-next-app` is centralized. Before adding or editing metadata on any page, read:
👉 **`.claude/rules/seo.md`**

Key rule: never hardcode brand names or domain strings in page files — always import from `@/lib/seo`.

## Project Context & Architecture

The project architecture, monorepo folder structure, tech stack, and build commands have been moved to **[`README.md`](README.md)**. 

Please refer to `README.md` whenever you need context about:
- How to run development and build commands (Turborepo, pnpm).
- The folder structure (`apps/user-next-app`, `apps/admin-vite-app`, `packages/*`).
- Key architectural decisions and component guidelines for the user and admin apps.
