# SUSHI RUSH 🍣
**Educational Math Game: Multiplication, Multiples and Factors // Room 2: Multiplication**

An interactive retro 16-bit Japanese cooking simulation and restaurant management game designed for primary school students to master multiplication and equal groups through hands-on sushi preparation.

---

## 🍱 Game Concept & Lore

The player runs a bustling Japanese sushi restaurant. Customers arrive, take their seats, and place sushi orders consisting of equal groups of plates and pieces:
- Customer: *"I'd like 3 plates of Tuna Maki, with 4 pieces on each plate!"*
- Mathematical formula: `3 plates × 4 pieces = 12 total pieces`.
- Visual repeated addition: `4 + 4 + 4 = 12`.

Players select fresh ingredients, roll sushi on a bamboo mat (Makisu), cut the rolls, arrange the pieces into equal groups on plates, and serve the order to delight customers, earning restaurant coins, tips, and customer satisfaction stars.

---

## 🥢 10 Restaurant Levels

1. **Level 1 – First Day at the Sushi Bar:** Introduction to equal groups & multiplication basics (2 and 3 pieces).
2. **Level 2 – The Lunch Rush:** Multiplication tables of 2 and 3 (2×4, 3×3, 3×5, 2×6).
3. **Level 3 – Salmon Special:** Multiplication tables of 4 and 5 (4×3, 5×2, 4×4, 5×4).
4. **Level 4 – Conveyor Belt Challenge:** Multiplication tables of 6 (2×6, 3×6, 4×6, 5×6) on moving kaitenzushi belts.
5. **Level 5 – The Family Feast:** Multiplication tables of 7 and 8 (2×7, 3×7, 3×8, 4×8) for large family platters.
6. **Level 6 – Party Catering:** Multiplication tables of 9 and 10 (2×9, 3×9, 3×10, 5×10).
7. **Level 7 – The Special Menu:** Mixed multiplication tables (4×7, 6×5, 7×4, 8×5).
8. **Level 8 – The Busy Restaurant:** Real-life multiplication scenarios (6×6, 7×6, 8×6, 9×5).
9. **Level 9 – Sushi Master Challenge:** Multi-step multiplication and high-value orders (6×7, 7×8, 8×8, 9×9).
10. **Level 10 – Grand Opening Festival:** Complete multiplication mastery (tables 2 through 10) up to 10×10 = 100!

---

## 🛠️ Technical Architecture

- **Visuals:** 16-bit Japanese pixel-art restaurant with HTML5 Canvas animations for customer characters (blinking, eating, cheering), steam rising from the rice cooker, hanging paper lanterns, and moving conveyor belt.
- **Audio:** Web Audio API synthesizer for retro cooking sound effects (doorbell, chopping knife swoosh, rolling mat, plate clinking, coin rings, and victory fanfare) with zero external audio dependencies.
- **State Management:** Persistent `localStorage` tracking unlocked levels, stars (1-3), and restaurant coins.
- **Responsive Design:** Optimized for desktop, tablet, and mobile browsers.

---

## 🚀 How to Run

### Direct Launch
Open [index.html](file:///C:/Users/sabir/kidocode-minigames/sushi-rush/index.html) directly in any modern browser.

### Local Web Server
```powershell
cd "C:\Users\sabir\kidocode-minigames\sushi-rush"
npx serve -l 3001 .
# Or using Python:
# python -m http.server 3001
```
Then visit `http://localhost:3001` in your browser.
