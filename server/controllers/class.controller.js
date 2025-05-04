const Class = require('../models/Class');
const { CLASSES, COMMON_MODULES } = require('../utils/constants');

// Initialize classes with their modules (to be run once)
exports.initializeClasses = async () => {
  try {
    // First delete all existing classes
    await Class.deleteMany({});
    console.log('Cleared existing classes');

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
    console.log(`Successfully initialized ${createdClasses.length} classes`);
    return createdClasses;
  } catch (error) {
    console.error('Error initializing classes:', error);
    throw error;
  }
};

// Get all classes
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ level: 1, name: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get classes by level
exports.getClassesByLevel = async (req, res) => {
  try {
    const { level } = req.params;
    if (!['NC', 'ND', 'HND'].includes(level)) {
      return res.status(400).json({ error: 'Invalid level. Must be NC, ND, or HND' });
    }

    const classes = await Class.find({ level }).sort({ name: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single class by ID
exports.getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(classData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new class (admin only)
exports.createClass = async (req, res) => {
  try {
    const { name, level, modules } = req.body;

    // Validate level
    if (!['NC', 'ND', 'HND'].includes(level)) {
      return res.status(400).json({ error: 'Invalid level. Must be NC, ND, or HND' });
    }

    // Check if class already exists
    const existingClass = await Class.findOne({ name, level });
    if (existingClass) {
      return res.status(400).json({ error: 'Class with this name and level already exists' });
    }

    // Combine with common modules for the level
    const allModules = [
      ...new Set([
        ...modules,
        ...COMMON_MODULES[level]
      ])
    ];

    const newClass = new Class({
      name,
      level,
      modules: allModules
    });

    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a class (admin only)
exports.updateClass = async (req, res) => {
  try {
    const { name, level, modules } = req.body;
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Validate level if being changed
    if (level && !['NC', 'ND', 'HND'].includes(level)) {
      return res.status(400).json({ error: 'Invalid level. Must be NC, ND, or HND' });
    }

    // Check for duplicate class name and level
    if (name || level) {
      const existingClass = await Class.findOne({
        _id: { $ne: req.params.id },
        name: name || classData.name,
        level: level || classData.level
      });
      if (existingClass) {
        return res.status(400).json({ error: 'Class with this name and level already exists' });
      }
    }

    // Update fields
    if (name) classData.name = name;
    if (level) classData.level = level;
    if (modules) {
      // Combine with common modules for the level
      classData.modules = [
        ...new Set([
          ...modules,
          ...COMMON_MODULES[level || classData.level]
        ])
      ];
    }

    await classData.save();
    res.json(classData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a class (admin only)
exports.deleteClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndDelete(req.params.id);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};