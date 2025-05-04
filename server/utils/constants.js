const CLASSES = [
    {
      name: 'NC Computer Systems',
      level: 'NC',
      modules: [
        'Computer Architecture',
        'Software Engineering',
        'Embedded Systems',
        'Networking Basics',
        'Hardware Components'
      ]
    },
    {
      name: 'ND Computer Systems',
      level: 'ND',
      modules: [
        'Software Engineering',
        'Computer Architecture',
        'Python Programming',
        'Cyber Security',
        'Network Engineering',
        'System Administration',
        'Microprocessor and Embedded Systems'
      ]
    },
    {
        name: 'HND Computer Systems',
        level: 'HND',
        modules: [
          'Advanced Software Engineering',
          'Network Security',
          'Database Management Systems',
          'Web Development',
          'Cloud Computing',
          'Mobile Application Development'
        ]
    }
  ];
  
  const COMMON_MODULES = {
    NC: [
      'Maths',
      'EET',
      'Electronics',
      'Nass',
      'ESD',
      'Communication and Computer Skills'
    ],
    ND: [
      'ESD',
      'NASS',
      'Draughting and Design',
      'Analogue Electronics',
      'Digital Electronics',
      'EET',
      'Maths',
      'Project',
      'Research and Development',
      'Quality Assurance and Control Systems',
      'Project Management'
    ],
    HND: [
      'Engineering Mathematics',
      'Research Methods',
      'Project Management',
      'Quality Assurance and Control Systems',
      'Entrepreneurship and Innovation'
    ]
  };
  
  module.exports = { CLASSES, COMMON_MODULES };