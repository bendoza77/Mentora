// ── 38 real 10th-grade math questions ────────────────────────────────────────
export const ALL_QUESTIONS = [
  // ── ALGEBRA ──────────────────────────────────────────────────────────────
  {
    id: 1, topic: 'Algebra', difficulty: 'medium',
    text: 'Solve for x: 3x² - 12x + 9 = 0',
    options: ['x = 1 or x = 3', 'x = 2 or x = 4', 'x = -1 or x = -3', 'x = 3 only'],
    correct: 0,
  },
  {
    id: 2, topic: 'Algebra', difficulty: 'easy',
    text: 'Simplify: (3x² × 2x³) / 6x',
    options: ['x⁴', 'x³', 'x²', '6x⁴'],
    correct: 0,
  },
  {
    id: 3, topic: 'Algebra', difficulty: 'medium',
    text: 'If 2(x + 3) = 5x - 9, what is x?',
    options: ['3', '4', '5', '6'],
    correct: 2,
  },
  {
    id: 4, topic: 'Algebra', difficulty: 'hard',
    text: 'Find all real solutions: x⁴ - 5x² + 4 = 0',
    options: ['x = ±1, ±2', 'x = ±1, ±4', 'x = ±2, ±4', 'x = ±1 only'],
    correct: 0,
  },
  {
    id: 5, topic: 'Algebra', difficulty: 'medium',
    text: 'Factor completely: 6x² + 7x - 3',
    options: ['(2x + 3)(3x - 1)', '(3x + 1)(2x - 3)', '(6x - 1)(x + 3)', '(2x - 1)(3x + 3)'],
    correct: 0,
  },
  {
    id: 6, topic: 'Algebra', difficulty: 'easy',
    text: 'Which values of x satisfy |2x - 6| = 10?',
    options: ['x = 8 or x = -2', 'x = 8 only', 'x = -2 only', 'x = 3 or x = -2'],
    correct: 0,
  },

  // ── GEOMETRY ─────────────────────────────────────────────────────────────
  {
    id: 7, topic: 'Geometry', difficulty: 'easy',
    text: 'The area of a circle with diameter 10 cm is:',
    options: ['25π cm²', '50π cm²', '100π cm²', '10π cm²'],
    correct: 0,
  },
  {
    id: 8, topic: 'Geometry', difficulty: 'easy',
    text: 'In a right triangle with legs 6 and 8, the hypotenuse is:',
    options: ['10', '12', '14', '100'],
    correct: 0,
  },
  {
    id: 9, topic: 'Geometry', difficulty: 'medium',
    text: 'The sum of interior angles of a regular hexagon is:',
    options: ['360°', '540°', '720°', '900°'],
    correct: 2,
  },
  {
    id: 10, topic: 'Geometry', difficulty: 'medium',
    text: 'Two parallel lines are cut by a transversal. If one alternate interior angle is 65°, the other is:',
    options: ['115°', '65°', '25°', '180°'],
    correct: 1,
  },
  {
    id: 11, topic: 'Geometry', difficulty: 'hard',
    text: 'A cone has radius 3 cm and height 4 cm. Its volume is:',
    options: ['12π cm³', '16π cm³', '36π cm³', '48π cm³'],
    correct: 0,
  },
  {
    id: 12, topic: 'Geometry', difficulty: 'medium',
    text: 'The diagonal of a square with side 5 cm is:',
    options: ['5√2 cm', '10 cm', '5√3 cm', '25 cm'],
    correct: 0,
  },

  // ── TRIGONOMETRY ──────────────────────────────────────────────────────────
  {
    id: 13, topic: 'Trigonometry', difficulty: 'easy',
    text: 'What is sin(30°) + cos(60°)?',
    options: ['0', '1', '√2', '1/2'],
    correct: 1,
  },
  {
    id: 14, topic: 'Trigonometry', difficulty: 'medium',
    text: 'If sin(θ) = 3/5 and θ is in the first quadrant, what is cos(θ)?',
    options: ['4/5', '3/4', '5/3', '4/3'],
    correct: 0,
  },
  {
    id: 15, topic: 'Trigonometry', difficulty: 'easy',
    text: 'What is tan(45°)?',
    options: ['0', '1', '√2', '√3/2'],
    correct: 1,
  },
  {
    id: 16, topic: 'Trigonometry', difficulty: 'hard',
    text: 'Using the identity sin²(x) + cos²(x) = 1, simplify: 1 + tan²(x)',
    options: ['sin²(x)', 'sec²(x)', 'csc²(x)', 'cos²(x)'],
    correct: 1,
  },
  {
    id: 17, topic: 'Trigonometry', difficulty: 'medium',
    text: 'The value of cos(120°) is:',
    options: ['-1/2', '1/2', '-√3/2', '√3/2'],
    correct: 0,
  },

  // ── FUNCTIONS ─────────────────────────────────────────────────────────────
  {
    id: 18, topic: 'Functions', difficulty: 'medium',
    text: 'If f(x) = 2x + 3, what is f(f(2))?',
    options: ['10', '13', '17', '21'],
    correct: 2,
  },
  {
    id: 19, topic: 'Functions', difficulty: 'easy',
    text: 'What is the domain of f(x) = √(x - 4)?',
    options: ['x ≥ 4', 'x > 4', 'x ≥ -4', 'all real numbers'],
    correct: 0,
  },
  {
    id: 20, topic: 'Functions', difficulty: 'medium',
    text: 'If g(x) = x² - 1, what is g(x + 1)?',
    options: ['x²', 'x² + 2x', 'x² + 1', 'x² + 2x - 1'],
    correct: 1,
  },
  {
    id: 21, topic: 'Functions', difficulty: 'medium',
    text: 'If f(x) = 3x - 1, find f⁻¹(x).',
    options: ['(x + 1)/3', '(x - 1)/3', '3x + 1', '1/(3x - 1)'],
    correct: 0,
  },
  {
    id: 22, topic: 'Functions', difficulty: 'hard',
    text: 'If h(x) = f(g(x)) where f(x) = x² and g(x) = 2x + 1, what is h(3)?',
    options: ['37', '49', '13', '25'],
    correct: 1,
  },

  // ── QUADRATICS ────────────────────────────────────────────────────────────
  {
    id: 23, topic: 'Quadratics', difficulty: 'medium',
    text: 'If f(x) = x² - 4x + 4, find the vertex of the parabola.',
    options: ['(2, 0)', '(-2, 0)', '(0, 4)', '(4, 0)'],
    correct: 0,
  },
  {
    id: 24, topic: 'Quadratics', difficulty: 'easy',
    text: 'What is the discriminant of x² - 5x + 6 = 0?',
    options: ['1', '25', '-24', '49'],
    correct: 0,
  },
  {
    id: 25, topic: 'Quadratics', difficulty: 'medium',
    text: 'The roots of x² - 7x + 10 = 0 are:',
    options: ['x = 2, x = 5', 'x = -2, x = -5', 'x = 2, x = -5', 'x = 1, x = 10'],
    correct: 0,
  },
  {
    id: 26, topic: 'Quadratics', difficulty: 'hard',
    text: 'A parabola y = ax² + bx + c has vertex (1, -3) and passes through (0, -2). Find a.',
    options: ['1', '-1', '2', '-2'],
    correct: 0,
  },

  // ── STATISTICS ────────────────────────────────────────────────────────────
  {
    id: 27, topic: 'Statistics', difficulty: 'easy',
    text: 'The mean of {4, 7, 10, 13, 16} is:',
    options: ['9', '10', '11', '12'],
    correct: 1,
  },
  {
    id: 28, topic: 'Statistics', difficulty: 'easy',
    text: 'The median of {3, 7, 5, 1, 9} is:',
    options: ['5', '7', '4', '6'],
    correct: 0,
  },
  {
    id: 29, topic: 'Statistics', difficulty: 'medium',
    text: 'Standard deviation measures the _____ of data values around the mean.',
    options: ['spread', 'center', 'frequency', 'sum'],
    correct: 0,
  },
  {
    id: 30, topic: 'Statistics', difficulty: 'medium',
    text: 'The mean of five numbers is 12. Four of them are 8, 10, 14, 16. What is the fifth?',
    options: ['12', '10', '14', '16'],
    correct: 0,
  },

  // ── PROBABILITY ───────────────────────────────────────────────────────────
  {
    id: 31, topic: 'Probability', difficulty: 'easy',
    text: 'A fair die is rolled. Probability of getting a number greater than 4:',
    options: ['1/6', '2/6', '3/6', '4/6'],
    correct: 1,
  },
  {
    id: 32, topic: 'Probability', difficulty: 'easy',
    text: 'A bag has 3 red and 5 blue balls. Probability of drawing a red ball:',
    options: ['3/8', '5/8', '3/5', '1/3'],
    correct: 0,
  },
  {
    id: 33, topic: 'Probability', difficulty: 'medium',
    text: 'Two coins are tossed. Probability of getting exactly one head:',
    options: ['1/4', '1/2', '3/4', '1'],
    correct: 1,
  },
  {
    id: 34, topic: 'Probability', difficulty: 'hard',
    text: 'Cards numbered 1–20 are shuffled. Probability of drawing a prime number:',
    options: ['2/5', '1/4', '7/20', '9/20'],
    correct: 0,
  },

  // ── CALCULUS ──────────────────────────────────────────────────────────────
  {
    id: 35, topic: 'Calculus', difficulty: 'medium',
    text: 'What is the derivative of f(x) = 3x⁴ - 2x² + 5?',
    options: ['12x³ - 4x', '12x³ - 4x + 5', '3x³ - 2x', '12x⁴ - 4x²'],
    correct: 0,
  },
  {
    id: 36, topic: 'Calculus', difficulty: 'medium',
    text: 'The indefinite integral of 2x dx is:',
    options: ['x² + C', '2x² + C', 'x + C', '2 + C'],
    correct: 0,
  },
  {
    id: 37, topic: 'Calculus', difficulty: 'hard',
    text: 'At what x-value does f(x) = x³ - 3x² have a local minimum?',
    options: ['x = 0', 'x = 2', 'x = -2', 'x = 1'],
    correct: 1,
  },
  {
    id: 38, topic: 'Calculus', difficulty: 'hard',
    text: 'What is the limit: lim(x→0) [sin(x) / x]?',
    options: ['0', '1', '∞', 'undefined'],
    correct: 1,
  },
];

export const TOPIC_NAMES = [
  'All', 'Algebra', 'Geometry', 'Trigonometry',
  'Functions', 'Quadratics', 'Statistics', 'Probability', 'Calculus',
];

export const SECS_PER_QUESTION = 90; // 1.5 min per question
