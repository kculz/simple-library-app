const mongoose = require('mongoose');
const { CLASSES, COMMON_MODULES } = require('./constants');
const Class = require('../models/Class');
require('dotenv').config();

async function initialize() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing classes and indexes
    await Class.collection.drop();
    console.log('Dropped existing classes collection');

    // Recreate the collection with proper indexes
    await Class.init();
    console.log('Recreated Class collection with indexes');

    // Initialize classes
    const classesToCreate = [];
    
    // Process specialized classes
    for (const classData of CLASSES) {
      // Combine specialized modules with common modules for the level
      const allModules = [
        ...classData.modules,
        ...COMMON_MODULES[classData.level]
      ];
      
      classesToCreate.push({
        name: classData.name.replace(`${classData.level} `, ''), // Remove level prefix
        level: classData.level,
        modules: [...new Set(allModules)] // Remove duplicates
      });
    }

    // Create classes in database
    const createdClasses = await Class.insertMany(classesToCreate);
    
    console.log(`Successfully initialized ${createdClasses.length} classes:`);
    createdClasses.forEach(c => {
      console.log(`- ${c.level} ${c.name} (${c.modules.length} modules)`);
    });

    process.exit(0);
  } catch (error) {
    // Handle specific error when collection doesn't exist yet
    if (error.message.includes('ns not found')) {
      console.log('Classes collection did not exist, creating new one');
      await initializeClasses();
      return;
    }
    console.error('Initialization failed:', error);
    process.exit(1);
  }

  async function initializeClasses() {
    // Create classes in database
    const classesToCreate = [];
    
    for (const classData of CLASSES) {
      const allModules = [
        ...classData.modules,
        ...COMMON_MODULES[classData.level]
      ];
      
      classesToCreate.push({
        name: classData.name.replace(`${classData.level} `, ''),
        level: classData.level,
        modules: [...new Set(allModules)]
      });
    }

    const createdClasses = await Class.insertMany(classesToCreate);
    
    console.log(`Successfully initialized ${createdClasses.length} classes:`);
    createdClasses.forEach(c => {
      console.log(`- ${c.level} ${c.name} (${c.modules.length} modules)`);
    });

    process.exit(0);
  }
}

initialize();