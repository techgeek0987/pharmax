const mongoose = require('mongoose');
const { seedDashboardData } = require('./seedData');
require('dotenv').config();

async function runSeed() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmx';
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Run the seeding process
    await seedDashboardData();

    console.log('🎉 Seeding completed successfully!');
    console.log('📊 Database now contains comprehensive sample data for all systems:');
    console.log('   • 50 Users');
    console.log('   • 500 Orders');
    console.log('   • 300 Tasks');
    console.log('   • 200 Products');
    console.log('   • 150 Invoices');
    console.log('   • 50 Vehicles');
    console.log('   • 40 Drivers');
    console.log('   • 100 Todos');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seed script
runSeed();