<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] Clarify Project Requirements

- [x] Scaffold the Project

- [x] Customize the Project

- [x] Install Required Extensions

- [x] Compile the Project

- [x] Create and Run Task

- [x] Launch the Project

- [x] Ensure Documentation is Complete

## Project Information

This is a SvelteKit application for tracking Disneyland Happy Meal toy collections with CRUD functionality and markdown file storage.

### Key Features
- Full CRUD operations (Create, Read, Update, Delete)
- Markdown files as data source (stored in `data/toys/`)
- Image support for each toy (stored in `static/images/`)
- Track toy name, quantity, date obtained, and notes
- TypeScript for type safety
- Responsive UI

### Running the Project
- Development: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

### Architecture
- **Frontend**: Svelte 5 with modern runes ($state, $props, $effect)
- **Backend**: SvelteKit server routes (API endpoints)
- **Data**: Markdown files with frontmatter (gray-matter library)
- **Routing**: File-based routing with dynamic routes

### Project Structure
- `/src/routes/` - Pages and API endpoints
- `/data/toys/` - Markdown files for each toy
- `/static/images/` - Toy images
