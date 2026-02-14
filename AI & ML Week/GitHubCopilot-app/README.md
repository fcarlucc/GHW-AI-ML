
# 📅 Agenda App — Built with GitHub Copilot

> **GHW AI/ML Week Challenge**: Use GitHub Copilot to Build a Simple Application

This project demonstrates how **GitHub Copilot** can assist in rapidly building a modern, feature-rich web application. In just a few prompts, Copilot helped generate a complete **calendar-style task manager** inspired by premium productivity tools.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| � **Full-Page Agenda Layout** | Authentic paper agenda experience with horizontal yellow ruled lines |
| 🗓️ **Date Picker** | Click on the date to open a calendar picker and jump to any day |
| ⏰ **Time-Based Grid** | Tasks are positioned on the page based on their scheduled time (08:00 - 21:00) |
| 🎨 **6 Color Categories** | Work, Personal, Health, Meeting, Deadline, Reminder — each with unique colors |
| ✏️ **Click-to-Edit** | Click any task card to edit it inline with the same modal form |
| 🗑️ **Delete in Edit Mode** | Delete button appears when editing an existing task |
| ➕ **Quick Add Button** | Floating "+" button in header to create new tasks |
| 💾 **localStorage Persistence** | All data persists across page reloads |
| 📱 **Responsive Design** | Optimized for both desktop and mobile viewing |
| ✅ **Task Completion** | Check off tasks with visual completion indicators |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Then open **http://localhost:5173** in your browser.

---

## 🤖 How GitHub Copilot Helped

This entire application was built using GitHub Copilot prompts. Here's an example of the evolving prompts that shaped the final design:

**Initial prompt:**
> *"Build a calendar-style task manager with day navigation and colored task cards..."*

**Refinement prompt:**
> *"Transform it into a full-page layout inspired by a physical paper agenda, with horizontal yellow lines, time-based positioning, click-to-edit tasks, and a date picker in the header."*

### Copilot assisted with:

- ✅ **Full-page layout design** — Generated CSS for ruled lines background mimicking paper agendas
- ✅ **Time-based positioning** — Calculated vertical positioning based on task time slots
- ✅ **Component architecture** — Split into `AgendaHeader`, `TaskCard`, `TaskForm`, `AppFooter`
- ✅ **TypeScript types** — Generated interfaces for `Task`, `TaskCategory`, `Priority` with proper typing
- ✅ **React hooks** — Implemented `useState` and `useEffect` for state management and persistence
- ✅ **Edit mode** — Transformed form to support both create and edit modes with conditional delete button
- ✅ **Date picker integration** — Added native HTML5 date input in header for quick navigation
- ✅ **Form validation** — Required field validation with error messages
- ✅ **Responsive behavior** — Adapted grid and card sizing for mobile devices

---

## 📁 Project Structure

```
src/
├── App.tsx              # Main app with date navigation and time-grid logic
├── App.css              # Full-page agenda layout with ruled lines
├── index.css            # CSS variables and global styles
├── types.ts             # TypeScript types, category colors, constants
└── components/
    ├── AgendaHeader.tsx # Header with date picker, day display, and + button
    ├── TaskCard.tsx     # Colored task card with time-based positioning
    ├── TaskForm.tsx     # Modal form for creating/editing tasks
    └── AppFooter.tsx    # Footer with branding and links
```

---

## 🎨 Design Highlights

- **Paper Agenda Aesthetic**: Full-page layout with horizontal yellow ruled lines (#fff9e6 background)
- **Fixed Header**: Clean white header with date picker, weekday/date display, and floating "+" button
- **Time Grid**: Tasks automatically position themselves based on their time (08:00 - 21:00 range)
- **Color-Coded Cards**: Each category has a unique color scheme (border, background, badge)
- **Click-to-Edit**: Intuitive interaction — click any task to open edit modal
- **Smooth Animations**: Modal slide-up, card hover effects, and button transitions
- **Professional Footer**: Fixed bottom footer with copyright and GitHub link

---

## 🛠️ Tech Stack

- **React 19** — Functional components with hooks
- **TypeScript** — Full type safety
- **Vite** — Lightning-fast dev server and build
- **CSS3** — Custom properties, flexbox, grid, animations
- **localStorage** — Client-side persistence

---

## 📸 Screenshots

### Agenda View
Navigate between days and see your tasks organized by time.

![Agenda Layout - Full page view with time-based task grid](public/Calendar%20Layout.png)

### Task Creation Form
Beautiful modal with category selection and optional priority.

![Task Creation Modal - Form with category selection and priority options](public/Task%20Creation.png)

---

## 🏆 Challenge Submission

This project was created for the **Global Hack Week: AI/ML** challenge:

> *"Use GitHub Copilot to Build a Simple Application"*

GitHub Copilot made it possible to go from idea to fully functional app in minutes, demonstrating how AI coding assistants can dramatically accelerate development while maintaining code quality.

---

## 📜 License

MIT — Feel free to use this as a starting point for your own projects!

---

Made with 💜 and GitHub Copilot
