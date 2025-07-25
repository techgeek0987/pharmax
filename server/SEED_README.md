# Database Seeding Guide

## Overview
The seed script populates your MongoDB database with sample users and todos for development and testing purposes.

## What Gets Created

### Users (3 sample users)
- **John Doe** - john@example.com
- **Jane Smith** - jane@example.com  
- **Mike Johnson** - mike@example.com

All users have the password: `password123`

### Todos (15 sample todos)
The script creates a variety of todos with different:
- **Priorities**: High, Medium, Low
- **Categories**: Work, Development, Personal, Learning, Management, Maintenance
- **Statuses**: Completed, Pending, Overdue
- **Due Dates**: Past, present, and future dates
- **Tags**: Various relevant tags for filtering

## Sample Data Includes:
- ✅ **Completed tasks** (5 todos)
- ⏳ **Pending tasks** (8 todos) 
- ⚠️ **Overdue tasks** (2 todos)
- 🔴 **High priority** (4 todos)
- 🟡 **Medium priority** (6 todos)
- 🟢 **Low priority** (5 todos)

## How to Run

### Prerequisites
1. Make sure MongoDB is running locally or update `MONGODB_URI` in `.env`
2. Install dependencies: `npm install`

### Run the Seed Script
```bash
# Navigate to server directory
cd server

# Run the seed script
npm run seed
```

### Alternative method
```bash
node seed.js
```

## What the Script Does

1. **Connects** to MongoDB using your `.env` configuration
2. **Clears** existing users and todos (⚠️ **Warning**: This deletes all current data!)
3. **Creates** 3 sample users with hashed passwords
4. **Creates** 15 sample todos distributed among the users
5. **Displays** a detailed summary of what was created
6. **Closes** the database connection

## Sample Output
```
🌱 Starting database seeding...
✅ Connected to MongoDB
🧹 Clearing existing data...
✅ Existing data cleared
👥 Creating users...
✅ Created user: John Doe (john@example.com)
✅ Created user: Jane Smith (jane@example.com)
✅ Created user: Mike Johnson (mike@example.com)
📝 Creating todos...
✅ Created todo: "Complete project proposal" for John Doe
...

📊 Seeding Summary:
👥 Users created: 3
📝 Todos created: 15

👤 John Doe (john@example.com):
   📝 Total todos: 5
   ✅ Completed: 2
   ⏳ Pending: 2
   ⚠️  Overdue: 1
   🔴 High priority: 2
   🟡 Medium priority: 2
   🟢 Low priority: 1
```

## Testing the Frontend

After seeding, you can:

1. **Start the server**: `npm run dev`
2. **Login** with any seeded account:
   - Email: `john@example.com`
   - Password: `password123`
3. **Test features**:
   - View dashboard with statistics
   - Filter todos by priority, category, status
   - Search todos
   - Create, edit, delete todos
   - Toggle completion status

## Customizing the Seed Data

To modify the seed data, edit the `sampleUsers` and `sampleTodos` arrays in `seed.js`:

```javascript
// Add more users
const sampleUsers = [
  {
    name: 'Your Name',
    email: 'your@example.com',
    password: 'yourpassword'
  }
  // ... more users
];

// Add more todos
const sampleTodos = [
  {
    title: 'Your Todo',
    description: 'Description here',
    priority: 'high', // 'low', 'medium', 'high'
    category: 'Work',
    dueDate: new Date('2024-12-31'),
    completed: false,
    tags: ['tag1', 'tag2']
  }
  // ... more todos
];
```

## ⚠️ Important Notes

- **Data Loss Warning**: The seed script clears ALL existing users and todos
- **Development Only**: This is intended for development/testing environments
- **Password Security**: All seeded users have the same simple password
- **MongoDB Required**: Ensure MongoDB is running before executing the script

## Troubleshooting

### Connection Issues
- Check if MongoDB is running: `mongosh` or check your MongoDB service
- Verify `MONGODB_URI` in your `.env` file
- Ensure the database name in the URI is correct

### Permission Issues
- Make sure the MongoDB user has read/write permissions
- Check if the database exists and is accessible

### Script Errors
- Run `npm install` to ensure all dependencies are installed
- Check the console output for specific error messages
- Verify your `.env` file has all required variables