const User = require('../models/User');
const Class = require('../models/Class');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Generate email from name
const generateEmail = (name) => {
  const cleanName = name.toLowerCase().replace(/\s+/g, '.');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${cleanName}.${randomNum}@mtrepoly.edu`;
};

// Register new user
// Register new user
exports.register = async (req, res) => {
    try {
      const { name, role, classLevels } = req.body;
      let { password } = req.body;
  
      // Generate email
      const email = generateEmail(name);
      
      // Set default password for students if not provided
      if (role === 'student' && !password) {
        password = 'mtrpoly'; // Default student password
      }
  
      // Validate password exists for admin
      if (role === 'admin' && !password) {
        return res.status(400).json({ error: 'Password is required for admin' });
      }
  
      // Validate classLevels for students
      if (role === 'student') {
        if (!classLevels || classLevels.length === 0) {
          return res.status(400).json({ error: 'Students must be assigned to at least one class level' });
        }
  
        // Validate each class-level combination
        for (const { class: classId, level } of classLevels) {
          const classExists = await Class.findOne({ _id: classId });
          if (!classExists) {
            return res.status(400).json({ 
              error: `Class with ID ${classId} not found`
            });
          }
          
          if (!classExists.modules || !classExists.modules.length) {
            return res.status(400).json({
              error: `Class ${classExists.name} has no modules assigned`
            });
          }
        }
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create user
      const user = new User({
        email,
        name,
        role,
        password: hashedPassword,
        classLevels: role === 'student' ? classLevels : undefined
      });
  
      await user.save();
      
      // Generate token
      const token = generateToken(user);
      
      const response = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      };
  
      // Add temporary password only for students
      if (role === 'student') {
        response.temporaryPassword = password;
      }
  
      // Add classLevels if student
      if (role === 'student') {
        response.classLevels = user.classLevels;
      }
  
      res.status(201).json(response);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  };

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email: email })
    if (!user) {
    console.log("USER+++++++++++++++++++++++++ not found", email);

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    console.log("PASSWORD+++++++++++++++++++++++++ does not match", email);

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    // Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.json({
      ...userData,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk create students
exports.bulkCreateStudents = async (req, res) => {
  try {
    const { students } = req.body; // Array of { name, classLevels: [{ class, level }] }
    const createdStudents = [];

    for (const student of students) {
      try {
        // Validate class-levels
        for (const { class: classId, level } of student.classLevels) {
          const classExists = await Class.findOne({ _id: classId, level });
          if (!classExists) {
            throw new Error(`Invalid class-level combination: ${classId} with level ${level}`);
          }
        }

        // Create student
        const email = generateEmail(student.name);
        const defaultPassword = 'mtrpoly';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const user = new User({
          email,
          name: student.name,
          role: 'student',
          password: hashedPassword,
          classLevels: student.classLevels
        });

        await user.save();

        createdStudents.push({
          name: user.name,
          email: user.email,
          classLevels: user.classLevels,
          temporaryPassword: defaultPassword
        });
      } catch (error) {
        console.error(`Error creating student ${student.name}:`, error.message);
      }
    }

    res.status(201).json({
      message: `Successfully created ${createdStudents.length} students`,
      students: createdStudents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('classLevels.class', 'name level modules');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};