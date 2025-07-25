const mongoose = require('mongoose');
const Order = require('./models/Order');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');
const Task = require('./models/Task');
const Product = require('./models/Product');
const Invoice = require('./models/Invoice');
const User = require('./models/User');
const Todo = require('./models/Todo');

// Helper functions for generating realistic data
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const getRandomBoolean = () => Math.random() > 0.5;

// Base data arrays for generating realistic content
const locations = [
  "Downtown Pharmacy", "Central Medical Center", "North Side Clinic", "South Bay Hospital",
  "East Valley Pharmacy", "West End Medical", "Riverside Clinic", "Mountain View Hospital",
  "Sunset Pharmacy", "Sunrise Medical Center", "Oak Street Clinic", "Pine Avenue Hospital",
  "Maple Pharmacy", "Cedar Medical", "Elm Street Clinic", "Birch Hospital",
  "Willow Pharmacy", "Aspen Medical Center", "Spruce Clinic", "Fir Hospital",
  "Metro Pharmacy", "City Medical", "Urban Clinic", "Suburban Hospital",
  "Village Pharmacy", "Town Medical Center", "County Clinic", "Regional Hospital",
  "Community Pharmacy", "Family Medical", "Neighborhood Clinic", "Local Hospital",
  "Express Pharmacy", "Quick Medical", "Rapid Clinic", "Fast Hospital",
  "Premium Pharmacy", "Elite Medical", "Superior Clinic", "Advanced Hospital",
  "Modern Pharmacy", "Contemporary Medical", "Current Clinic", "Today Hospital",
  "Future Pharmacy", "Tomorrow Medical", "Next Clinic", "Progressive Hospital",
  "Green Pharmacy", "Blue Medical", "Red Clinic", "White Hospital",
  "Golden Pharmacy", "Silver Medical", "Bronze Clinic", "Platinum Hospital"
];

const customerNames = [
  "John Smith", "Jane Doe", "Michael Johnson", "Sarah Williams", "David Brown",
  "Emily Davis", "Robert Miller", "Jessica Wilson", "William Moore", "Ashley Taylor",
  "James Anderson", "Amanda Thomas", "Christopher Jackson", "Jennifer White", "Daniel Harris",
  "Lisa Martin", "Matthew Thompson", "Karen Garcia", "Anthony Martinez", "Nancy Robinson",
  "Mark Clark", "Betty Rodriguez", "Steven Lewis", "Helen Lee", "Paul Walker",
  "Dorothy Hall", "Kenneth Allen", "Sandra Young", "Joshua Hernandez", "Donna King",
  "Kevin Wright", "Carol Lopez", "Brian Hill", "Ruth Scott", "George Green",
  "Sharon Adams", "Edward Baker", "Michelle Gonzalez", "Ronald Nelson", "Laura Carter",
  "Timothy Mitchell", "Kimberly Perez", "Jason Roberts", "Deborah Turner", "Jeffrey Phillips",
  "Amy Campbell", "Ryan Parker", "Brenda Evans", "Jacob Edwards", "Emma Collins"
];

const productNames = [
  "Aspirin 100mg", "Ibuprofen 200mg", "Acetaminophen 500mg", "Amoxicillin 250mg",
  "Lisinopril 10mg", "Metformin 500mg", "Atorvastatin 20mg", "Omeprazole 20mg",
  "Amlodipine 5mg", "Metoprolol 50mg", "Hydrochlorothiazide 25mg", "Prednisone 10mg",
  "Azithromycin 250mg", "Ciprofloxacin 500mg", "Doxycycline 100mg", "Cephalexin 500mg",
  "Warfarin 5mg", "Digoxin 0.25mg", "Furosemide 40mg", "Spironolactone 25mg",
  "Insulin Glargine", "Insulin Lispro", "Metformin XR 750mg", "Glipizide 5mg",
  "Pioglitazone 30mg", "Sitagliptin 100mg", "Losartan 50mg", "Valsartan 80mg",
  "Carvedilol 12.5mg", "Propranolol 40mg", "Diltiazem 120mg", "Nifedipine 30mg",
  "Simvastatin 40mg", "Rosuvastatin 20mg", "Pravastatin 40mg", "Lovastatin 20mg",
  "Pantoprazole 40mg", "Lansoprazole 30mg", "Esomeprazole 20mg", "Ranitidine 150mg",
  "Cetirizine 10mg", "Loratadine 10mg", "Fexofenadine 180mg", "Diphenhydramine 25mg",
  "Montelukast 10mg", "Albuterol Inhaler", "Fluticasone Nasal Spray", "Budesonide Inhaler"
];

