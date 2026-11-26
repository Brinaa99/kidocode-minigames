# SPACE MISSION CONTROL 🚀
**Educational Math Game: Probability – Likelihood**

An interactive retro pixel-art space simulation game created for primary school students, teaching the core mathematical concepts of Probability and Likelihood through authentic mission control operations.

---

## 🎮 Game Concept & Lore

The player assumes the role of **Commander of the Space Mission Control Centre**. Their responsibility is to monitor space conditions, inspect radar systems, analyse satellite frequencies, evaluate orbital trajectories, and make critical tactical decisions to guide space exploration missions.

Throughout the 10 missions, players learn and master the five likelihood categories:
1. **Impossible:** An event that cannot happen under given conditions (0% chance).
2. **Unlikely:** An event with a small chance of happening (less than half).
3. **Equally likely:** Two or more outcomes with the exact same chance (50/50).
4. **Likely:** An event with a high chance of happening (more than half).
5. **Certain:** An event that will definitely happen under given conditions (100% chance).

---

## 🪐 10 Mission Levels

1. **Level 1 – First Contact:** Mission Control initiation & calibration. Guided tutorial identifying Impossible (sound in vacuum, 0 fuel burn) and Certain events (gravity well, zero solar generation in eclipse).
2. **Level 2 – Satellite Signals:** Communication satellite Echo-7 telemetry. Analyzing frequency channel ratios to distinguish between Likely (4/5 clear) and Unlikely (2/10 clear) transmissions.
3. **Level 3 – The Asteroid Alert:** Cargo ship Orion-9 navigation through asteroid belt. Comparing clear vs hazard ratios across Sector Alpha (9/10 clear = Likely safe) and Sector Beta (8/10 debris = Likely collision).
4. **Level 4 – Solar Storm:** Coronal Mass Ejection from star Helios. Understanding how physical conditions dictate likelihood: system blackout is Certain without deflector shields, while damage is Unlikely inside a reinforced lead shelter.
5. **Level 5 – The Probability Radar:** Quantum navigation buoy. Operating a 360-degree radar sweep to compare balanced outcomes (3 Blue vs 3 Red beacons = Equally Likely).
6. **Level 6 – Moon Mission:** Lunar lander "Artemis III" descent into Crater Oceanus. Analyzing LIDAR topographical regolith scans to select the safest touchdown site.
7. **Level 7 – Alien Signal Mystery:** Listening dish intercepting radio signals from Exoplanet Kepler-186f. Scientific hypothesis evaluation comparing natural pulsars (Likely) vs impossible folklore (Impossible).
8. **Level 8 – Emergency Protocol:** Rapid response tactical switchboard aboard Space Station Alpha-Centauri. Managing coolant rupture (Certain overheat without shutdown) and battery banks (Equally Likely).
9. **Level 9 – Deep Space Exploration:** Interstellar probe Voyager-X multi-stage voyage past Saturn's rings and Jupiter's gravitational slingshot.
10. **Level 10 – Commander Challenge:** Grand fleet re-entry trial combining all five likelihood categories in a 5-phase sequential challenge for the Grand Fleet Admiral medal.

---

## 🛠️ Technical Architecture

- **Visuals:** Retro pixel-art style with HTML5 Canvas animations for multi-layered starfields, nebulae, planets, satellites, lunar terrain, and rotating 360° radar sweeps.
- **Audio:** Web Audio API synthesizer generates all retro 8-bit / 16-bit sound effects (radar pings, button clicks, alarm sirens, rocket thrusters, victory fanfares) with zero external audio dependencies.
- **State Management:** Persistent `localStorage` tracking unlocked levels, star ratings (1-3 stars), and highest scores.
- **Responsive Design:** Optimized for desktop full-screen, tablet, and mobile browsers.

---

## 🚀 How to Run

### Option 1: Direct File Opening
Double-click `index.html` or open it directly in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Web Server
Run with Python:
```bash
python -m http.server 3000
```
Or with Node.js:
```bash
npx serve -l 3000 .
```
Then open `http://localhost:3000` in your browser.
