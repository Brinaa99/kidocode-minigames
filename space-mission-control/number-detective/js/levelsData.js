/**
 * The Number Detective - 10 Mystery Cases Data
 * Defines investigation lore, crime scene hotspots, mathematical evidence,
 * suspect profiles, clues, hints, and learning debriefs.
 */

window.DETECTIVE_CASES = [
  // ==========================================
  // CASE 1: THE MISSING NUMBER
  // ==========================================
  {
    id: 1,
    title: "Case 1 – The Missing Number",
    subtitle: "The Archivist's Torn Ledger",
    topic: "Multiplication Tables & Products",
    sceneName: "office",
    briefing: {
      lore: "Chief Archivist Higgins called the bureau in distress! Someone broke into the City Archive and tore crucial numbers out of the mathematical records vault.",
      objective: "Inspect the archivist's office, discover the torn ledger scraps, and calculate the missing numbers to restore the records.",
      mathConcept: "Multiplication Facts: Finding the product of two factors (e.g. 7 × 8 = 56)."
    },
    hotspots: [
      { id: "h1", x: 320, y: 220, radius: 18, label: "TORN LEDGER" },
      { id: "h2", x: 480, y: 160, radius: 16, label: "DESK DRAWER" },
      { id: "h3", x: 650, y: 210, radius: 18, label: "WALL CLOCK" }
    ],
    stages: [
      {
        id: "c1_s1",
        title: "Evidence Scrap #1: Ledger Entry Alpha",
        description: "You inspect the torn ledger scrap on the desk blotter. A multiplication equation is missing its product.",
        question: "Calculate the missing product: 7 × 8 = ?",
        targetAnswer: "56",
        options: [
          { text: "54", value: "54", correct: false },
          { text: "56", value: "56", correct: true },
          { text: "64", value: "64", correct: false },
          { text: "58", value: "58", correct: false }
        ],
        explanation: "Correct deduction! 7 × 8 = 56. (7 groups of 8 equals 56).",
        hint: "Think of 7 × 7 = 49, then add one more group of 7: 49 + 7 = 56."
      },
      {
        id: "c1_s2",
        title: "Evidence Scrap #2: Hidden Desk Note",
        description: "Inside the mahogany drawer, you find a note with the equation: 9 × 6 = ?",
        question: "What is the product of 9 × 6?",
        targetAnswer: "54",
        options: [
          { text: "45", value: "45", correct: false },
          { text: "54", value: "54", correct: true },
          { text: "56", value: "56", correct: false },
          { text: "63", value: "63", correct: false }
        ],
        explanation: "Spot on! 9 × 6 = 54. Notice that the digits 5 + 4 = 9, which is a neat rule for the 9 times table!",
        hint: "10 × 6 is 60. Subtract 6 to get 9 × 6 = 54."
      },
      {
        id: "c1_s3",
        title: "Evidence Scrap #3: Pendulum Clue",
        description: "Behind the grandfather clock's glass door, you find the final clue: [ ? ] × 6 = 48.",
        question: "What missing number multiplied by 6 equals 48?",
        targetAnswer: "8",
        options: [
          { text: "7", value: "7", correct: false },
          { text: "8", value: "8", correct: true },
          { text: "9", value: "9", correct: false },
          { text: "6", value: "6", correct: false }
        ],
        explanation: "Brilliant sleuthing! 8 × 6 = 48. The missing factor was 8.",
        hint: "48 divided by 6 is 8, because 6 × 8 = 48."
      }
    ]
  },

  // ==========================================
  // CASE 2: THE SECRET SEQUENCE
  // ==========================================
  {
    id: 2,
    title: "Case 2 – The Secret Sequence",
    subtitle: "The Subway Station Multiples Trail",
    topic: "Multiples & Number Sequences",
    sceneName: "alley",
    briefing: {
      lore: "A mysterious courier dropped numbered tokens along the subway tracks. The numbers form sequences of mathematical multiples.",
      objective: "Inspect the subway platform, analyze the number patterns, and find the missing multiples to decode the getaway route.",
      mathConcept: "Multiples: Numbers resulting from multiplying a given number by whole numbers (1, 2, 3, 4...)."
    },
    hotspots: [
      { id: "h1", x: 260, y: 240, radius: 18, label: "TRACK TILES" },
      { id: "h2", x: 420, y: 180, radius: 16, label: "SUBWAY MAP" },
      { id: "h3", x: 600, y: 220, radius: 18, label: "TICKET BOOTH" }
    ],
    stages: [
      {
        id: "c2_s1",
        title: "Clue #1: The 4s Multiples Pattern",
        description: "On the platform tiles, you find sprayed numbers: 4, 8, 12, 16, [ ? ], 24.",
        question: "Which multiple of 4 is missing from this sequence?",
        targetAnswer: "20",
        options: [
          { text: "18", value: "18", correct: false },
          { text: "20", value: "20", correct: true },
          { text: "22", value: "22", correct: false },
          { text: "21", value: "21", correct: false }
        ],
        explanation: "Correct! The sequence counts by 4s: 4 × 1 = 4, 4 × 2 = 8, 4 × 3 = 12, 4 × 4 = 16, 4 × 5 = 20, 4 × 6 = 24.",
        hint: "Add 4 to 16, or calculate 4 × 5."
      },
      {
        id: "c2_s2",
        title: "Clue #2: The 7s Multiples Sequence",
        description: "On the subway map wall, a second sequence is discovered: 7, 14, 21, 28, [ ? ], 42.",
        question: "What is the missing multiple in the 7s sequence?",
        targetAnswer: "35",
        options: [
          { text: "32", value: "32", correct: false },
          { text: "35", value: "35", correct: true },
          { text: "36", value: "36", correct: false },
          { text: "38", value: "38", correct: false }
        ],
        explanation: "Great job! 7 × 5 = 35. 35 is the 5th multiple of 7.",
        hint: "28 + 7 = 35, or 7 × 5 = 35."
      },
      {
        id: "c2_s3",
        title: "Clue #3: Identifying Multiples",
        description: "Near the ticket booth, the courier dropped 4 suspect badge cards.",
        question: "Which of these numbers is a multiple of 6?",
        targetAnswer: "42",
        options: [
          { text: "25", value: "25", correct: false },
          { text: "38", value: "38", correct: false },
          { text: "42", value: "42", correct: true },
          { text: "45", value: "45", correct: false }
        ],
        explanation: "Spot on! 42 is a multiple of 6 because 6 × 7 = 42.",
        hint: "Check which number can be divided by 6 without any remainder."
      }
    ]
  },

  // ==========================================
  // CASE 3: THE WAREHOUSE MYSTERY
  // ==========================================
  {
    id: 3,
    title: "Case 3 – The Warehouse Mystery",
    subtitle: "The Harbor Docks Equal Groupings",
    topic: "Factors & Equal Division",
    sceneName: "warehouse",
    briefing: {
      lore: "A shipment of 24 crates was delivered to Pier 7, but the warehouse foreman cannot organize them without understanding factors.",
      objective: "Inspect the shipping containers, find all numbers that divide 24 equally, and discover the hidden contraband locker.",
      mathConcept: "Factors: Whole numbers that multiply together to make a product without leaving a remainder."
    },
    hotspots: [
      { id: "h1", x: 280, y: 220, radius: 18, label: "CARGO CRATE" },
      { id: "h2", x: 490, y: 190, radius: 16, label: "SHIPPING LOG" },
      { id: "h3", x: 670, y: 240, radius: 18, label: "PIER LOCKER" }
    ],
    stages: [
      {
        id: "c3_s1",
        title: "Locker Lock 1: Factor of 24",
        description: "The warehouse manifest has 24 boxes. You need to group them in equal rows.",
        question: "Which of the following numbers is a factor of 24?",
        targetAnswer: "6",
        options: [
          { text: "5", value: "5", correct: false },
          { text: "6", value: "6", correct: true },
          { text: "7", value: "7", correct: false },
          { text: "9", value: "9", correct: false }
        ],
        explanation: "Correct! 6 is a factor of 24 because 4 × 6 = 24 with 0 remainder.",
        hint: "Does 24 divide evenly by 5, 6, 7, or 9?"
      },
      {
        id: "c3_s2",
        title: "Locker Lock 2: Factor Pairs of 24",
        description: "To open the master locker, you must identify a complete factor pair that multiplies to 24.",
        question: "Which pair of numbers multiplies together to equal 24?",
        targetAnswer: "3 and 8",
        options: [
          { text: "3 and 8", value: "3 and 8", correct: true },
          { text: "4 and 7", value: "4 and 7", correct: false },
          { text: "2 and 14", value: "2 and 14", correct: false },
          { text: "5 and 5", value: "5 and 5", correct: false }
        ],
        explanation: "Excellent! 3 × 8 = 24. So (3, 8) is a factor pair of 24.",
        hint: "3 groups of 8 equals 24."
      },
      {
        id: "c3_s3",
        title: "Locker Lock 3: NOT a Factor",
        description: "The second shipment contains 30 barrels. One number does NOT divide 30 evenly.",
        question: "Which number is NOT a factor of 30?",
        targetAnswer: "7",
        options: [
          { text: "2", value: "2", correct: false },
          { text: "3", value: "3", correct: false },
          { text: "5", value: "5", correct: false },
          { text: "7", value: "7", correct: true }
        ],
        explanation: "Smart deduction! 30 ÷ 7 = 4 with a remainder of 2. Because it does not divide evenly, 7 is NOT a factor of 30.",
        hint: "Is 30 in the 7 times table? (7, 14, 21, 28, 35... no 30!)."
      }
    ]
  },

  // ==========================================
  // CASE 4: THE SUSPICIOUS SUSPECTS
  // ==========================================
  {
    id: 4,
    title: "Case 4 – The Suspicious Suspects",
    subtitle: "The Bureau Lineup Elimination",
    topic: "Multiplication & Detective Elimination",
    sceneName: "lineup",
    briefing: {
      lore: "A famous emerald was stolen from the Grand Hotel. Four suspects were brought in for questioning, and each gave numerical alibis.",
      objective: "Analyze each suspect's mathematical statement. Eliminate false suspects until the true thief is caught!",
      mathConcept: "Applying multiplication facts to verify mathematical statements and eliminate false claims."
    },
    hotspots: [
      { id: "h1", x: 230, y: 220, radius: 18, label: "SUSPECT #1" },
      { id: "h2", x: 380, y: 220, radius: 18, label: "SUSPECT #2" },
      { id: "h3", x: 530, y: 220, radius: 18, label: "SUSPECT #3" },
      { id: "h4", x: 680, y: 220, radius: 18, label: "SUSPECT #4" }
    ],
    stages: [
      {
        id: "c4_s1",
        title: "Lineup Clue 1: Shoe Print Size",
        description: "The crime lab found muddy footprints. The clue says: 'Culprit shoe size multiplied by 6 equals 42.'",
        question: "What is the culprit's shoe size? ([ ? ] × 6 = 42)",
        targetAnswer: "7",
        options: [
          { text: "6", value: "6", correct: false },
          { text: "7", value: "7", correct: true },
          { text: "8", value: "8", correct: false },
          { text: "9", value: "9", correct: false }
        ],
        explanation: "Deduction verified! 7 × 6 = 42. Suspects who do not wear size 7 are eliminated!",
        hint: "42 ÷ 6 = 7."
      },
      {
        id: "c4_s2",
        title: "Lineup Clue 2: The Getaway Car Speed",
        description: "Speed radar clocked the getaway car: 'Speed was 8 times 9 miles per hour.'",
        question: "What was the getaway speed? (8 × 9 = ?)",
        targetAnswer: "72",
        options: [
          { text: "64", value: "64", correct: false },
          { text: "72", value: "72", correct: true },
          { text: "81", value: "81", correct: false },
          { text: "76", value: "76", correct: false }
        ],
        explanation: "Correct! 8 × 9 = 72 mph. You have narrowed down the vehicle!",
        hint: "8 × 10 = 80. Subtract 8 to get 72."
      },
      {
        id: "c4_s3",
        title: "Lineup Clue 3: The Culprit's Key Number",
        description: "The emerald was hidden inside a locker matching the product of 9 × 7.",
        question: "Which locker number holds the stolen emerald? (9 × 7 = ?)",
        targetAnswer: "63",
        options: [
          { text: "56", value: "56", correct: false },
          { text: "63", value: "63", correct: true },
          { text: "72", value: "72", correct: false },
          { text: "67", value: "67", correct: false }
        ],
        explanation: "Case Solved! 9 × 7 = 63. You recovered the emerald and arrested the suspect!",
        hint: "9 groups of 7 is 63."
      }
    ]
  },

  // ==========================================
  // CASE 5: THE STOLEN COLLECTION
  // ==========================================
  {
    id: 5,
    title: "Case 5 – The Stolen Collection",
    subtitle: "The Museum of Antiquities Heist",
    topic: "Common Multiples (3 and 5)",
    sceneName: "museum",
    briefing: {
      lore: "A thief broke into the Museum of Antiquities and selectively stole numbered golden coins from the glass exhibit cases.",
      objective: "Determine the thief's selection pattern using common multiples to identify which coins are missing.",
      mathConcept: "Common Multiples: Numbers that are multiples of two or more given numbers (e.g. multiples of both 3 and 5)."
    },
    hotspots: [
      { id: "h1", x: 260, y: 210, radius: 18, label: "GOLD DISPLAY" },
      { id: "h2", x: 460, y: 170, radius: 16, label: "GUARD LOG" },
      { id: "h3", x: 640, y: 220, radius: 18, label: "VAULT GLASS" }
    ],
    stages: [
      {
        id: "c5_s1",
        title: "Exhibit Case A: Common Multiples of 3 and 5",
        description: "The thief only stole coins that are multiples of BOTH 3 and 5.",
        question: "Which of these coin numbers was stolen? (Multiple of both 3 and 5)",
        targetAnswer: "30",
        options: [
          { text: "20", value: "20", correct: false },
          { text: "25", value: "25", correct: false },
          { text: "30", value: "30", correct: true },
          { text: "35", value: "35", correct: false }
        ],
        explanation: "Correct! 30 is in the 3 times table (3 × 10 = 30) AND the 5 times table (5 × 6 = 30). It is a common multiple!",
        hint: "Check which number ends in 0 or 5 AND has digits that add up to a multiple of 3."
      },
      {
        id: "c5_s2",
        title: "Exhibit Case B: Another Common Multiple",
        description: "A second missing coin is also a common multiple of 3 and 5 between 40 and 50.",
        question: "Which coin between 40 and 50 is a multiple of both 3 and 5?",
        targetAnswer: "45",
        options: [
          { text: "40", value: "40", correct: false },
          { text: "42", value: "42", correct: false },
          { text: "45", value: "45", correct: true },
          { text: "50", value: "50", correct: false }
        ],
        explanation: "Outstanding! 45 is a multiple of 5 (5 × 9 = 45) and 3 (3 × 15 = 45).",
        hint: "3 × 15 = 45 and 5 × 9 = 45."
      },
      {
        id: "c5_s3",
        title: "Exhibit Case C: Common Multiples of 4 and 6",
        description: "The thief also stole a silver medallion that is a common multiple of 4 and 6.",
        question: "Which number is a common multiple of both 4 and 6?",
        targetAnswer: "24",
        options: [
          { text: "16", value: "16", correct: false },
          { text: "18", value: "18", correct: false },
          { text: "20", value: "20", correct: false },
          { text: "24", value: "24", correct: true }
        ],
        explanation: "Case closed! 24 is 4 × 6 and 6 × 4. It is a common multiple of 4 and 6!",
        hint: "Multiples of 4: 4, 8, 12, 16, 20, 24. Multiples of 6: 6, 12, 18, 24."
      }
    ]
  },

  // ==========================================
  // CASE 6: THE LOCKED EVIDENCE ROOM
  // ==========================================
  {
    id: 6,
    title: "Case 6 – The Locked Evidence Room",
    subtitle: "The Security Vault Combination",
    topic: "Factors & Factor Pairs",
    sceneName: "vault",
    briefing: {
      lore: "The chief's evidence safe has engaged lockdown mode! The electronic keypad will only unlock if factor pairs are entered correctly.",
      objective: "Find the factor pairs for numbers 36 and 48 to crack the combination locks.",
      mathConcept: "Factor Pairs: Two factors that multiply together to produce a given number (e.g. 6 × 6 = 36, 4 × 9 = 36)."
    },
    hotspots: [
      { id: "h1", x: 300, y: 210, radius: 18, label: "KEYPAD 1" },
      { id: "h2", x: 480, y: 170, radius: 16, label: "TUMBLER DIAL" },
      { id: "h3", x: 650, y: 220, radius: 18, label: "VAULT SAFE" }
    ],
    stages: [
      {
        id: "c6_s1",
        title: "Vault Lock 1: Factor Pair of 36",
        description: "Keypad 1 requires the missing number in the factor pair: 4 × [ ? ] = 36.",
        question: "What number completes the factor pair: 4 × [ ? ] = 36?",
        targetAnswer: "9",
        options: [
          { text: "7", value: "7", correct: false },
          { text: "8", value: "8", correct: false },
          { text: "9", value: "9", correct: true },
          { text: "12", value: "12", correct: false }
        ],
        explanation: "Lock 1 clicks open! 4 × 9 = 36. So (4, 9) is a factor pair of 36.",
        hint: "36 divided by 4 equals 9."
      },
      {
        id: "c6_s2",
        title: "Vault Lock 2: Factor Pair of 48",
        description: "Keypad 2 requires the partner factor for 6 to make 48: 6 × [ ? ] = 48.",
        question: "What number completes the factor pair: 6 × [ ? ] = 48?",
        targetAnswer: "8",
        options: [
          { text: "7", value: "7", correct: false },
          { text: "8", value: "8", correct: true },
          { text: "9", value: "9", correct: false },
          { text: "10", value: "10", correct: false }
        ],
        explanation: "Lock 2 clicks open! 6 × 8 = 48. (6, 8) is a factor pair of 48.",
        hint: "6 × 8 = 48."
      },
      {
        id: "c6_s3",
        title: "Vault Lock 3: Greatest Factor",
        description: "The final electronic lock asks: What is the greatest factor of 36 OTHER than 36 itself?",
        question: "What is the largest factor of 36 (less than 36)?",
        targetAnswer: "18",
        options: [
          { text: "12", value: "12", correct: false },
          { text: "16", value: "16", correct: false },
          { text: "18", value: "18", correct: true },
          { text: "9", value: "9", correct: false }
        ],
        explanation: "VAULT UNLOCKED! 18 × 2 = 36, making 18 the largest factor of 36 below 36 itself.",
        hint: "Divide 36 by the smallest factor greater than 1 (which is 2): 36 ÷ 2 = 18."
      }
    ]
  },

  // ==========================================
  // CASE 7: THE DOUBLE AGENT
  // ==========================================
  {
    id: 7,
    title: "Case 7 – The Double Agent",
    subtitle: "The Clock Tower Rendezvous",
    topic: "Lowest Common Multiples (LCM)",
    sceneName: "clocktower",
    briefing: {
      lore: "An informant intercepted radio beeps transmitted by two covert operatives from the City Clock Tower.",
      objective: "Compare the transmission frequencies to find their common multiples and intercept the secret meeting.",
      mathConcept: "Lowest Common Multiple: The smallest positive integer that is divisible by both numbers."
    },
    hotspots: [
      { id: "h1", x: 280, y: 220, radius: 18, label: "TOWER CLOCK" },
      { id: "h2", x: 450, y: 170, radius: 16, label: "RADIO ANTENNA" },
      { id: "h3", x: 630, y: 230, radius: 18, label: "AGENT NOTEBOOK" }
    ],
    stages: [
      {
        id: "c7_s1",
        title: "Radio Frequency A: 4 and 6 Minutes",
        description: "Agent Alpha beeps every 4 minutes. Agent Beta beeps every 6 minutes. Both just started at Minute 0.",
        question: "At what minute will BOTH agents transmit at the exact same time first? (LCM of 4 and 6)",
        targetAnswer: "12",
        options: [
          { text: "10", value: "10", correct: false },
          { text: "12", value: "12", correct: true },
          { text: "16", value: "16", correct: false },
          { text: "24", value: "24", correct: false }
        ],
        explanation: "Brilliant! Multiples of 4: 4, 8, 12... Multiples of 6: 6, 12... The first common multiple is 12 minutes!",
        hint: "List multiples of 4 (4, 8, 12) and 6 (6, 12)."
      },
      {
        id: "c7_s2",
        title: "Radio Frequency B: The Second Rendezvous",
        description: "If they transmit together at 12 minutes, when is the NEXT time they transmit together?",
        question: "What is the next common multiple after 12?",
        targetAnswer: "24",
        options: [
          { text: "18", value: "18", correct: false },
          { text: "20", value: "20", correct: false },
          { text: "24", value: "24", correct: true },
          { text: "30", value: "30", correct: false }
        ],
        explanation: "Correct! The next common multiple of 4 and 6 is 24 minutes (12 × 2 = 24).",
        hint: "Add 12 to 12, or check 4 × 6 = 24."
      },
      {
        id: "c7_s3",
        title: "Radio Frequency C: 3 and 5 Minutes",
        description: "A third transmission pairs Agent Gamma (every 3 mins) and Agent Delta (every 5 mins).",
        question: "What is the lowest common multiple of 3 and 5?",
        targetAnswer: "15",
        options: [
          { text: "8", value: "8", correct: false },
          { text: "10", value: "10", correct: false },
          { text: "15", value: "15", correct: true },
          { text: "30", value: "30", correct: false }
        ],
        explanation: "Target intercepted! Since 3 and 5 are prime numbers, their lowest common multiple is 3 × 5 = 15 minutes.",
        hint: "Multiples of 5: 5, 10, 15. Is 15 in the 3 times table? Yes (3 × 5 = 15)!"
      }
    ]
  },

  // ==========================================
  // CASE 8: THE BROKEN MACHINE
  // ==========================================
  {
    id: 8,
    title: "Case 8 – The Broken Machine",
    subtitle: "Professor Cipher's Clockwork Laboratory",
    topic: "Multiplication & Factor Cogs",
    sceneName: "lab",
    briefing: {
      lore: "Professor Cipher's codebreaker machine was sabotaged. The numerical cogs were detached from their drive gears.",
      objective: "Match the product gears with their correct factor cogs to restart the clockwork cipher engine.",
      mathConcept: "Connecting products with their factor pairs through reverse operations."
    },
    hotspots: [
      { id: "h1", x: 270, y: 220, radius: 18, label: "MAIN COG" },
      { id: "h2", x: 450, y: 180, radius: 16, label: "PRESSURE DIAL" },
      { id: "h3", x: 640, y: 230, radius: 18, label: "GEARBOX" }
    ],
    stages: [
      {
        id: "c8_s1",
        title: "Gearbox Assembly 1: The 56 Cog",
        description: "The primary drive wheel requires a product of 56.",
        question: "Which factor pair will spin the 56 gear?",
        targetAnswer: "7 × 8",
        options: [
          { text: "6 × 8", value: "6 × 8", correct: false },
          { text: "7 × 8", value: "7 × 8", correct: true },
          { text: "7 × 9", value: "7 × 9", correct: false },
          { text: "6 × 9", value: "6 × 9", correct: false }
        ],
        explanation: "Gear clicks into place! 7 × 8 = 56.",
        hint: "7 groups of 8 equals 56."
      },
      {
        id: "c8_s2",
        title: "Gearbox Assembly 2: The 72 Cog",
        description: "The secondary rotor needs a product of 72.",
        question: "Which factor pair produces 72?",
        targetAnswer: "8 × 9",
        options: [
          { text: "7 × 9", value: "7 × 9", correct: false },
          { text: "8 × 8", value: "8 × 8", correct: false },
          { text: "8 × 9", value: "8 × 9", correct: true },
          { text: "9 × 9", value: "9 × 9", correct: false }
        ],
        explanation: "Rotor hums to life! 8 × 9 = 72.",
        hint: "8 × 8 = 64, add 8 to get 72 (8 × 9)."
      },
      {
        id: "c8_s3",
        title: "Gearbox Assembly 3: The 63 Cog",
        description: "The third governor wheel needs 63.",
        question: "Which factor pair produces 63?",
        targetAnswer: "7 × 9",
        options: [
          { text: "6 × 9", value: "6 × 9", correct: false },
          { text: "7 × 9", value: "7 × 9", correct: true },
          { text: "7 × 8", value: "7 × 8", correct: false },
          { text: "8 × 8", value: "8 × 8", correct: false }
        ],
        explanation: "MACHINE RESTORED! 7 × 9 = 63. The cipher engine is running smoothly!",
        hint: "7 × 10 = 70. Subtract 7 to get 63."
      }
    ]
  },

  // ==========================================
  // CASE 9: THE MASTER CODE
  // ==========================================
  {
    id: 9,
    title: "Case 9 – The Master Code",
    subtitle: "The Central Server Decryption",
    topic: "Combined Multiplication, Multiples & Factors",
    sceneName: "telegraph",
    briefing: {
      lore: "A cyber-syndicate encrypted the city's power grid. The mainframe requires solving 3 multi-layered mathematical ciphers.",
      objective: "Combine your knowledge of multiplication, multiples, and factors to crack the master code.",
      mathConcept: "Integrating tables, multiples, and factors to solve multi-step mathematical puzzles."
    },
    hotspots: [
      { id: "h1", x: 290, y: 220, radius: 18, label: "TERMINAL" },
      { id: "h2", x: 470, y: 170, radius: 16, label: "TAPE DRIVE" },
      { id: "h3", x: 650, y: 220, radius: 18, label: "SWITCHBOARD" }
    ],
    stages: [
      {
        id: "c9_s1",
        title: "Cipher Layer 1: The Multiplication Key",
        description: "Terminal prompts: 'Input the product of 12 × 8 to access Layer 2.'",
        question: "What is 12 × 8?",
        targetAnswer: "96",
        options: [
          { text: "88", value: "88", correct: false },
          { text: "94", value: "94", correct: false },
          { text: "96", value: "96", correct: true },
          { text: "108", value: "108", correct: false }
        ],
        explanation: "Layer 1 breached! 12 × 8 = 96. (10 × 8 = 80, plus 2 × 8 = 16. 80 + 16 = 96).",
        hint: "10 × 8 = 80, 2 × 8 = 16. Add them together!"
      },
      {
        id: "c9_s2",
        title: "Cipher Layer 2: Common Multiple of 6 and 8",
        description: "Terminal prompts: 'Input the common multiple of 6 and 8 that lies between 40 and 50.'",
        question: "Which number between 40 and 50 is a multiple of both 6 and 8?",
        targetAnswer: "48",
        options: [
          { text: "42", value: "42", correct: false },
          { text: "44", value: "44", correct: false },
          { text: "48", value: "48", correct: true },
          { text: "54", value: "54", correct: false }
        ],
        explanation: "Layer 2 bypassed! 48 = 6 × 8. It is a multiple of both 6 and 8!",
        hint: "6 × 8 = 48."
      },
      {
        id: "c9_s3",
        title: "Cipher Layer 3: Factor Count of 28",
        description: "Terminal prompts: 'How many total factors does the number 28 have? (List: 1, 2, 4, 7, 14, 28)'",
        question: "How many factors does 28 have in total?",
        targetAnswer: "6",
        options: [
          { text: "4", value: "4", correct: false },
          { text: "5", value: "5", correct: false },
          { text: "6", value: "6", correct: true },
          { text: "8", value: "8", correct: false }
        ],
        explanation: "MASTER CODE CRACKED! The factors of 28 are 1, 2, 4, 7, 14, 28 (exactly 6 factors). The power grid is safe!",
        hint: "Count them: 1, 2, 4, 7, 14, 28. That's 6 factors."
      }
    ]
  },

  // ==========================================
  // CASE 10: THE FINAL INVESTIGATION
  // ==========================================
  {
    id: 10,
    title: "Case 10 – The Final Investigation",
    subtitle: "The Phantom Factor Showdown at City Hall",
    topic: "Full Mastery: Tables, Multiples & Factors",
    sceneName: "cityhall",
    briefing: {
      lore: "The legendary criminal mastermind 'The Phantom Factor' has left a final grand challenge at City Hall. Solve all 4 master challenges to unmask the villain!",
      objective: "Demonstrate complete mastery of multiplication tables, multiples, and factors to earn the title of Master Number Detective.",
      mathConcept: "Mastery of all Room 1 objectives: Tables, Multiples, and Factors."
    },
    hotspots: [
      { id: "h1", x: 250, y: 220, radius: 18, label: "MAYOR'S PODIUM" },
      { id: "h2", x: 420, y: 180, radius: 16, label: "CITY SAFE" },
      { id: "h3", x: 590, y: 220, radius: 18, label: "STATUE BASE" }
    ],
    stages: [
      {
        id: "c10_s1",
        title: "Master Challenge 1: The Product Seal",
        description: "The Phantom's cipher begins: 9 × 8 = ?",
        question: "What is 9 × 8?",
        targetAnswer: "72",
        options: [
          { text: "64", value: "64", correct: false },
          { text: "72", value: "72", correct: true },
          { text: "81", value: "81", correct: false },
          { text: "76", value: "76", correct: false }
        ],
        explanation: "Excellent! 9 × 8 = 72.",
        hint: "9 groups of 8 equals 72."
      },
      {
        id: "c10_s2",
        title: "Master Challenge 2: Multiples Verification",
        description: "Is the number 72 a multiple of 6?",
        question: "Is 72 a multiple of 6?",
        targetAnswer: "Yes",
        options: [
          { text: "Yes (6 × 12 = 72)", value: "Yes", correct: true },
          { text: "No, 72 is not in 6s table", value: "No", correct: false }
        ],
        explanation: "Correct! 72 ÷ 6 = 12 with no remainder, so 72 is definitely a multiple of 6.",
        hint: "6 × 10 = 60, 6 × 11 = 66, 6 × 12 = 72!"
      },
      {
        id: "c10_s3",
        title: "Master Challenge 3: Factor Pairs of 72",
        description: "Which pair of factors for 72 has the smallest difference?",
        question: "Which of these is a factor pair of 72?",
        targetAnswer: "8 and 9",
        options: [
          { text: "8 and 9", value: "8 and 9", correct: true },
          { text: "6 and 11", value: "6 and 11", correct: false },
          { text: "7 and 10", value: "7 and 10", correct: false },
          { text: "5 and 14", value: "5 and 14", correct: false }
        ],
        explanation: "Spot on! 8 × 9 = 72.",
        hint: "8 × 9 = 72."
      },
      {
        id: "c10_s4",
        title: "Master Challenge 4: Common Multiple Intercept",
        description: "The Phantom's escape boat departs at the lowest common multiple of 8 and 12.",
        question: "What is the lowest common multiple of 8 and 12?",
        targetAnswer: "24",
        options: [
          { text: "16", value: "16", correct: false },
          { text: "20", value: "20", correct: false },
          { text: "24", value: "24", correct: true },
          { text: "32", value: "32", correct: false }
        ],
        explanation: "THE PHANTOM FACTOR IS CAPTURED! Multiples of 8: 8, 16, 24... Multiples of 12: 12, 24... The LCM is 24! Congratulations Master Number Detective!",
        hint: "8 × 3 = 24 and 12 × 2 = 24."
      }
    ]
  }
];
