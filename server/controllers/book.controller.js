const Book = require('../models/Book');
const Class = require('../models/Class');
const { uploadToFirebase } = require('../middlewares/upload');

// Add new book
exports.addBook = async (req, res) => {
  try {
    const { title, author, class: className, module, level } = req.body;
    
    // Validate class and level combination exists
    const classExists = await Class.findOne({ 
      name: className, 
      level 
    });

    if (!classExists) {
      return res.status(400).json({ 
        error: `Class ${className} at ${level} level doesn't exist` 
      });
    }

    // Validate module belongs to this class-level
    if (!classExists.modules.includes(module)) {
      return res.status(400).json({ 
        error: `Module ${module} is not part of ${className} at ${level} level` 
      });
    }

    // Handle file upload
    let fileData = null;
    if (req.file) {
      fileData = await uploadToFirebase(req.file);
    }

    // Create new book
    const book = new Book({
      title,
      author,
      class: className,
      module,
      level,
      publicationYear: req.body.publicationYear,
      publisher: req.body.publisher,
      edition: req.body.edition,
      description: req.body.description,
      fileUrl: fileData?.url || null,
      fileName: fileData?.name || null,
      fileType: fileData?.type || null,
      available: req.body.available !== false, // Default true
      addedBy: req.user._id
    });

    await book.save();
    
    // Populate addedBy field in response
    const populatedBook = await Book.findById(book._id)
      .populate('addedBy', 'name email');

    res.status(201).json(populatedBook);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get books with filtering
exports.getBooks = async (req, res) => {
  try {
    const { class: className, level, module, available } = req.query;
    const query = {};
    
    // Build query based on provided filters
    if (className) query.class = className;
    if (level) query.level = level;
    if (module) query.module = module;
    if (available !== undefined) query.available = available === 'true';

    // For students, only show available books
    if (req.user.role === 'student') {
      query.available = true;
    }

    const books = await Book.find(query)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'name email');

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, module, available } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Validate module if being updated
    if (module) {
      const classData = await Class.findOne({ 
        name: book.class, 
        level: book.level 
      });
      
      if (!classData.modules.includes(module)) {
        return res.status(400).json({ 
          error: `Module ${module} is not valid for ${book.class} at ${book.level} level` 
        });
      }
    }

    // Update fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (module) book.module = module;
    if (available !== undefined) book.available = available;

    // Handle file update if new file provided
    if (req.file) {
      // TODO: Delete old file from Firebase if needed
      const fileData = await uploadToFirebase(req.file);
      book.fileUrl = fileData.url;
      book.fileName = fileData.name;
      book.fileType = fileData.type;
    }

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // TODO: Delete file from Firebase if needed
    await book.deleteOne();
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};