const taskTitles = [
  "Update inventory system", "Process new orders", "Quality control check",
  "Prepare shipment documentation", "Coordinate with suppliers", "Review safety protocols",
  "Train new staff members", "Conduct facility inspection", "Update customer records",
  "Prepare monthly reports", "Schedule maintenance", "Review compliance requirements",
  "Process insurance claims", "Update product catalog", "Coordinate deliveries",
  "Review vendor contracts", "Conduct staff meeting", "Update safety procedures",
  "Process returns", "Review financial reports", "Coordinate with IT support",
  "Update emergency procedures", "Review customer feedback", "Prepare audit documentation",
  "Schedule equipment maintenance", "Review inventory levels", "Update training materials",
  "Coordinate with regulatory agencies", "Process special orders", "Review security protocols"
];

const vehicleTypes = [
  "Light Commercial Vehicle", "Medium-Duty Box Truck", "Heavy-Duty Truck",
  "Refrigerated Van", "Express Delivery Van", "Cargo Van", "Panel Van",
  "Pickup Truck", "Flatbed Truck", "Temperature-Controlled Vehicle"
];

const driverNames = [
  "Jake Foster", "Lory Kim", "Darren Anderson", "Sarah Martinez", "Mike Johnson",
  "Lisa Chen", "Robert Taylor", "Amanda Wilson", "Chris Brown", "Jennifer Davis",
  "David Miller", "Karen White", "Steve Garcia", "Nancy Rodriguez", "Paul Thompson",
  "Betty Jackson", "Mark Lewis", "Helen Walker", "Kevin Hall", "Carol Allen",
  "Brian Young", "Ruth King", "George Wright", "Sharon Lopez", "Edward Hill",
  "Michelle Scott", "Ronald Green", "Laura Adams", "Timothy Baker", "Kimberly Nelson"
];

