/**
 * Space Mission Control - 10 Mission Levels Data
 * Contains learning objectives, briefings, interactive mechanics data,
 * questions, probability explanations, and feedback for all 10 levels.
 */

window.LEVELS_DATA = [
  // ==========================================
  // LEVEL 1: FIRST CONTACT
  // ==========================================
  {
    id: 1,
    title: "Level 1 – First Contact",
    subtitle: "Mission Control Initiation & Sensor Calibration",
    mode: "level_1",
    radarBlips: [
      { id: "b1", angle: 0.5, dist: 0.7, label: "EARTH", color: "#38bdf8" },
      { id: "b2", angle: 3.2, dist: 0.5, label: "ORBIT-1", color: "#4ade80" }
    ],
    briefing: {
      lore: "Welcome aboard, Commander! You are now in charge of Space Mission Control. Before launching any missions into the cosmos, our flight computers need calibration on the fundamental laws of space likelihood.",
      conceptTitle: "Probability Concept: Impossible vs Certain",
      conceptExplain: "• CERTAIN: An event that is 100% guaranteed to happen under the given conditions.\n• IMPOSSIBLE: An event that has 0% chance and CANNOT happen under the given conditions.",
      instructions: "Inspect each diagnostic readout on your console. Determine whether each event is CERTAIN or IMPOSSIBLE, then calibrate the sensor levers."
    },
    scenarios: [
      {
        id: "l1_s1",
        title: "Sensor Test 1: Acoustic Vacuum Wave",
        description: "Sensor #1 is trying to detect sound waves traveling through empty outer space vacuum between Earth and our station.",
        question: "Can sound waves travel across the empty vacuum of space without any air or matter molecules?",
        gaugeTarget: 0, // 0% = Impossible
        options: [
          { text: "Impossible", value: "impossible", correct: true },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Correct! Sound requires air molecules or physical matter to vibrate. Because the vacuum of outer space has no air, it is IMPOSSIBLE for sound to travel through it."
      },
      {
        id: "l1_s2",
        title: "Sensor Test 2: Gravity Well Pull",
        description: "Our satellite is in low Earth orbit. Earth's immense mass creates a gravitational field extending into space.",
        question: "What is the likelihood that Earth's gravity exerts an attractive pull on the orbiting spacecraft?",
        gaugeTarget: 100, // 100% = Certain
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: true }
        ],
        explanation: "Spot on! Earth's gravitational force is always present and pulls on objects in orbit. It is CERTAIN (100% chance) to pull on the satellite."
      },
      {
        id: "l1_s3",
        title: "Sensor Test 3: Zero-Fuel Thruster Burn",
        description: "Thruster Tank Beta reads exactly 0.0 Liters of chemical propellant remaining (completely empty).",
        question: "What is the likelihood of the thruster igniting and burning rocket fuel when the tank has 0 liters left?",
        gaugeTarget: 0, // Impossible
        options: [
          { text: "Impossible", value: "impossible", correct: true },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Exactly! An engine cannot burn propellant that does not exist. With 0 fuel, firing is IMPOSSIBLE."
      }
    ]
  },

  // ==========================================
  // LEVEL 2: SATELLITE SIGNALS
  // ==========================================
  {
    id: 2,
    title: "Level 2 – Satellite Signals",
    subtitle: "Comms Relay Array Analysis",
    mode: "level_2",
    radarBlips: [
      { id: "sat1", angle: 1.2, dist: 0.6, label: "ECHO-7", color: "#eab308" },
      { id: "sat2", angle: 4.8, dist: 0.8, label: "RELAY-B", color: "#38bdf8" }
    ],
    briefing: {
      lore: "Communication satellite Echo-7 is relaying deep space telemetry to Mission Control. Solar interference is affecting some frequency channels.",
      conceptTitle: "Probability Concept: Likely vs Unlikely",
      conceptExplain: "• LIKELY: An event that has a high chance of occurring (more than half, e.g. 80%).\n• UNLIKELY: An event that has a small chance of occurring (less than half, e.g. 20%).",
      instructions: "Activate the frequency scanner. Count the open (green) vs jammed (red) frequencies to evaluate the likelihood of clear communications."
    },
    scenarios: [
      {
        id: "l2_s1",
        title: "Frequency Band Alpha (5 Channels)",
        visualData: {
          total: 5,
          green: 4,
          red: 1,
          label: "4 Clear Channels, 1 Jammed Channel"
        },
        description: "Band Alpha has 5 communication channels: 4 channels are crystal clear (green), and 1 channel is experiencing static (red).",
        question: "If we tune into a random channel on Band Alpha, what is the likelihood of connecting to a clear channel?",
        gaugeTarget: 80,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: true },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Excellent! 4 out of 5 channels are clear (80%). Because this is a high chance (more than half), connecting to a clear channel is LIKELY."
      },
      {
        id: "l2_s2",
        title: "Frequency Band Beta (10 Channels)",
        visualData: {
          total: 10,
          green: 2,
          red: 8,
          label: "2 Clear Channels, 8 Jammed Channels"
        },
        description: "Band Beta has 10 channels: only 2 channels are open (green), while 8 channels are blocked by space radiation (red).",
        question: "If we select a random channel on Band Beta, what is the likelihood of connecting to a clear channel?",
        gaugeTarget: 20,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: true },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Correct! Only 2 out of 10 channels are open (20%). This is a small chance (less than half), so connecting to a clear channel is UNLIKELY."
      },
      {
        id: "l2_s3",
        title: "Band Beta: Static Interference",
        visualData: {
          total: 10,
          green: 2,
          red: 8,
          label: "2 Clear, 8 Jammed"
        },
        description: "Looking at the same Band Beta (2 clear, 8 jammed channels):",
        question: "What is the likelihood of picking a channel with static interference (jammed)?",
        gaugeTarget: 80,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: true },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Brilliant observation! Since 8 out of 10 channels are jammed, encountering static is LIKELY (80% chance)."
      }
    ]
  },

  // ==========================================
  // LEVEL 3: THE ASTEROID ALERT
  // ==========================================
  {
    id: 3,
    title: "Level 3 – The Asteroid Alert",
    subtitle: "Flight Trajectory Hazard Analysis",
    mode: "level_3",
    radarBlips: [
      { id: "ast1", angle: 0.8, dist: 0.4, label: "AST-01", color: "#ef4444" },
      { id: "ast2", angle: 1.1, dist: 0.6, label: "AST-02", color: "#ef4444" },
      { id: "ast3", angle: 2.5, dist: 0.8, label: "SHIP", color: "#38bdf8" }
    ],
    briefing: {
      lore: "Deep space cargo freighter Orion-9 has encountered the outer edge of the Main Asteroid Belt. The commander must choose a safe flight vector.",
      conceptTitle: "Probability Concept: Comparing Likely & Unlikely Routes",
      conceptExplain: "• High safety ratio (e.g. 9 clear out of 10) means safe passage is LIKELY and collision is UNLIKELY.\n• High hazard ratio (e.g. 8 asteroids out of 10) means collision is LIKELY and safe passage is UNLIKELY.",
      instructions: "Analyze the sector radar scans. Compare the proportion of hazards in Sector Alpha versus Sector Beta to plot the safest course."
    },
    scenarios: [
      {
        id: "l3_s1",
        title: "Sector Alpha Trajectory",
        visualData: {
          total: 10,
          safe: 9,
          danger: 1,
          label: "9 Clear Lanes, 1 Asteroid"
        },
        description: "Sector Alpha has 10 navigation lanes. Long-range radar indicates 9 lanes are completely clear of asteroids, and only 1 lane contains drifting debris.",
        question: "If Orion-9 enters Sector Alpha along a randomly selected lane, safe passage is:",
        gaugeTarget: 90,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: true },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Correct! With 9 out of 10 lanes clear (90%), safe navigation is LIKELY."
      },
      {
        id: "l3_s2",
        title: "Sector Beta Trajectory",
        visualData: {
          total: 10,
          safe: 2,
          danger: 8,
          label: "2 Clear Lanes, 8 Asteroids"
        },
        description: "Sector Beta has 10 navigation lanes: 8 lanes are packed with spinning asteroids, and only 2 lanes are clear.",
        question: "If Orion-9 flies through Sector Beta, encountering an asteroid collision is:",
        gaugeTarget: 80,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: true },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Exactly! 8 out of 10 lanes have asteroids (80%), so collision in Sector Beta is LIKELY."
      },
      {
        id: "l3_s3",
        title: "Route Selection Decision",
        description: "To protect Orion-9's crew and cargo, which flight path should Mission Control authorize?",
        question: "Which route gives the ship the highest likelihood of safe passage?",
        gaugeTarget: 90,
        options: [
          { text: "Sector Alpha (9/10 clear)", value: "alpha", correct: true },
          { text: "Sector Beta (2/10 clear)", value: "beta", correct: false }
        ],
        explanation: "Outstanding command decision! Sector Alpha gives a 90% (Likely) chance of safety, making it the mathematically superior route."
      }
    ]
  },

  // ==========================================
  // LEVEL 4: SOLAR STORM
  // ==========================================
  {
    id: 4,
    title: "Level 4 – Solar Storm",
    subtitle: "Coronal Mass Ejection & Radiation Deflection",
    mode: "level_4",
    radarBlips: [
      { id: "sun", angle: 0.1, dist: 0.9, label: "HELIOS", color: "#f97316" },
      { id: "flare", angle: 0.3, dist: 0.6, label: "CME WAVE", color: "#ef4444" }
    ],
    briefing: {
      lore: "Our star Helios has unleashed an intense Coronal Mass Ejection (CME). A high-energy plasma wave is speeding toward the station.",
      conceptTitle: "Probability Concept: Conditions Change Likelihood",
      conceptExplain: "• The likelihood of an event depends strictly on the physical conditions!\n• Without shields, system overload is CERTAIN (100%).\n• With heavy magnetic deflector shields active, damage becomes UNLIKELY.",
      instructions: "Observe solar radiation meters. Understand how activating protective equipment turns a certain disaster into an unlikely event."
    },
    scenarios: [
      {
        id: "l4_s1",
        title: "Condition A: Magnetic Deflector OFF",
        description: "A class-X solar plasma storm directly strikes the station while the magnetic deflector shields are completely powered down (0% protection).",
        question: "Under these conditions (100% exposure, zero shielding), communication blackout is:",
        gaugeTarget: 100,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: true }
        ],
        explanation: "Correct! Without any shielding against a direct solar storm, radiation overload is CERTAIN (100% guaranteed to disrupt comms)."
      },
      {
        id: "l4_s2",
        title: "Condition B: Heavy Lead Storm Shelter",
        description: "The crew retreats into the reinforced lead storm shelter. The shelter is engineered to block 99.9% of all cosmic ionizing radiation.",
        question: "What is the likelihood that harmful radiation breaches the lead storm shelter?",
        gaugeTarget: 10,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: true },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Well reasoned! With 99.9% protection, radiation breach is UNLIKELY (a very tiny chance)."
      },
      {
        id: "l4_s3",
        title: "Condition C: Space Vacuum Combustion",
        description: "A recruit asks if the heat from the solar flare could cause the empty space vacuum around the station to burst into wood-fire flames.",
        question: "Can empty outer space vacuum catch on fire?",
        gaugeTarget: 0,
        options: [
          { text: "Impossible", value: "impossible", correct: true },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Spot on! Fire requires oxygen and combustible material. Because space vacuum has neither, fire in vacuum is IMPOSSIBLE."
      }
    ]
  },

  // ==========================================
  // LEVEL 5: THE PROBABILITY RADAR
  // ==========================================
  {
    id: 5,
    title: "Level 5 – The Probability Radar",
    subtitle: "Equal Chances & Quantum Beacon Balancing",
    mode: "level_5",
    radarBlips: [
      { id: "nb1", angle: 1.57, dist: 0.6, label: "PULSE-B", color: "#38bdf8" },
      { id: "nb2", angle: 1.80, dist: 0.8, label: "PULSE-B", color: "#38bdf8" },
      { id: "nb3", angle: 2.10, dist: 0.5, label: "PULSE-B", color: "#38bdf8" },
      { id: "nr1", angle: 4.71, dist: 0.6, label: "PULSE-R", color: "#f87171" },
      { id: "nr2", angle: 4.90, dist: 0.8, label: "PULSE-R", color: "#f87171" },
      { id: "nr3", angle: 5.20, dist: 0.5, label: "PULSE-R", color: "#f87171" }
    ],
    briefing: {
      lore: "A deep space navigation buoy is transmitting pulsed quantum beacons across our radar grid. The transceiver needs balance between opposing channels.",
      conceptTitle: "Probability Concept: Equally Likely Outcomes",
      conceptExplain: "• EQUALLY LIKELY: When two or more possible outcomes have the EXACT SAME chance of happening (e.g. 50% vs 50%, 1 out of 2, like a coin flip).",
      instructions: "Operate the 360-degree radar sweep. Compare beacon counts in each sector to identify when outcomes are equally likely."
    },
    scenarios: [
      {
        id: "l5_s1",
        title: "Beacon Array: Blue vs Red Signals",
        visualData: {
          total: 6,
          blue: 3,
          red: 3,
          label: "3 Blue Beacons, 3 Red Beacons"
        },
        description: "The navigation buoy emits 6 signal beacons in total: exactly 3 are Pulsar Blue, and exactly 3 are Pulsar Red.",
        question: "When the radar antenna detects the next random beacon, detecting a Blue signal vs a Red signal is:",
        gaugeTarget: 50,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: true },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Correct! Both Blue (3/6) and Red (3/6) have identical chances (50% each). They are EQUALLY LIKELY."
      },
      {
        id: "l5_s2",
        title: "Dual Docking Clamps",
        visualData: {
          total: 4,
          open: 2,
          locked: 2,
          label: "2 Clamps Open, 2 Clamps Locked"
        },
        description: "Docking Port 4 has 4 automated clamps: 2 clamps are OPEN (ready) and 2 clamps are LOCKED (busy).",
        question: "If a drone approaches a random clamp, landing on an OPEN clamp vs a LOCKED clamp is:",
        gaugeTarget: 50,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: true },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Spot on! 2 out of 4 equals 50%, exactly the same as the remaining 2 out of 4. Both outcomes are EQUALLY LIKELY."
      },
      {
        id: "l5_s3",
        title: "Unequal Beacon Test",
        visualData: {
          total: 6,
          blue: 5,
          red: 1,
          label: "5 Blue Beacons, 1 Red Beacon"
        },
        description: "Suppose we reprogram the buoy so it has 5 Blue beacons and only 1 Red beacon.",
        question: "Are Blue and Red still equally likely?",
        gaugeTarget: 83,
        options: [
          { text: "No, Blue is now LIKELY (5/6)", value: "blue_likely", correct: true },
          { text: "Yes, they are still equally likely", value: "equal", correct: false },
          { text: "No, Red is now CERTAIN", value: "red_certain", correct: false }
        ],
        explanation: "Awesome! Because 5 is much greater than 1, Blue is now LIKELY and Red is UNLIKELY. They are no longer equally likely."
      }
    ]
  },

  // ==========================================
  // LEVEL 6: MOON MISSION
  // ==========================================
  {
    id: 6,
    title: "Level 6 – Moon Mission",
    subtitle: "Lunar Descent & Surface Regolith Assessment",
    mode: "level_6",
    radarBlips: [
      { id: "moon", angle: 2.2, dist: 0.5, label: "LUNA", color: "#cbd5e1" },
      { id: "crater", angle: 2.4, dist: 0.6, label: "OCEANUS", color: "#94a3b8" }
    ],
    briefing: {
      lore: "Lunar Lander 'Artemis III' is entering final descent orbit above the Moon's Crater Oceanus. The landing computer must evaluate 3 potential touchdown zones.",
      conceptTitle: "Probability Concept: Decision Making with Likelihood",
      conceptExplain: "• Smart mission commanders use likelihood to avoid hazards!\n• Choose sites where smooth landing is LIKELY (e.g. 90% smooth regolith).\n• Avoid sites where safe landing is UNLIKELY or IMPOSSIBLE.",
      instructions: "Inspect the LIDAR surface terrain maps for Site Alpha, Site Beta, and Site Gamma. Guide the spacecraft to the safest coordinates."
    },
    scenarios: [
      {
        id: "l6_s1",
        title: "Landing Site Alpha (LIDAR Scan)",
        visualData: {
          total: 10,
          smooth: 9,
          rough: 1,
          label: "9 Smooth Regolith, 1 Boulder"
        },
        description: "LIDAR topographical scan reveals that 9 out of 10 survey squares in Site Alpha are smooth, flat dust plains. Only 1 square contains a boulder.",
        question: "Touching down safely in Site Alpha is:",
        gaugeTarget: 90,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: true },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Correct! With 90% smooth terrain, a safe touchdown in Site Alpha is LIKELY."
      },
      {
        id: "l6_s2",
        title: "Landing Site Gamma (Abyss Chasm)",
        visualData: {
          total: 10,
          smooth: 0,
          rough: 10,
          label: "0 Flat Ground, 10 Deep Chasms"
        },
        description: "Site Gamma is located inside a sheer vertical trench with 100% jagged cliffs and zero flat ground for landing legs.",
        question: "A safe upright landing in Site Gamma is:",
        gaugeTarget: 0,
        options: [
          { text: "Impossible", value: "impossible", correct: true },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Precisely! With 0 flat ground, an upright landing is IMPOSSIBLE (0% chance)."
      },
      {
        id: "l6_s3",
        title: "Commander Landing Command",
        description: "Artemis III has 60 seconds of descent propellant remaining. Which site should Commander authorize for immediate touchdown?",
        question: "Which site gives the crew the highest probability of mission success?",
        gaugeTarget: 90,
        options: [
          { text: "Site Alpha (Likely safe - 9/10)", value: "alpha", correct: true },
          { text: "Site Gamma (Impossible safe - 0/10)", value: "gamma", correct: false }
        ],
        explanation: "Magnificent touchdown! Artemis III landed smoothly on Site Alpha thanks to your solid mathematical decision."
      }
    ]
  },

  // ==========================================
  // LEVEL 7: ALIEN SIGNAL MYSTERY
  // ==========================================
  {
    id: 7,
    title: "Level 7 – Alien Signal Mystery",
    subtitle: "Exoplanet Kepler-186f Spectrogram Investigation",
    mode: "level_7",
    radarBlips: [
      { id: "kep", angle: 3.8, dist: 0.7, label: "KEPLER-186", color: "#e879f9" },
      { id: "sig", angle: 4.1, dist: 0.75, label: "PULSE-X", color: "#f472b6" }
    ],
    briefing: {
      lore: "Our deep space listening dish has intercepted rhythmic radio pulses originating from the Kepler-186 star system. Mission scientists have proposed multiple hypotheses.",
      conceptTitle: "Probability Concept: Scientific Evidence & Hypothesis Likelihood",
      conceptExplain: "• Evidence determines how likely a scientific theory is.\n• Natural stellar phenomena with thousands of known precedents are LIKELY.\n• Explanations that break physical laws are IMPOSSIBLE.",
      instructions: "Tune the audio spectrogram receiver, listen to harmonic signals, and categorize the likelihood of each scientific explanation."
    },
    scenarios: [
      {
        id: "l7_s1",
        title: "Hypothesis A: Fast Rotating Pulsar",
        description: "Astronomical records catalog over 3,000 neutron star pulsars that naturally emit pulses every 1.33 seconds, matching our exact frequency.",
        question: "What is the likelihood that this signal is caused by a spinning natural pulsar?",
        gaugeTarget: 85,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: true },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Correct! With thousands of matching natural precedents, a pulsar explanation is highly LIKELY."
      },
      {
        id: "l7_s2",
        title: "Hypothesis B: Wooden Sailing Galleon",
        description: "A tabloid blog claims the radio pulses are coming from a 17th-century wooden sailing ship sailing through interstellar space.",
        question: "Can an ordinary wooden sailing ship sail through outer space vacuum and emit GHz radio waves?",
        gaugeTarget: 0,
        options: [
          { text: "Impossible", value: "impossible", correct: true },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Spot on! Wood cannot hold atmosphere or sail without wind/water, and wooden ships have no GHz transmitters. This is IMPOSSIBLE."
      },
      {
        id: "l7_s3",
        title: "Hypothesis C: Rare Magnetic Comet",
        description: "Out of 100 known comets in the sector, only 1 possesses a rare magnetic core capable of generating a brief radio chirp.",
        question: "What is the likelihood that a randomly passing comet caused this specific signal?",
        gaugeTarget: 15,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: true },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Great job! A 1-in-100 occurrence (1%) is a very small probability, making it UNLIKELY."
      }
    ]
  },

  // ==========================================
  // LEVEL 8: EMERGENCY PROTOCOL
  // ==========================================
  {
    id: 8,
    title: "Level 8 – Emergency Protocol",
    subtitle: "Rapid Tactical Response Switchboard",
    mode: "level_8",
    radarBlips: [
      { id: "sta", angle: 0.0, dist: 0.1, label: "STATION", color: "#ef4444" },
      { id: "leak", angle: 5.5, dist: 0.3, label: "LEAK-SEC", color: "#f59e0b" }
    ],
    briefing: {
      lore: "ALERT! Space Station Alpha-Centauri's auxiliary power grid has triggered multiple emergency warnings! As Commander, you must make rapid, calculated decisions under pressure.",
      conceptTitle: "Probability Concept: Tactical Decision Making",
      conceptExplain: "• In emergencies, commanders separate CERTAIN threats from UNLIKELY distractions.\n• If a critical safety buffer hits 0, failure is CERTAIN.\n• If redundant systems are 50/50, outcomes are EQUALLY LIKELY.",
      instructions: "Review the station alarm telemetry. Categorize each event's likelihood accurately to override breaker switches and prevent disaster!"
    },
    scenarios: [
      {
        id: "l8_s1",
        title: "Alarm 1: Coolant Line Rupture",
        description: "Secondary reactor coolant reservoir has ruptured and pressure is 0 PSI (100% empty). The reactor core is running at max capacity without cooling.",
        question: "If the reactor is NOT shut down immediately, core thermal overheating is:",
        gaugeTarget: 100,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: true }
        ],
        explanation: "Correct! With zero cooling fluid, laws of thermodynamics make overheating CERTAIN (100% guaranteed)."
      },
      {
        id: "l8_s2",
        title: "Alarm 2: Micro-Debris Fleck",
        description: "A microscopic dust grain (0.1 mm) taps the station's 4-layer reinforced titanium hull shield (99% armor strength).",
        question: "What is the likelihood that this microscopic fleck punctures the 4-layer armor hull?",
        gaugeTarget: 5,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: true },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Right! Heavy quadruple armor stops tiny dust grains effortlessly. A hull breach is UNLIKELY."
      },
      {
        id: "l8_s3",
        title: "Alarm 3: Dual Battery Banks",
        visualData: {
          total: 2,
          bankA: 1,
          bankB: 1,
          label: "Bank A (50%) & Bank B (50%)"
        },
        description: "Emergency power can be routed through Battery Bank Alpha or Battery Bank Beta. Both banks are in identical working condition with equal 50% charge.",
        question: "Selecting Bank A vs Bank B to sustain life support is:",
        gaugeTarget: 50,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: true },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Spot on! Since both banks have identical capacity and status, drawing power from either is EQUALLY LIKELY to succeed."
      }
    ]
  },

  // ==========================================
  // LEVEL 9: DEEP SPACE EXPLORATION
  // ==========================================
  {
    id: 9,
    title: "Level 9 – Deep Space Exploration",
    subtitle: "Voyager-X Multi-System Probability Matrix",
    mode: "level_9",
    radarBlips: [
      { id: "saturn", angle: 1.0, dist: 0.8, label: "SATURN", color: "#f59e0b" },
      { id: "rings", angle: 1.2, dist: 0.85, label: "RINGS", color: "#fbbf24" },
      { id: "probe", angle: 0.8, dist: 0.6, label: "VOYAGER", color: "#38bdf8" }
    ],
    briefing: {
      lore: "Interstellar probe Voyager-X is performing a gravitational slingshot maneuver past the outer gas giants. Multiple complex systems must be balanced.",
      conceptTitle: "Probability Concept: Multi-System Analysis",
      conceptExplain: "• Deep space missions combine multiple probability categories across navigation, power, and trajectory stages.",
      instructions: "Analyze the orbital slingshot corridor, evaluate ring density statistics, and ensure optimal probe longevity."
    },
    scenarios: [
      {
        id: "l9_s1",
        title: "Stage 1: Gravity Slingshot Corridor",
        visualData: {
          total: 10,
          boostCorridors: 8,
          missCorridors: 2,
          label: "8 Optimal Boost Angles, 2 Suboptimal Angles"
        },
        description: "Computer simulations calculate 10 orbital slingshot angles around Saturn: 8 angles provide enough velocity to escape the solar system, while 2 fall short.",
        question: "If we execute a standard entry burn, achieving escape velocity is:",
        gaugeTarget: 80,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: true },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Excellent! 8 out of 10 angles (80%) achieve escape speed, making success LIKELY."
      },
      {
        id: "l9_s2",
        title: "Stage 2: Ring Plane Crossing",
        visualData: {
          total: 100,
          safeGaps: 5,
          denseRings: 95,
          label: "5 Clear Gaps, 95 Boulder Clusters"
        },
        description: "Voyager-X must cross the ring plane. Across 100 mapped sub-sectors, 95 are packed with dense razor-ice rocks, and only 5 are clear gaps (Cassini divisions).",
        question: "Blindly crossing without guidance and missing all ice rocks is:",
        gaugeTarget: 5,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: true },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Accurate! A 5-out-of-100 chance (5%) is very low, making safe blind passage UNLIKELY."
      },
      {
        id: "l9_s3",
        title: "Stage 3: Deep Space Solar Power",
        description: "Past Neptune at 30 Astronomical Units (over 4.5 billion km from the Sun), solar illumination is 900 times weaker than on Earth.",
        question: "What is the likelihood of standard solar panels producing full 100% Earth-level electrical power out here?",
        gaugeTarget: 0,
        options: [
          { text: "Impossible", value: "impossible", correct: true },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Spot on! The inverse-square law of light makes producing full solar power at 30 AU IMPOSSIBLE. That's why deep space probes rely on nuclear RTG batteries!"
      }
    ]
  },

  // ==========================================
  // LEVEL 10: COMMANDER CHALLENGE
  // ==========================================
  {
    id: 10,
    title: "Level 10 – Commander Challenge",
    subtitle: "Fleet Admiral Qualification Trial",
    mode: "level_10",
    radarBlips: [
      { id: "earth", angle: 1.57, dist: 0.8, label: "EARTH", color: "#38bdf8" },
      { id: "entry", angle: 1.57, dist: 0.6, label: "ENTRY CORRIDOR", color: "#4ade80" },
      { id: "ship", angle: 1.57, dist: 0.35, label: "ASTRAEA", color: "#f43f5e" }
    ],
    briefing: {
      lore: "This is it, Commander! The flagship 'Astraea' is returning home to Earth through a high-stakes atmospheric re-entry corridor. You must prove full mastery across ALL 5 likelihood categories!",
      conceptTitle: "Grand Master Assessment: All 5 Likelihood Concepts",
      conceptExplain: "Demonstrate independent mastery of:\n1. Impossible (0%)\n2. Unlikely (Low chance)\n3. Equally Likely (50/50)\n4. Likely (High chance)\n5. Certain (100%)",
      instructions: "Solve all 5 sequential phases correctly to earn the Grand Space Commander Star!"
    },
    scenarios: [
      {
        id: "l10_s1",
        title: "Phase 1: Sensor Calibration (Impossible)",
        description: "External thermometer reads a temperature of minus 500 degrees Celsius (-500°C). Absolute zero in physics is -273.15°C.",
        question: "Is it possible for any object in the universe to reach -500°C?",
        gaugeTarget: 0,
        options: [
          { text: "Impossible", value: "impossible", correct: true },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Masterful! Because temperature cannot drop below absolute zero (-273.15°C), reaching -500°C is IMPOSSIBLE."
      },
      {
        id: "l10_s2",
        title: "Phase 2: Orbital Debris (Unlikely)",
        visualData: {
          total: 20,
          safe: 19,
          debris: 1,
          label: "19 Clear Sectors, 1 Debris Sector"
        },
        description: "In the final orbital ring, 19 out of 20 orbital sectors are totally clear of space debris, with only 1 sector containing debris.",
        question: "What is the likelihood of entering a sector that contains space debris?",
        gaugeTarget: 5,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: true },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Correct! Only 1 in 20 (5%) chance means encountering debris is UNLIKELY."
      },
      {
        id: "l10_s3",
        title: "Phase 3: Quantum Jump Coils (Equally Likely)",
        visualData: {
          total: 2,
          coilA: 1,
          coilB: 1,
          label: "Coil A (50%) & Coil B (50%)"
        },
        description: "Two synchronized steering thrusters, Port and Starboard, both have equal thrust vectors and identical calibration.",
        question: "Selecting Port vs Starboard for the initial course alignment burn is:",
        gaugeTarget: 50,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: true },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Brilliant! Equal parameters make both options EQUALLY LIKELY to deliver equal performance."
      },
      {
        id: "l10_s4",
        title: "Phase 4: Atmospheric Entry Angle (Likely)",
        visualData: {
          total: 10,
          safeAngles: 8,
          steepAngles: 2,
          label: "8 Safe Entry Angles, 2 Steep Angles"
        },
        description: "Out of 10 calculated atmospheric re-entry angles, 8 angles dissipate heat safely across the thermal shield, while 2 angles are too steep.",
        question: "Entering along a safe thermal dissipation corridor is:",
        gaugeTarget: 80,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: true },
          { text: "Certain", value: "certain", correct: false }
        ],
        explanation: "Outstanding! 8 out of 10 safe corridors (80%) means a safe re-entry angle is LIKELY."
      },
      {
        id: "l10_s5",
        title: "Phase 5: Automated Parachute Locks (Certain)",
        description: "At 3,000 meters altitude, Earth's atmosphere reaches 101 kPa barometric pressure. The triple-redundant mechanical barometric parachute latch activates automatically upon reaching this pressure, backed by manual and explosive backup pins.",
        question: "Under these verified barometric atmospheric conditions, the parachute deployment is:",
        gaugeTarget: 100,
        options: [
          { text: "Impossible", value: "impossible", correct: false },
          { text: "Unlikely", value: "unlikely", correct: false },
          { text: "Equally likely", value: "equally_likely", correct: false },
          { text: "Likely", value: "likely", correct: false },
          { text: "Certain", value: "certain", correct: true }
        ],
        explanation: "TOUCHDOWN! With triple redundant automated physical locks engaged at target atmospheric pressure, parachute deployment is CERTAIN (100%). Congratulations, Grand Commander!"
      }
    ]
  }
];
