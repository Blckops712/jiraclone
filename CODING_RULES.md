# Coding Rules & Standards - JiraClone Project

## Project Architecture Overview

**Tech Stack:**

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS v4
- Hono (API routes)
- Shadcn/ui + Radix UI
- React Hook Form + Zod
- next-themes

**Project Structure:**

```
src/
├── app/          # Next.js App Router pages & layouts
├── components/   # Reusable UI components
├── features/     # Feature-specific components
└── lib/          # Utilities & helpers
```

---

## Core Development Principles

### 1. **KISS (Keep It Simple, Stupid)**

- ✅ Write the simplest solution that works
- ❌ Don't over-engineer or predict future needs
- ❌ Don't add complexity "just in case"
- **Example**: Simple `{ hello: "world" }` API responses are perfectly fine

### 2. **Stick to Established Patterns**

- ✅ Use current framework conventions (App Router, not Pages Router)
- ✅ Follow the existing project structure
- ❌ Don't mix patterns from different framework versions
- **Example**: `export const GET = handle(app)` not `export default handle`

### 3. **Single Responsibility Principle**

- ✅ Make one change when asked for one change
- ❌ Don't assume what else might need changing
- ❌ Don't make multi-file changes unless explicitly requested
- **Example**: If asked to fix a button, only fix the button

---

## Framework-Specific Rules

### Next.js App Router

- ✅ Use `export const GET/POST/PUT/DELETE` for API routes
- ✅ Use `layout.tsx` for nested layouts
- ✅ Use `loading.tsx`, `error.tsx` for UI states
- ❌ Don't mix Pages Router patterns

### TypeScript

- ✅ Use inline type annotations for simple props: `({ children }: { children: React.ReactNode })`
- ✅ Use interfaces for complex or reusable types
- ✅ Keep type definitions close to usage
- ❌ Don't create separate type files unless necessary

### Tailwind CSS v4

- ✅ Configure themes in `globals.css` with CSS variables
- ✅ Use `@import "tailwindcss"` not `@tailwind` directives
- ✅ Use PostCSS config: `'@tailwindcss/postcss': {}`
- ❌ Don't use `tailwind.config.ts` for theme variables in v4

---

## Component Patterns

### UI Components (Shadcn/ui)

- ✅ Use `cva` for variant-based styling
- ✅ Include `cursor-pointer` for interactive elements
- ✅ Use `forwardRef` for form compatibility
- ✅ Export both component and variants

```typescript
// ✅ Good: Simple, focused component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Form Handling

- ✅ Use React Hook Form + Zod for validation
- ✅ Keep submit buttons inside `<form>` elements
- ✅ Use meaningful validation messages
- ✅ Co-locate form schema with component

```typescript
// ✅ Good: Simple validation with clear messages
const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
```

### API Routes (Hono)

- ✅ Use Hono with `/api` basePath
- ✅ Keep route handlers simple and focused
- ✅ Return plain JSON responses
- ❌ Don't wrap simple responses in unnecessary message objects

```typescript
// ✅ Good: Simple, direct response
app.get("/hello", (c) => c.json({ hello: "world" }));

// ❌ Avoid: Over-engineered response
app.get("/hello", (c) =>
  c.json({
    status: "success",
    data: { message: { greeting: "hello", target: "world" } },
  })
);
```

---

## File Organization Rules

### Component Files

- ✅ One component per file (except tiny helper components)
- ✅ Use descriptive, kebab-case filenames
- ✅ Export component as named export, not default
- ✅ Keep related types in the same file

### Feature Organization

- ✅ Group related components in `features/` directory
- ✅ Keep feature-specific logic contained
- ❌ Don't create deep nested folder structures

### API Routes

- ✅ Use catch-all routes: `[[...route]]/route.ts`
- ✅ Keep route logic simple and focused
- ✅ Handle one HTTP method per export

---

## Styling Guidelines

### Tailwind Usage

- ✅ Use semantic color names: `bg-background`, `text-foreground`
- ✅ Prefer utility classes over custom CSS
- ✅ Use `cn()` utility for conditional classes
- ❌ Don't create custom CSS unless absolutely necessary

### Theme Implementation

- ✅ Use `next-themes` for system preference detection
- ✅ Configure with `defaultTheme="system"` and `enableSystem`
- ✅ Define CSS variables for light/dark modes
- ❌ Don't manually implement theme switching

---

## What NOT to Do

### Over-Engineering Antipatterns

- ❌ Creating abstractions before they're needed
- ❌ Adding error boundaries everywhere "just in case"
- ❌ Making every component configurable
- ❌ Creating complex state management for simple forms
- ❌ Adding loading states to everything

### Assumption-Based Changes

- ❌ Guessing what the user "probably wants"
- ❌ Making changes to files not explicitly mentioned
- ❌ Adding features that weren't requested
- ❌ Refactoring working code without being asked

### Framework Mixing

- ❌ Using Pages Router patterns in App Router project
- ❌ Mixing Tailwind CSS v3 and v4 configurations
- ❌ Using outdated React patterns (class components, etc.)

---

## When to Scale Up

Only add complexity when:

- ✅ Current simple solution actually becomes a bottleneck
- ✅ Explicitly requested by the developer
- ✅ Technical requirements demand it (performance, security, etc.)
- ✅ Code duplication becomes unmaintainable

**Remember**: Working simple code > Perfect complex code

---

## Summary

**Default approach**: Choose the simplest solution that works
**When in doubt**: Ask for clarification rather than assuming
**Focus**: Make exactly what's requested, nothing more
**Goal**: Maintainable, readable code that follows current best practices
