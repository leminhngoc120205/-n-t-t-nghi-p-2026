# Journalism CMS - Modern Content Templating Platform

A modern web-based application for online journalism content templating and visual storytelling. This lightweight CMS + visual builder helps journalists and editors create visually appealing online articles using predefined templates.

## Features

✨ **Template-Based Content Creation**
- News article templates
- Emagazine templates
- Longform article structures
- Interactive storytelling layouts

📝 **Intuitive Content Editor**
- Support for multiple field types (text, textarea, images, videos, rich text)
- Real-time content management
- Draft and publish workflows

👁️ **Live Preview**
- See how your article looks in real-time
- Responsive preview for desktop and mobile
- Professional rendering of all content types

📊 **Comprehensive Dashboard**
- View all your articles at a glance
- Filter by status (draft, published, archived)
- Quick edit, view, and delete actions

🗄️ **Database Integration**
- MongoDB backend for reliable content storage
- Automatic schema validation
- Efficient query performance

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: MongoDB
- **Icons**: React Icons

## Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── templates/     # Template endpoints
│   │   └── articles/      # Article endpoints
│   ├── articles/          # Article view pages
│   ├── editor/            # Editor pages
│   ├── dashboard/         # Dashboard page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Dashboard.tsx
│   ├── TemplateSelector.tsx
│   ├── TemplateCard.tsx
│   ├── ContentEditor.tsx
│   ├── LivePreview.tsx
│   ├── ArticleRenderer.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorDisplay.tsx
├── lib/                   # Utility functions
│   └── mongodb.ts         # Database connection
├── models/                # MongoDB schemas
│   ├── template.ts
│   ├── article.ts
│   └── user.ts
├── public/                # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (running locally or remote connection string)

### Installation

1. **Clone or create the project**
   ```bash
   cd "Đồ án tốt nghiệp 2026"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and update the MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/journalism-cms
   API_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Ensure MongoDB is running**
   ```bash
   # On macOS (with Homebrew)
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   
   # Or run MongoDB in Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### Creating an Article

1. Click "New Article" or navigate to `/editor`
2. **Step 1**: Select a template from the available options
3. **Step 2**: Fill in article metadata (title, author, status)
4. **Step 3**: Edit content using the template fields
5. **Step 4**: Preview your article
6. Click "Save Article" to save as draft or "Publish"

### Managing Articles

1. Visit the Dashboard (`/dashboard`)
2. View all your articles in a table format
3. Filter by status: All, Draft, Published, Archived
4. Click on an article to edit or view it
5. Delete articles using the delete button

### Working with Templates

Templates are stored in MongoDB and define:
- Fields and their types (text, textarea, image, video, richtext)
- Layout structure
- Category classification
- Thumbnail preview

## API Endpoints

### Templates API

```
GET    /api/templates              # Get all templates (with optional ?category=news)
POST   /api/templates              # Create a new template
GET    /api/templates/[id]         # Get a specific template
PUT    /api/templates/[id]         # Update a template
DELETE /api/templates/[id]         # Delete a template
```

### Articles API

```
GET    /api/articles               # Get all articles (with filters: ?status=draft&page=1&limit=10)
POST   /api/articles               # Create a new article
GET    /api/articles/[id]          # Get a specific article
PUT    /api/articles/[id]          # Update an article
DELETE /api/articles/[id]          # Delete an article
```

## Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Styling & Customization

- **TailwindCSS**: Customize colors and fonts in `tailwind.config.js`
- **Global Styles**: Edit `app/globals.css`
- **Component Styles**: Inline TailwindCSS classes in component files

### Color Scheme
- **Primary**: `#1f2937` (Dark Gray)
- **Secondary**: `#3b82f6` (Blue)
- **Accent**: `#f59e0b` (Amber)

## Database Schema

### Template Schema
```
{
  title: String,
  description: String,
  category: 'news' | 'magazine' | 'longform' | 'interactive',
  thumbnail: String,
  layout: String,
  fields: [{
    id: String,
    name: String,
    type: 'text' | 'textarea' | 'image' | 'video' | 'richtext',
    placeholder: String,
    required: Boolean
  }]
}
```

### Article Schema
```
{
  title: String,
  slug: String,
  templateId: String,
  author: String,
  content: Object,
  status: 'draft' | 'published' | 'archived',
  publishedAt: Date,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## Performance Optimization

- **Image Optimization**: Uses Next.js Image component for automatic optimization
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: MongoDB connection pooling for efficient database access
- **CSS**: TailwindCSS purges unused styles for minimal bundle

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running: `mongosh` should connect
- Check connection string in `.env.local`
- Ensure MongoDB service is active

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Check TypeScript errors: `npx tsc --noEmit`

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## Development Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
npm run lint:fix
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Commit with descriptive messages
4. Push and create a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API endpoints documentation
3. Examine component prop interfaces in the source code

---

**Happy writing! 📝**