// Generate comprehensive seed data
async function generateSeedData() {
  console.log('🌱 Generating comprehensive seed data...');

  // Generate Users (50)
  const users = [];
  for (let i = 1; i <= 50; i++) {
    users.push({
      name: getRandomElement(customerNames),
      email: `user${i}@pharmx.com`,
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      role: getRandomElement(['admin', 'manager', 'staff', 'driver']),
      isActive: getRandomBoolean(),
      createdAt: getRandomDate(new Date(2023, 0, 1), new Date()),
    });
  }

  // Generate Orders (500)
  const orders = [];
  const orderTypes = ['EXPRESS', 'REFRIGERATED', 'HEAVY', 'STANDARD', 'URGENT'];
  const orderStatuses = ['to-be-fulfilled', 'open', 'ready', 'assigned', 'in-transit', 'delivered', 'completed'];
  
  for (let i = 1; i <= 500; i++) {
    const orderDate = getRandomDate(new Date(2024, 0, 1), new Date());
    const dueDate = new Date(orderDate.getTime() + getRandomNumber(1, 7) * 24 * 60 * 60 * 1000);
    
    orders.push({
      id: `#ORD${String(i).padStart(4, '0')}`,
      orderNumber: `ORD-2024-${String(i).padStart(6, '0')}`,
      location: getRandomElement(locations),
      packages: getRandomNumber(1, 100),
      type: getRandomElement(orderTypes),
      priority: getRandomElement(['low', 'medium', 'high', 'urgent']),
      status: getRandomElement(orderStatuses),
      customer: {
        name: getRandomElement(customerNames),
        email: `customer${i}@example.com`,
        phone: `+1${getRandomNumber(1000000000, 9999999999)}`,
        address: {
          street: `${getRandomNumber(100, 9999)} ${getRandomElement(['Main', 'Oak', 'Pine', 'Elm'])} St`,
          city: getRandomElement(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']),
          state: getRandomElement(['NY', 'CA', 'IL', 'TX', 'AZ']),
          zipCode: String(getRandomNumber(10000, 99999)),
          country: 'USA'
        }
      },
      deliveryAddress: {
        street: `${getRandomNumber(100, 9999)} ${getRandomElement(['First', 'Second', 'Third'])} Ave`,
        city: getRandomElement(['Boston', 'Seattle', 'Denver', 'Miami', 'Atlanta']),
        state: getRandomElement(['MA', 'WA', 'CO', 'FL', 'GA']),
        zipCode: String(getRandomNumber(10000, 99999)),
        country: 'USA'
      },
      time: `${getRandomNumber(8, 18)}:${getRandomNumber(0, 59).toString().padStart(2, '0')}`,
      scheduledDelivery: {
        date: dueDate,
        timeSlot: `${getRandomNumber(9, 17)}:00 - ${getRandomNumber(10, 18)}:00`,
        instructions: getRandomElement(['Ring doorbell', 'Leave at door', 'Call on arrival', 'Front desk delivery'])
      },
      totalAmount: getRandomNumber(50, 5000),
      paymentStatus: getRandomElement(['pending', 'paid', 'failed']),
      weight: `${getRandomNumber(1, 50)}kg`,
      specialInstructions: getRandomElement(['Handle with care', 'Fragile items', 'Keep upright', 'Temperature sensitive']),
      createdAt: orderDate,
      updatedAt: getRandomDate(orderDate, new Date())
    });
  }

  // Generate Tasks (300)
  const tasks = [];
  const taskStatuses = ['todo', 'in-progress', 'review', 'completed', 'cancelled'];
  const taskPriorities = ['low', 'medium', 'high', 'urgent'];
  const taskCategories = ['delivery', 'maintenance', 'administrative', 'customer-service', 'inventory', 'other'];
  
  for (let i = 1; i <= 300; i++) {
    const createdDate = getRandomDate(new Date(2024, 0, 1), new Date());
    const dueDate = new Date(createdDate.getTime() + getRandomNumber(1, 14) * 24 * 60 * 60 * 1000);
    
    tasks.push({
      title: getRandomElement(taskTitles),
      description: `Detailed description for task ${i}. This task requires attention and proper execution.`,
      status: getRandomElement(taskStatuses),
      priority: getRandomElement(taskPriorities),
      project: getRandomElement(['PharmX Delivery', 'Inventory Management', 'Customer Service', 'Quality Control']),
      tags: [
        getRandomElement(['urgent', 'important', 'routine', 'maintenance']),
        getRandomElement(['delivery', 'inventory', 'customer', 'admin'])
      ],
      dueDate: dueDate,
      startDate: createdDate,
      estimatedHours: getRandomNumber(1, 8),
      actualHours: getRandomNumber(1, 10),
      category: getRandomElement(taskCategories),
      subtasks: [
        { title: `Subtask 1 for task ${i}`, completed: getRandomBoolean() },
        { title: `Subtask 2 for task ${i}`, completed: getRandomBoolean() }
      ],
      comments: [
        {
          text: `Initial comment for task ${i}`,
          createdAt: createdDate
        }
      ],
      createdAt: createdDate,
      updatedAt: getRandomDate(createdDate, new Date())
    });
  }

  // Generate Products (200)
  const products = [];
  const productCategories = ['prescription', 'over-the-counter', 'medical-device', 'supplement', 'personal-care'];
  const productStatuses = ['active', 'inactive', 'discontinued', 'out-of-stock'];
  const productBrands = ['PharmaCorp', 'MediTech', 'HealthPlus', 'WellCare', 'VitalMed'];
  
  for (let i = 1; i <= 200; i++) {
    const costPrice = getRandomNumber(1, 100);
    const sellingPrice = costPrice * (1 + getRandomNumber(20, 80) / 100);
    const quantity = getRandomNumber(0, 1000);
    
    products.push({
      name: getRandomElement(productNames),
      description: `High-quality pharmaceutical product ${i} for medical treatment.`,
      sku: `SKU${String(i).padStart(6, '0')}`,
      barcode: `${getRandomNumber(1000000000000, 9999999999999)}`,
      category: getRandomElement(productCategories),
      subcategory: getRandomElement(['tablets', 'capsules', 'liquid', 'injection', 'topical']),
      brand: getRandomElement(productBrands),
      manufacturer: `${getRandomElement(productBrands)} Manufacturing`,
      price: {
        cost: costPrice,
        selling: sellingPrice,
        currency: 'USD'
      },
      inventory: {
        quantity: quantity,
        minStock: getRandomNumber(10, 50),
        maxStock: getRandomNumber(500, 2000),
        reorderPoint: getRandomNumber(20, 100),
        location: {
          warehouse: getRandomElement(['A', 'B', 'C']),
          shelf: `${getRandomElement(['A', 'B', 'C'])}${getRandomNumber(1, 10)}`,
          bin: String(getRandomNumber(1, 100))
        }
      },
      specifications: {
        weight: {
          value: getRandomNumber(1, 500),
          unit: 'g'
        },
        dimensions: {
          length: getRandomNumber(5, 20),
          width: getRandomNumber(3, 15),
          height: getRandomNumber(1, 10),
          unit: 'cm'
        }
      },
      status: quantity === 0 ? 'out-of-stock' : getRandomElement(productStatuses),
      tags: [
        getRandomElement(['fast-moving', 'slow-moving', 'seasonal', 'essential']),
        getRandomElement(['prescription', 'otc', 'controlled', 'generic'])
      ],
      supplier: {
        name: `${getRandomElement(productBrands)} Suppliers`,
        contact: getRandomElement(customerNames),
        email: `supplier${i}@example.com`,
        phone: `+1${getRandomNumber(1000000000, 9999999999)}`
      },
      prescriptionRequired: getRandomElement(productCategories) === 'prescription',
      expiryDate: getRandomDate(new Date(), new Date(2026, 11, 31)),
      batchNumber: `BATCH${String(getRandomNumber(1000, 9999))}`,
      createdAt: getRandomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: getRandomDate(new Date(2024, 0, 1), new Date())
    });
  }

  // Generate Invoices (150)
  const invoices = [];
  const invoiceStatuses = ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'];
  const paymentStatuses = ['pending', 'partial', 'paid', 'failed', 'refunded'];
  const paymentMethods = ['cash', 'credit-card', 'debit-card', 'bank-transfer', 'check'];
  
  for (let i = 1; i <= 150; i++) {
    const issueDate = getRandomDate(new Date(2024, 0, 1), new Date());
    const dueDate = new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const itemCount = getRandomNumber(1, 5);
    const items = [];
    let subtotal = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const quantity = getRandomNumber(1, 20);
      const unitPrice = getRandomNumber(10, 200);
      const lineTotal = quantity * unitPrice;
      subtotal += lineTotal;
      
      items.push({
        productDetails: {
          name: getRandomElement(productNames),
          sku: `SKU${String(getRandomNumber(1, 200)).padStart(6, '0')}`,
          description: 'High-quality pharmaceutical product'
        },
        quantity: quantity,
        unitPrice: unitPrice,
        discount: getRandomNumber(0, 10),
        discountType: 'percentage',
        taxRate: 8.5,
        lineTotal: lineTotal
      });
    }
    
    const totalDiscount = subtotal * 0.05;
    const totalTax = (subtotal - totalDiscount) * 0.085;
    const totalAmount = subtotal - totalDiscount + totalTax;
    
    invoices.push({
      invoiceNumber: `INV-2024-${String(i).padStart(6, '0')}`,
      customer: {
        name: getRandomElement(customerNames),
        email: `customer${i}@example.com`,
        phone: `+1${getRandomNumber(1000000000, 9999999999)}`,
        address: {
          street: `${getRandomNumber(100, 9999)} Business Ave`,
          city: getRandomElement(['New York', 'Los Angeles', 'Chicago']),
          state: getRandomElement(['NY', 'CA', 'IL']),
          zipCode: String(getRandomNumber(10000, 99999)),
          country: 'USA'
        }
      },
      items: items,
      subtotal: subtotal,
      totalDiscount: totalDiscount,
      totalTax: totalTax,
      shippingCost: getRandomNumber(0, 50),
      totalAmount: totalAmount,
      currency: 'USD',
      status: getRandomElement(invoiceStatuses),
      paymentStatus: getRandomElement(paymentStatuses),
      paymentMethod: getRandomElement(paymentMethods),
      paymentDetails: {
        paidAmount: getRandomNumber(0, totalAmount),
        remainingAmount: getRandomNumber(0, totalAmount)
      },
      dates: {
        issueDate: issueDate,
        dueDate: dueDate
      },
      terms: {
        paymentTerms: 'Net 30',
        notes: `Invoice ${i} payment terms and conditions.`
      },
      history: [
        {
          action: 'created',
          date: issueDate,
          notes: 'Invoice created'
        }
      ],
      createdAt: issueDate,
      updatedAt: getRandomDate(issueDate, new Date())
    });
  }

  // Generate Vehicles (50)
  const vehicles = [];
  const vehicleTags = ['GPS', 'HEAVY LOAD', 'REFRIGERATED', 'EXPRESS', 'TEMPERATURE CONTROLLED'];
  
  for (let i = 1; i <= 50; i++) {
    vehicles.push({
      id: `VH-${String(i).padStart(3, '0')}`,
      type: getRandomElement(vehicleTypes),
      maxWeight: `${getRandomNumber(1000, 5000)} kg`,
      dimensions: `${getRandomNumber(10, 30)} m³`,
      tags: [
        getRandomElement(vehicleTags),
        getRandomElement(vehicleTags)
      ].filter((tag, index, arr) => arr.indexOf(tag) === index),
      available: getRandomBoolean(),
      currentLocation: getRandomElement(locations),
      createdAt: getRandomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: getRandomDate(new Date(2024, 0, 1), new Date())
    });
  }

  // Generate Drivers (40)
  const drivers = [];
  const driverStatuses = ['available', 'busy', 'offline'];
  
  for (let i = 1; i <= 40; i++) {
    const name = getRandomElement(driverNames);
    drivers.push({
      id: String(i),
      name: name,
      email: `${name.toLowerCase().replace(' ', '.')}.${i}@pharmx.com`,
      phone: `+1${getRandomNumber(1000000000, 9999999999)}`,
      image: `/driver${(i % 5) + 1}.png`,
      status: getRandomElement(driverStatuses),
      currentLocation: getRandomElement(locations),
      licenseNumber: `DL${getRandomNumber(100000000, 999999999)}`,
      licenseExpiry: getRandomDate(new Date(), new Date(2027, 11, 31)),
      createdAt: getRandomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: getRandomDate(new Date(2024, 0, 1), new Date())
    });
  }

  // Generate Todos (100)
  const todos = [];
  const todoStatuses = ['pending', 'completed'];
  const todoPriorities = ['low', 'medium', 'high'];
  const todoCategories = ['work', 'personal', 'urgent', 'meeting', 'follow-up'];
  
  for (let i = 1; i <= 100; i++) {
    const createdDate = getRandomDate(new Date(2024, 0, 1), new Date());
    const dueDate = new Date(createdDate.getTime() + getRandomNumber(1, 30) * 24 * 60 * 60 * 1000);
    
    todos.push({
      title: `Todo item ${i}: ${getRandomElement(['Review', 'Complete', 'Update', 'Process', 'Check'])} ${getRandomElement(['documents', 'inventory', 'orders', 'reports', 'system'])}`,
      description: `Detailed description for todo item ${i}. This task needs to be completed by the due date.`,
      completed: getRandomElement([true, false]),
      priority: getRandomElement(todoPriorities),
      dueDate: dueDate,
      category: getRandomElement(todoCategories),
      tags: [
        getRandomElement(['important', 'routine', 'urgent', 'optional']),
        getRandomElement(['daily', 'weekly', 'monthly', 'quarterly'])
      ],
      // user will be assigned after users are inserted
      createdAt: createdDate,
      updatedAt: getRandomDate(createdDate, new Date())
    });
  }

  return {
    users,
    orders,
    tasks,
    products,
    invoices,
    vehicles,
    drivers,
    todos
  };
}

