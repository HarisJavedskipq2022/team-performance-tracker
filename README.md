# Team Performance Tracker MVP

A modern web application for HR managers to track team goals, skills, feedback, and performance reviews. Built with Next.js, TypeScript, and PostgreSQL.

## 🎯 Features

### ✅ Implemented (MVP)
- **Dashboard**: Overview of team performance metrics
- **Goals Management**: Complete CRUD operations for team goals
  - Create, edit, and delete goals
  - Assign goals to team members
  - Track status (Not Started, In Progress, Completed, Cancelled)
  - Set priorities (Low, Medium, High, Critical)
  - Due date management with overdue detection
  - Advanced filtering and search
- **User Management**: Basic user profiles and role management
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🔄 Planned Features
- Feedback system for peer reviews
- Skills assessment and tracking
- Performance analytics dashboard
- Email notifications
- Team collaboration features

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Icons**: Lucide React
- **Development**: Docker, Git

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Docker and Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd team-performance-tracker
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using bun
bun install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/team_performance?schema=public"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Application Settings
NODE_ENV="development"
```

### 4. Start the Database
```bash
docker-compose up -d
```

### 5. Set Up the Database
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data
npx tsx prisma/seed.ts
```

### 6. Start the Development Server
```bash
# Using npm
npm run dev

# Using bun
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Sample Data

The seed script creates:
- **6 Users** with different roles (Employee, Manager, HR Manager)
- **8 Goals** with various statuses and priorities
- **5 Skills** across different categories
- **User-Skill** associations with proficiency levels

### Sample Users
- John Doe (john.doe@company.com) - Employee
- Jane Smith (jane.smith@company.com) - Employee  
- Mike Johnson (mike.johnson@company.com) - Manager
- Sarah Wilson (sarah.wilson@company.com) - HR Manager
- Alex Brown (alex.brown@company.com) - Employee
- Lisa Davis (lisa.davis@company.com) - Employee

## 🗂️ Project Structure

```
team-performance-tracker/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Sample data seeding
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── api/             # API routes
│   │   ├── goals/           # Goals pages
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Dashboard
│   ├── components/          # Reusable components
│   │   └── Navigation.tsx   # Main navigation
│   └── lib/                 # Utilities and types
│       ├── prisma.ts        # Database client
│       └── types.ts         # TypeScript types
├── docker-compose.yml       # Database setup
└── README.md
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database and reseed
```

## 🎨 Design System

The application uses a consistent design system built with Tailwind CSS:

- **Colors**: Blue primary, gray neutrals, semantic colors for status
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Consistent buttons, forms, cards, and navigation
- **Responsive**: Mobile-first design with breakpoints
- **Accessibility**: Proper contrast ratios and keyboard navigation

## 📱 API Endpoints

### Goals
- `GET /api/goals` - List goals with filtering
- `POST /api/goals` - Create new goal
- `GET /api/goals/[id]` - Get goal details
- `PUT /api/goals/[id]` - Update goal
- `DELETE /api/goals/[id]` - Delete goal

### Users
- `GET /api/users` - List users for assignment

## 🧪 Testing the Application

1. **Dashboard**: Visit the homepage to see overview metrics
2. **Goals List**: Navigate to `/goals` to see all goals with filtering
3. **Create Goal**: Click "New Goal" to create a goal for a team member
4. **Edit Goal**: Click on any goal to view details and edit
5. **Filter Goals**: Use the filter panel to search and filter goals
6. **Status Updates**: Change goal status directly from the goals list

## 🔒 Security Considerations

- Input validation on all forms
- SQL injection prevention via Prisma
- XSS protection with proper escaping
- CSRF protection (built into Next.js)
- Environment variable protection

## 📈 Performance

- Server-side rendering for initial page loads
- Client-side navigation for smooth UX
- Optimized database queries with Prisma
- Image optimization with Next.js
- Responsive design for all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 Documentation

- [Product Decisions](./PRODUCT_DECISIONS.md) - Architecture and trade-offs
- [Database Schema](./prisma/schema.prisma) - Data model documentation

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if Docker is running
docker ps

# Restart database
docker-compose down && docker-compose up -d

# Reset database
npm run db:reset
```

### TypeScript Errors
```bash
# Regenerate Prisma client
npx prisma generate

# Clear Next.js cache
rm -rf .next
```

## 📞 Support

For questions or issues, please:
1. Check the troubleshooting section
2. Review the documentation
3. Create an issue in the repository

---

**Built with ❤️ for better team performance tracking**
