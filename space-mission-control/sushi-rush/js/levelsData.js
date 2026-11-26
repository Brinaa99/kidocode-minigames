/**
 * Sushi Rush - 10 Levels Data & Recipes
 * Defines customer orders, multiplication concepts, equal groups,
 * repeated addition representations, and reward structures.
 */

window.SUSHI_LEVELS = [
  // ==========================================
  // LEVEL 1: FIRST DAY AT THE SUSHI BAR
  // ==========================================
  {
    id: 1,
    title: "Level 1 – First Day at the Sushi Bar",
    subtitle: "Introduction to Equal Groups & Multiplication",
    tablesPracticed: "Intro to Groups (2 & 3)",
    conceptExplain: "Multiplication is a fast way of doing repeated addition with EQUAL GROUPS!\n• If you have 2 plates, and each plate has 3 sushi pieces: 3 + 3 = 6 pieces.\n• In multiplication, we write: 2 plates × 3 pieces = 6 total pieces!",
    targetEarnings: 150,
    orders: [
      {
        id: "l1_o1",
        customerName: "Kenji",
        customerType: 0, // School kid
        sushiType: "salmon",
        sushiName: "Salmon Nigiri",
        icon: "🍣",
        plates: 2,
        piecesPerPlate: 2,
        total: 4,
        dialogue: "Hi Chef! I'd like 2 plates of Salmon Nigiri, please. Put 2 pieces on each plate!",
        repeatedAddition: "2 + 2 = 4",
        hint: "2 plates with 2 pieces each. 2 × 2 = 4 pieces!"
      },
      {
        id: "l1_o2",
        customerName: "Aoi",
        customerType: 0,
        sushiType: "avocado",
        sushiName: "Avocado Roll",
        icon: "🥑",
        plates: 2,
        piecesPerPlate: 3,
        total: 6,
        dialogue: "Can I have 2 plates of fresh Avocado Rolls? With 3 pieces on each plate!",
        repeatedAddition: "3 + 3 = 6",
        hint: "2 plates with 3 pieces each. 3 + 3 = 6. In multiplication: 2 × 3 = 6!"
      },
      {
        id: "l1_o3",
        customerName: "Taro",
        customerType: 1, // Office worker
        sushiType: "tuna",
        sushiName: "Tuna Maki",
        icon: "🍱",
        plates: 3,
        piecesPerPlate: 2,
        total: 6,
        dialogue: "Quick snack please: 3 plates of Tuna Maki, with 2 pieces on each plate!",
        repeatedAddition: "2 + 2 + 2 = 6",
        hint: "3 plates with 2 pieces each. 2 + 2 + 2 = 6. In multiplication: 3 × 2 = 6!"
      }
    ]
  },

  // ==========================================
  // LEVEL 2: THE LUNCH RUSH
  // ==========================================
  {
    id: 2,
    title: "Level 2 – The Lunch Rush",
    subtitle: "Multiplication Tables of 2 and 3",
    tablesPracticed: "×2 and ×3 Tables",
    conceptExplain: "The lunch crowd has arrived! Practice multiplying by 2 and 3:\n• 2 × 4 = 8 (two groups of 4)\n• 3 × 3 = 9 (three groups of 3)\n• 3 × 5 = 15 (three groups of 5)",
    targetEarnings: 220,
    orders: [
      {
        id: "l2_o1",
        customerName: "Mr. Sato",
        customerType: 1,
        sushiType: "salmon",
        sushiName: "Salmon Nigiri",
        icon: "🍣",
        plates: 2,
        piecesPerPlate: 4,
        total: 8,
        dialogue: "Lunch order: 2 plates of Salmon, each plate needs 4 pieces!",
        repeatedAddition: "4 + 4 = 8",
        hint: "2 plates × 4 pieces = 8 pieces."
      },
      {
        id: "l2_o2",
        customerName: "Hana",
        customerType: 2, // Grandma
        sushiType: "tamago",
        sushiName: "Sweet Egg Tamago",
        icon: "🍳",
        plates: 3,
        piecesPerPlate: 3,
        total: 9,
        dialogue: "Hello dear, could I order 3 plates of Tamago with 3 pieces per plate?",
        repeatedAddition: "3 + 3 + 3 = 9",
        hint: "3 plates × 3 pieces = 9 pieces."
      },
      {
        id: "l2_o3",
        customerName: "Daiki",
        customerType: 0,
        sushiType: "cucumber",
        sushiName: "Cucumber Roll",
        icon: "🥒",
        plates: 3,
        piecesPerPlate: 5,
        total: 15,
        dialogue: "I'm super hungry! 3 plates of Cucumber Rolls, 5 pieces on each plate!",
        repeatedAddition: "5 + 5 + 5 = 15",
        hint: "3 plates × 5 pieces = 15 pieces."
      },
      {
        id: "l2_o4",
        customerName: "Chef Ryu",
        customerType: 3, // Gourmet
        sushiType: "shrimp",
        sushiName: "Ebi Sweet Shrimp",
        icon: "🍤",
        plates: 2,
        piecesPerPlate: 6,
        total: 12,
        dialogue: "Let me taste your Ebi Shrimp: 2 plates, 6 pieces each!",
        repeatedAddition: "6 + 6 = 12",
        hint: "2 plates × 6 pieces = 12 pieces."
      }
    ]
  },

  // ==========================================
  // LEVEL 3: SALMON SPECIAL
  // ==========================================
  {
    id: 3,
    title: "Level 3 – Salmon Special",
    subtitle: "Multiplication Tables of 4 and 5",
    tablesPracticed: "×4 and ×5 Tables",
    conceptExplain: "Our fresh Norwegian salmon has arrived! Multiply by 4 and 5:\n• 4 × 3 = 12\n• 5 × 2 = 10\n• 4 × 4 = 16\n• 5 × 4 = 20",
    targetEarnings: 280,
    orders: [
      {
        id: "l3_o1",
        customerName: "Yuki",
        customerType: 0,
        sushiType: "salmon",
        sushiName: "Salmon Nigiri",
        icon: "🍣",
        plates: 4,
        piecesPerPlate: 3,
        total: 12,
        dialogue: "Salmon party! 4 plates with 3 pieces of Salmon on every plate!",
        repeatedAddition: "3 + 3 + 3 + 3 = 12",
        hint: "4 plates × 3 pieces = 12 pieces."
      },
      {
        id: "l3_o2",
        customerName: "Shin",
        customerType: 1,
        sushiType: "avocado",
        sushiName: "California Roll",
        icon: "🥑",
        plates: 5,
        piecesPerPlate: 2,
        total: 10,
        dialogue: "5 plates of California Roll, with 2 pieces on each plate, please!",
        repeatedAddition: "2 + 2 + 2 + 2 + 2 = 10",
        hint: "5 plates × 2 pieces = 10 pieces."
      },
      {
        id: "l3_o3",
        customerName: "Mei",
        customerType: 2,
        sushiType: "tuna",
        sushiName: "Spicy Tuna Roll",
        icon: "🍱",
        plates: 4,
        piecesPerPlate: 4,
        total: 16,
        dialogue: "Spicy Tuna for our table: 4 plates, exactly 4 pieces each!",
        repeatedAddition: "4 + 4 + 4 + 4 = 16",
        hint: "4 plates × 4 pieces = 16 pieces."
      },
      {
        id: "l3_o4",
        customerName: "Critic Ren",
        customerType: 3,
        sushiType: "salmon",
        sushiName: "Salmon Sashimi Platter",
        icon: "🍣",
        plates: 5,
        piecesPerPlate: 4,
        total: 20,
        dialogue: "5 platters of your finest Salmon, with 4 pieces per platter!",
        repeatedAddition: "4 + 4 + 4 + 4 + 4 = 20",
        hint: "5 plates × 4 pieces = 20 pieces."
      }
    ]
  },

  // ==========================================
  // LEVEL 4: CONVEYOR BELT CHALLENGE
  // ==========================================
  {
    id: 4,
    title: "Level 4 – Conveyor Belt Challenge",
    subtitle: "Multiplication Tables of 6",
    tablesPracticed: "×6 Table",
    conceptExplain: "The Kaitenzushi conveyor belt is speeding up! Master the 6 times table:\n• 2 × 6 = 12\n• 3 × 6 = 18\n• 4 × 6 = 24\n• 5 × 6 = 30",
    targetEarnings: 320,
    orders: [
      {
        id: "l4_o1",
        customerName: "Kaito",
        customerType: 0,
        sushiType: "shrimp",
        sushiName: "Dragon Roll",
        icon: "🍤",
        plates: 2,
        piecesPerPlate: 6,
        total: 12,
        dialogue: "Conveyor order: 2 plates of Dragon Rolls with 6 pieces each!",
        repeatedAddition: "6 + 6 = 12",
        hint: "2 plates × 6 pieces = 12 pieces."
      },
      {
        id: "l4_o2",
        customerName: "Emi",
        customerType: 1,
        sushiType: "salmon",
        sushiName: "Rainbow Salmon Roll",
        icon: "🍣",
        plates: 3,
        piecesPerPlate: 6,
        total: 18,
        dialogue: "Send 3 plates on the belt, each with 6 pieces of Rainbow Roll!",
        repeatedAddition: "6 + 6 + 6 = 18",
        hint: "3 plates × 6 pieces = 18 pieces."
      },
      {
        id: "l4_o3",
        customerName: "Obasan Yoko",
        customerType: 2,
        sushiType: "tuna",
        sushiName: "Tuna Deluxe Maki",
        icon: "🍱",
        plates: 4,
        piecesPerPlate: 6,
        total: 24,
        dialogue: "4 plates please, with 6 delicious pieces on every plate!",
        repeatedAddition: "6 + 6 + 6 + 6 = 24",
        hint: "4 plates × 6 pieces = 24 pieces."
      },
      {
        id: "l4_o4",
        customerName: "Chef Takashi",
        customerType: 3,
        sushiType: "tamago",
        sushiName: "Golden Tamago Special",
        icon: "🍳",
        plates: 5,
        piecesPerPlate: 6,
        total: 30,
        dialogue: "Grand catering belt order: 5 plates, 6 pieces each!",
        repeatedAddition: "6 + 6 + 6 + 6 + 6 = 30",
        hint: "5 plates × 6 pieces = 30 pieces."
      }
    ]
  },

  // ==========================================
  // LEVEL 5: THE FAMILY FEAST
  // ==========================================
  {
    id: 5,
    title: "Level 5 – The Family Feast",
    subtitle: "Multiplication Tables of 7 and 8",
    tablesPracticed: "×7 and ×8 Tables",
    conceptExplain: "Large families have reserved the dining tatami rooms! Multiply by 7 and 8:\n• 2 × 7 = 14 | 3 × 7 = 21\n• 2 × 8 = 16 | 3 × 8 = 24 | 4 × 8 = 32",
    targetEarnings: 380,
    orders: [
      {
        id: "l5_o1",
        customerName: "Yamamoto Family",
        customerType: 2,
        sushiType: "salmon",
        sushiName: "Salmon Feast Platter",
        icon: "🍣",
        plates: 2,
        piecesPerPlate: 7,
        total: 14,
        dialogue: "Family table 1: 2 large platters, 7 pieces of Salmon on each!",
        repeatedAddition: "7 + 7 = 14",
        hint: "2 platters × 7 pieces = 14 pieces."
      },
      {
        id: "l5_o2",
        customerName: "Tanaka Family",
        customerType: 0,
        sushiType: "tuna",
        sushiName: "Tuna Trio Platter",
        icon: "🍱",
        plates: 3,
        piecesPerPlate: 7,
        total: 21,
        dialogue: "We have 3 kids! 3 platters with 7 pieces on each platter!",
        repeatedAddition: "7 + 7 + 7 = 21",
        hint: "3 platters × 7 pieces = 21 pieces."
      },
      {
        id: "l5_o3",
        customerName: "Suzuki Family",
        customerType: 1,
        sushiType: "shrimp",
        sushiName: "Crispy Ebi Platter",
        icon: "🍤",
        plates: 3,
        piecesPerPlate: 8,
        total: 24,
        dialogue: "For our celebration: 3 platters, with 8 pieces of Ebi on each!",
        repeatedAddition: "8 + 8 + 8 = 24",
        hint: "3 platters × 8 pieces = 24 pieces."
      },
      {
        id: "l5_o4",
        customerName: "Saito Family",
        customerType: 3,
        sushiType: "avocado",
        sushiName: "Grand Family Combo",
        icon: "🥑",
        plates: 4,
        piecesPerPlate: 8,
        total: 32,
        dialogue: "Grand family order: 4 platters, exactly 8 pieces on each platter!",
        repeatedAddition: "8 + 8 + 8 + 8 = 32",
        hint: "4 platters × 8 pieces = 32 pieces."
      }
    ]
  },

  // ==========================================
  // LEVEL 6: PARTY CATERING
  // ==========================================
  {
    id: 6,
    title: "Level 6 – Party Catering",
    subtitle: "Multiplication Tables of 9 and 10",
    tablesPracticed: "×9 and ×10 Tables",
    conceptExplain: "Corporate catering order! Notice the cool trick with 9 and 10:\n• Multiplying by 10 is easy: just add a 0! (3 × 10 = 30, 5 × 10 = 50)\n• For 9: 2 × 9 = 18, 3 × 9 = 27, 4 × 9 = 36!",
    targetEarnings: 450,
    orders: [
      {
        id: "l6_o1",
        customerName: "Studio Group",
        customerType: 1,
        sushiType: "salmon",
        sushiName: "Salmon Party Box",
        icon: "🍣",
        plates: 2,
        piecesPerPlate: 9,
        total: 18,
        dialogue: "Catering box 1: 2 party trays, with 9 pieces on each tray!",
        repeatedAddition: "9 + 9 = 18",
        hint: "2 trays × 9 pieces = 18 pieces."
      },
      {
        id: "l6_o2",
        customerName: "Gaming Club",
        customerType: 0,
        sushiType: "tuna",
        sushiName: "Tuna Party Box",
        icon: "🍱",
        plates: 3,
        piecesPerPlate: 9,
        total: 27,
        dialogue: "Tournament snacks! 3 trays, 9 pieces on each tray!",
        repeatedAddition: "9 + 9 + 9 = 27",
        hint: "3 trays × 9 pieces = 27 pieces."
      },
      {
        id: "l6_o3",
        customerName: "Tech Corp",
        customerType: 1,
        sushiType: "tamago",
        sushiName: "Office Deca-Box",
        icon: "🍳",
        plates: 3,
        piecesPerPlate: 10,
        total: 30,
        dialogue: "Office meeting: 3 big trays with 10 pieces on each tray!",
        repeatedAddition: "10 + 10 + 10 = 30",
        hint: "3 trays × 10 pieces = 30 pieces."
      },
      {
        id: "l6_o4",
        customerName: "Festival Committee",
        customerType: 3,
        sushiType: "shrimp",
        sushiName: "Golden Shrimp Mega-Tray",
        icon: "🍤",
        plates: 5,
        piecesPerPlate: 10,
        total: 50,
        dialogue: "Mega festival catering: 5 trays with 10 pieces on every tray!",
        repeatedAddition: "10 + 10 + 10 + 10 + 10 = 50",
        hint: "5 trays × 10 pieces = 50 pieces."
      }
    ]
  },

  // ==========================================
  // LEVEL 7: THE SPECIAL MENU
  // ==========================================
  {
    id: 7,
    title: "Level 7 – The Special Menu",
    subtitle: "Mixed Multiplication Tables",
    tablesPracticed: "Mixed Tables (4, 5, 6, 7)",
    conceptExplain: "The Chef's Special Menu mixes different tables! Keep your multiplication sharp:\n• 4 × 7 = 28\n• 6 × 5 = 30\n• 7 × 4 = 28\n• 8 × 5 = 40",
    targetEarnings: 520,
    orders: [
      {
        id: "l7_o1",
        customerName: "Madam Chiyo",
        customerType: 2,
        sushiType: "salmon",
        sushiName: "Royal Salmon",
        icon: "🍣",
        plates: 4,
        piecesPerPlate: 7,
        total: 28,
        dialogue: "Special menu order: 4 plates of Royal Salmon, 7 pieces per plate!",
        repeatedAddition: "7 + 7 + 7 + 7 = 28",
        hint: "4 plates × 7 pieces = 28 pieces."
      },
      {
        id: "l7_o2",
        customerName: "Director Hiro",
        customerType: 1,
        sushiType: "cucumber",
        sushiName: "Crisp Green Rolls",
        icon: "🥒",
        plates: 6,
        piecesPerPlate: 5,
        total: 30,
        dialogue: "Health special: 6 plates with 5 pieces on each plate!",
        repeatedAddition: "5 × 6 = 30",
        hint: "6 plates × 5 pieces = 30 pieces."
      },
      {
        id: "l7_o3",
        customerName: "Akira",
        customerType: 0,
        sushiType: "shrimp",
        sushiName: "Crispy Prawn Rolls",
        icon: "🍤",
        plates: 7,
        piecesPerPlate: 4,
        total: 28,
        dialogue: "I'd love 7 plates with 4 pieces of Prawn Roll on each!",
        repeatedAddition: "4 × 7 = 28",
        hint: "7 plates × 4 pieces = 28 pieces. (Notice that 7 × 4 is the same as 4 × 7!)"
      },
      {
        id: "l7_o4",
        customerName: "Master Jiro",
        customerType: 3,
        sushiType: "tuna",
        sushiName: "Imperial Red Tuna",
        icon: "🍱",
        plates: 8,
        piecesPerPlate: 5,
        total: 40,
        dialogue: "Imperial feast: 8 plates, each with 5 pieces of Red Tuna!",
        repeatedAddition: "5 × 8 = 40",
        hint: "8 plates × 5 pieces = 40 pieces."
      }
    ]
  },

  // ==========================================
  // LEVEL 8: THE BUSY RESTAURANT
  // ==========================================
  {
    id: 8,
    title: "Level 8 – The Busy Restaurant",
    subtitle: "Multiplication in Real-Life Restaurant Situations",
    tablesPracticed: "Tables 6, 7, 8, 9",
    conceptExplain: "Full house! Every table is booked. Apply multiplication to keep all guests satisfied:\n• 6 × 6 = 36\n• 7 × 6 = 42\n• 8 × 6 = 48\n• 9 × 5 = 45",
    targetEarnings: 600,
    orders: [
      {
        id: "l8_o1",
        customerName: "Table 4 Guests",
        customerType: 1,
        sushiType: "salmon",
        sushiName: "Salmon Square",
        icon: "🍣",
        plates: 6,
        piecesPerPlate: 6,
        total: 36,
        dialogue: "We have 6 guests! 6 plates with 6 pieces of Salmon each!",
        repeatedAddition: "6 × 6 = 36",
        hint: "6 plates × 6 pieces = 36 pieces."
      },
      {
        id: "l8_o2",
        customerName: "Table 7 Guests",
        customerType: 2,
        sushiType: "tamago",
        sushiName: "Tamago Supreme",
        icon: "🍳",
        plates: 7,
        piecesPerPlate: 6,
        total: 42,
        dialogue: "Table 7: 7 plates with 6 pieces of Tamago on each plate!",
        repeatedAddition: "6 × 7 = 42",
        hint: "7 plates × 6 pieces = 42 pieces."
      },
      {
        id: "l8_o3",
        customerName: "Table 8 Guests",
        customerType: 0,
        sushiType: "avocado",
        sushiName: "Avocado Crunch",
        icon: "🥑",
        plates: 8,
        piecesPerPlate: 6,
        total: 48,
        dialogue: "Birthday table: 8 plates with 6 pieces of Avocado Crunch each!",
        repeatedAddition: "6 × 8 = 48",
        hint: "8 plates × 6 pieces = 48 pieces."
      },
      {
        id: "l8_o4",
        customerName: "VIP Table",
        customerType: 3,
        sushiType: "shrimp",
        sushiName: "Golden Dragon Platter",
        icon: "🍤",
        plates: 9,
        piecesPerPlate: 5,
        total: 45,
        dialogue: "VIP order: 9 plates with 5 pieces of Golden Dragon each!",
        repeatedAddition: "5 × 9 = 45",
        hint: "9 plates × 5 pieces = 45 pieces."
      }
    ]
  },

  // ==========================================
  // LEVEL 9: SUSHI MASTER CHALLENGE
  // ==========================================
  {
    id: 9,
    title: "Level 9 – Sushi Master Challenge",
    subtitle: "High-Value Multi-Step Combinations",
    tablesPracticed: "Tables 7, 8, 9",
    conceptExplain: "The highest culinary test! Master the toughest times tables:\n• 6 × 7 = 42\n• 7 × 8 = 56\n• 8 × 8 = 64\n• 9 × 8 = 72\n• 9 × 9 = 81",
    targetEarnings: 720,
    orders: [
      {
        id: "l9_o1",
        customerName: "Critic Masaharu",
        customerType: 3,
        sushiType: "salmon",
        sushiName: "Imperial Salmon",
        icon: "🍣",
        plates: 6,
        piecesPerPlate: 7,
        total: 42,
        dialogue: "First test: 6 plates with 7 pieces of Imperial Salmon each!",
        repeatedAddition: "7 × 6 = 42",
        hint: "6 plates × 7 pieces = 42 pieces."
      },
      {
        id: "l9_o2",
        customerName: "Ambassador Sato",
        customerType: 1,
        sushiType: "tuna",
        sushiName: "Bluefin Toro",
        icon: "🍱",
        plates: 7,
        piecesPerPlate: 8,
        total: 56,
        dialogue: "Diplomatic dinner: 7 plates with 8 pieces of Toro each!",
        repeatedAddition: "8 × 7 = 56",
        hint: "7 plates × 8 pieces = 56 pieces."
      },
      {
        id: "l9_o3",
        customerName: "Master Kanda",
        customerType: 3,
        sushiType: "shrimp",
        sushiName: "Ebi Tempura Rolls",
        icon: "🍤",
        plates: 8,
        piecesPerPlate: 8,
        total: 64,
        dialogue: "Eight-by-eight square perfection: 8 plates, 8 pieces each!",
        repeatedAddition: "8 × 8 = 64",
        hint: "8 plates × 8 pieces = 64 pieces."
      },
      {
        id: "l9_o4",
        customerName: "Grand Chef Nobu",
        customerType: 3,
        sushiType: "tamago",
        sushiName: "Emperor's Tamago",
        icon: "🍳",
        plates: 9,
        piecesPerPlate: 9,
        total: 81,
        dialogue: "The ultimate square: 9 plates with 9 pieces on each plate!",
        repeatedAddition: "9 × 9 = 81",
        hint: "9 plates × 9 pieces = 81 pieces."
      }
    ]
  },

  // ==========================================
  // LEVEL 10: GRAND OPENING FESTIVAL
  // ==========================================
  {
    id: 10,
    title: "Level 10 – Grand Opening Festival",
    subtitle: "Complete Multiplication Mastery",
    tablesPracticed: "Full Mastery (Tables 2–10)",
    conceptExplain: "The Grand Annual Sushi Festival is underway! You are on the verge of earning the legendary title of GRAND SUSHI MASTER 🌟\nComplete all festival orders to win the Golden Trophy!",
    targetEarnings: 880,
    orders: [
      {
        id: "l10_o1",
        customerName: "Festival Parade Leader",
        customerType: 0,
        sushiType: "salmon",
        sushiName: "Matsuri Salmon Deluxe",
        icon: "🍣",
        plates: 7,
        piecesPerPlate: 7,
        total: 49,
        dialogue: "Festival kickoff: 7 platters with 7 pieces of Matsuri Salmon each!",
        repeatedAddition: "7 × 7 = 49",
        hint: "7 platters × 7 pieces = 49 pieces."
      },
      {
        id: "l10_o2",
        customerName: "City Mayor",
        customerType: 1,
        sushiType: "tuna",
        sushiName: "Mayor's Toro Special",
        icon: "🍱",
        plates: 8,
        piecesPerPlate: 7,
        total: 56,
        dialogue: "For City Hall's banquet: 8 platters with 7 pieces on each platter!",
        repeatedAddition: "7 × 8 = 56",
        hint: "8 platters × 7 pieces = 56 pieces."
      },
      {
        id: "l10_o3",
        customerName: "Taiko Drum Troupe",
        customerType: 2,
        sushiType: "shrimp",
        sushiName: "Drummer's Ebi Maki",
        icon: "🍤",
        plates: 8,
        piecesPerPlate: 9,
        total: 72,
        dialogue: "Drumming makes us hungry! 8 platters with 9 pieces each!",
        repeatedAddition: "9 × 8 = 72",
        hint: "8 platters × 9 pieces = 72 pieces."
      },
      {
        id: "l10_o4",
        customerName: "Festival Fireworks Crew",
        customerType: 0,
        sushiType: "avocado",
        sushiName: "Sparkler Avocado Roll",
        icon: "🥑",
        plates: 9,
        piecesPerPlate: 6,
        total: 54,
        dialogue: "Fireworks team fuel: 9 platters with 6 pieces each!",
        repeatedAddition: "6 × 9 = 54",
        hint: "9 platters × 6 pieces = 54 pieces."
      },
      {
        id: "l10_o5",
        customerName: "Culinary Guild Master",
        customerType: 3,
        sushiType: "salmon",
        sushiName: "Centennial Gold Sashimi",
        icon: "🍣",
        plates: 10,
        piecesPerPlate: 10,
        total: 100,
        dialogue: "The Grand Finale of the Century: 10 giant platters with 10 pieces on each!",
        repeatedAddition: "10 × 10 = 100",
        hint: "10 platters × 10 pieces = 100 pieces! The century mark!"
      }
    ]
  }
];