async function seedDashboardData() {
  try {
    console.log('🌱 Starting comprehensive database seeding...');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Order.deleteMany({}),
      Task.deleteMany({}),
      Product.deleteMany({}),
      Invoice.deleteMany({}),
      Vehicle.deleteMany({}),
      Driver.deleteMany({}),
      Todo.deleteMany({})
    ]);
    
    console.log('✅ Existing data cleared');

    // Generate seed data
    const seedData = await generateSeedData();

    // Insert seed data
    console.log('📝 Inserting seed data...');
    
    // Insert users first to get their IDs
    const insertedUsers = await User.insertMany(seedData.users);
    
    // Assign random user IDs to todos
    seedData.todos.forEach(todo => {
      todo.user = insertedUsers[Math.floor(Math.random() * insertedUsers.length)]._id;
    });
    
    const results = await Promise.all([
      Promise.resolve(insertedUsers), // users already inserted
      Order.insertMany(seedData.orders),
      Task.insertMany(seedData.tasks),
      Product.insertMany(seedData.products),
      Invoice.insertMany(seedData.invoices),
      Vehicle.insertMany(seedData.vehicles),
      Driver.insertMany(seedData.drivers),
      Todo.insertMany(seedData.todos)
    ]);

    console.log('🎉 Database seeded successfully!');
    console.log(`✅ Inserted ${results[0].length} users`);
    console.log(`✅ Inserted ${results[1].length} orders`);
    console.log(`✅ Inserted ${results[2].length} tasks`);
    console.log(`✅ Inserted ${results[3].length} products`);
    console.log(`✅ Inserted ${results[4].length} invoices`);
    console.log(`✅ Inserted ${results[5].length} vehicles`);
    console.log(`✅ Inserted ${results[6].length} drivers`);
    console.log(`✅ Inserted ${results[7].length} todos`);
    
    return {
      users: results[0],
      orders: results[1],
      tasks: results[2],
      products: results[3],
      invoices: results[4],
      vehicles: results[5],
      drivers: results[6],
      todos: results[7]
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// For backward compatibility
const seedDatabase = seedDashboardData;

module.exports = { 
  seedDatabase, 
  seedDashboardData,
  generateSeedData
};