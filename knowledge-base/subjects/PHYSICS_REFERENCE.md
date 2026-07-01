# ⚛️ PHYSICS — COMPLETE MENTOR REFERENCE
### CBSE Class 12 | Code 042 | Theory: 70 Marks | Practical: 30 Marks
### For use in Sahana's Board Exam Mentor System — Do NOT show raw to student

---

## 📋 PAPER STRUCTURE (Fixed Pattern — All SQPs)

| Section | Questions | Type | Marks Each | Total |
|---------|-----------|------|-----------|-------|
| A | 12 MCQ + 4 Assertion-Reason | Objective | 1 | 16 |
| B | 5 | Short Answer | 2 | 10 |
| C | 7 | Short Answer | 3 | 21 |
| D | 2 | Case-Based (CBQ) | 4 | 8 |
| E | 3 | Long Answer (Internal Choice) | 5 | 15 |
| **TOTAL** | **33** | | | **70** |

**Internal Choice:** 2 in Section B, 1 in Section C, all 3 in Section E

---

## 🎯 MARKS PRIORITY ORDER (PYQ-Based)

1. 🔴 **Electrostatics (Ch 1+2)** — 8–10 marks every year
2. 🔴 **Optics — Ray & Wave (Ch 9+10)** — 8–10 marks every year
3. 🔴 **Current Electricity (Ch 3)** — 7–9 marks every year
4. 🔴 **EMI + AC Circuits (Ch 6+7)** — 7–9 marks every year
5. 🔴 **Dual Nature (Ch 11)** — 5–8 marks every year
6. 🔴 **Semiconductors (Ch 14)** — 4–6 marks every year
7. 🟡 **Magnetism + Moving Charges (Ch 4+5)** — 5–7 marks
8. 🟡 **Atoms & Nuclei (Ch 12+13)** — 4–6 marks
9. 🟢 **EM Waves (Ch 8)** — 2–4 marks
10. 🟢 **Communication Systems** — 2–3 marks

---

## 📚 CHAPTER-BY-CHAPTER REFERENCE

---

### 📘 CHAPTER 1 & 2: ELECTROSTATICS
**Marks Weightage: 8–10 | Sections: A, B, E | Priority: 🔴 MUST**

#### Key Concepts:
1. **Coulomb's Law:** F = kq₁q₂/r² (k = 9×10⁹ Nm²/C²)
2. **Electric Field:** E = F/q = kQ/r² (N/C or V/m)
3. **Electric Field Lines** — rules: originate +ve, terminate –ve; never cross; density ∝ field strength
4. **Gauss's Law:** φ = Q_enc/ε₀ (flux through closed surface = enclosed charge/ε₀)
5. **Electric Potential:** V = kQ/r (scalar); V = –∫E·dr
6. **Equipotential Surfaces** — E always perpendicular; no work done moving along them
7. **Potential Energy:** U = kq₁q₂/r; for system: sum of all pairs
8. **Capacitance:** C = Q/V; for parallel plates: C = ε₀A/d
9. **Dielectric Effect:** with battery connected: V constant, C increases (C = κε₀A/d); without battery: Q constant, V decreases
10. **Energy in Capacitor:** U = ½CV² = Q²/2C = ½QV
11. **Series Capacitors:** 1/C = 1/C₁ + 1/C₂ ...
12. **Parallel Capacitors:** C = C₁ + C₂ ...
13. **Electric Dipole:** p = q×2l; E_axial = 2kp/r³; E_equatorial = kp/r³
14. **Torque on dipole:** τ = pE sinθ; PE: U = –pE cosθ

#### CBSE Board Exam Favourite Derivations:
- **Derive E due to uniformly charged infinite plane using Gauss's Law** → E = σ/2ε₀
- **Derive E between plates of parallel plate capacitor** → E = σ/ε₀
- **Energy stored in capacitor derivation**
- **Effect of dielectric on capacitor** (connected vs disconnected battery — both cases)
- **Electric potential at a point due to electric dipole**

#### Section E (5-mark) Most Common:
- Capacitor with dielectric slab inserted, find new capacitance/energy
- System of charges — find total PE, net force
- Capacitors in combination networks

#### Important Formulas Box:
```
Coulomb's Law:      F = (1/4πε₀) × q₁q₂/r²
Electric Field:     E = F/q = kQ/r²
Gauss's Law:        ∮E·dA = Q_enc/ε₀
Capacitance:        C = ε₀A/d (parallel plates)
With dielectric:    C = κε₀A/d
Energy:             U = ½CV² = Q²/2C
Dipole moment:      p = q × 2l
Dipole E (axial):   E = 2kp/r³
Dipole E (equat):   E = kp/r³
```

#### Common Errors (Flag in Strengthen Mode):
- ❌ Forgetting to include κ when battery is disconnected (Q constant, not V)
- ❌ Wrong sign convention in PE of dipole
- ❌ Confusing E due to shell (inside = 0; outside = kQ/r²)
- ❌ Not mentioning units in final answer

#### Memory Tricks:
- "GAP = Gauss's flux = Q_enclosed/ε₀" 
- Dielectric: "C goes up, U goes down when disconnected; both up when connected"
- Axial field = 2 × equatorial field

---

### 📘 CHAPTER 3: CURRENT ELECTRICITY
**Marks Weightage: 7–9 | Sections: A, C, E | Priority: 🔴 MUST**

#### Key Concepts:
1. **Ohm's Law:** V = IR; R = ρL/A
2. **Drift Velocity:** vd = eEτ/m; I = nAevd
3. **Resistivity:** ρ = m/(ne²τ); temperature: ρ_T = ρ₀(1 + αT)
4. **EMF and Internal Resistance:** V = E – Ir (discharging); V = E + Ir (charging)
5. **Kirchhoff's Laws:**
   - KCL: ΣI = 0 at junction
   - KVL: ΣV = 0 around loop
6. **Wheatstone Bridge:** Balanced when P/Q = R/S; no current through galvanometer
7. **Meter Bridge:** R/S = l/(100–l)
8. **Potentiometer:** principle — no current drawn; longer wire = more sensitive
9. **Combinations:** Series: R = R₁+R₂; Parallel: 1/R = 1/R₁+1/R₂
10. **Power:** P = VI = I²R = V²/R; Heat = I²Rt
11. **Galvanometer → Ammeter:** shunt S = GIg/(I–Ig)
12. **Galvanometer → Voltmeter:** series R = V/Ig – G

#### CBSE Board Exam Favourite Derivations:
- **Wheatstone bridge balance condition using Kirchhoff's laws**
- **Drift velocity derivation** and its relation to current
- **EMF of cell using potentiometer**

#### Section E Most Common:
- Kirchhoff's laws → network of resistors + numerical
- Galvanometer conversion (ammeter OR voltmeter)
- Potentiometer — find EMF or compare EMFs

#### Important Formulas Box:
```
Resistivity:     ρ = m/(ne²τ)
Drift velocity:  vd = eEτ/m = I/(nAe)
Cell terminal V: V = E – Ir
Galv→Ammeter:   S = GIg/(I–Ig)
Galv→Voltmeter: R = V/Ig – G
WB balanced:    P/Q = R/S
Power:          P = I²R = V²/R
```

#### Common Errors:
- ❌ Confusing current sensitivity (I/div) with voltage sensitivity (V/div) — they're inversely related
- ❌ Wrong direction of current in cells during charging
- ❌ Using P = V²/R when resistors are in parallel vs P = I²R in series

---

### 📘 CHAPTER 4 & 5: MAGNETISM & MOVING CHARGES
**Marks Weightage: 5–7 | Priority: 🔴 HIGH**

#### Key Concepts:
1. **Biot-Savart Law:** dB = (μ₀/4π)(Idl×r̂)/r²
2. **Long straight wire:** B = μ₀I/(2πr)
3. **Circular loop at centre:** B = μ₀I/2R
4. **Ampere's Law:** ∮B·dl = μ₀I_enc
5. **Solenoid:** B = μ₀nI (inside); 0 (outside)
6. **Toroid:** B = μ₀NI/2πr (inside the donut)
7. **Force on charge:** F = q(v×B) = qvBsinθ
8. **Force on current:** F = Il×B = BILsinθ
9. **Radius of circular motion:** r = mv/qB
10. **Cyclotron frequency:** f = qB/2πm (independent of speed!)
11. **Torque on current loop:** τ = NIAB sinθ; τ = m×B
12. **Galvanometer:** current sensitivity = NBA/k
13. **Magnetism:** diamagnetic (repelled), paramagnetic (weakly attracted), ferromagnetic (strongly attracted)

#### Section C Most Common:
- Motion of charged particle in magnetic field + radius + helical motion
- Force between two parallel current-carrying wires
- Torque on current loop + conversion to meter

#### Assertion-Reason Trap:
- "Galvanometer sensitivity — A: increasing N increases sensitivity; R: resistance also increases" → Both true, R is NOT the correct explanation of A (because sensitivity = NBA/k, doesn't depend on resistance)

---

### 📘 CHAPTER 6 & 7: EMI + AC CIRCUITS
**Marks Weightage: 7–9 | Sections: A, D, E | Priority: 🔴 MUST**

#### Key Concepts — EMI:
1. **Faraday's Law:** ε = –dΦ/dt; Φ = NBA cosθ
2. **Lenz's Law:** induced current opposes change in flux
3. **Motional EMF:** ε = Bvl
4. **Self-induction:** ε = –L dI/dt; L for solenoid = μ₀n²V
5. **Mutual induction:** ε₂ = –M dI₁/dt
6. **Energy in inductor:** U = ½LI²
7. **AC Generator:** ε = NBAω sin(ωt) = ε₀ sin(ωt)

#### Key Concepts — AC Circuits:
8. **RMS values:** Irms = I₀/√2; Vrms = V₀/√2
9. **Impedance (LCR):** Z = √(R² + (XL–XC)²)
10. **XL = ωL; XC = 1/ωC**
11. **Resonance:** XL = XC → ω₀ = 1/√LC; Z_min = R; I_max
12. **Power factor:** cos φ = R/Z; Pavg = Vrms Irms cos φ
13. **Transformer:** Vs/Vp = Ns/Np = Ip/Is; step-up: Ns > Np

#### CBSE Board Exam Section E Favourites:
- **AC Generator** — working + derive ε = NBAω sinωt
- **Transformer** — principle + ratio derivation + efficiency
- **LCR series circuit** — impedance derivation + phasor diagram + resonance condition

#### Phasor Rules (CBQ/Section C):
- Pure R: V and I in phase
- Pure L: V leads I by π/2
- Pure C: I leads V by π/2
- LCR: tan φ = (XL–XC)/R

#### Important Formulas:
```
Faraday's Law:    ε = –dΦ/dt = –N dΦ/dt
Motional EMF:     ε = Bvl
AC Generator:     ε = NBAω sin(ωt)
Impedance LCR:    Z = √(R² + (XL–XC)²)
Resonance:        ω₀ = 1/√LC
Q factor:         Q = ω₀L/R = 1/(ω₀RC)
Transformer:      Vs/Vp = Ns/Np
Power factor:     P = VrmsIrms cosφ
```

---

### 📘 CHAPTER 8: ELECTROMAGNETIC WAVES
**Marks Weightage: 2–4 | Priority: 🟢 LOW**

#### Key Concepts:
1. **Maxwell's displacement current:** Id = ε₀ dΦE/dt
2. **EM wave properties:** E and B perpendicular; both perpendicular to propagation; transverse
3. **Speed:** c = 1/√(μ₀ε₀) = E₀/B₀ = 3×10⁸ m/s
4. **EM spectrum (high to low frequency):** γ-rays, X-rays, UV, Visible, IR, Microwaves, Radio
5. **Energy:** E ∝ frequency; E = hν

#### SQP Pattern: Usually 1–2 MCQs only
- Radio waves vs gamma rays comparison (energy, frequency)
- Displacement current concept
- EM wave properties

---

### 📘 CHAPTER 9 & 10: OPTICS (RAY + WAVE)
**Marks Weightage: 8–10 | Sections: A, C, E | Priority: 🔴 MUST**

#### Ray Optics — Key Concepts:
1. **Snell's Law:** n₁sinθ₁ = n₂sinθ₂; n = c/v = sin i/sin r
2. **TIR condition:** i > critical angle; sinC = n₂/n₁
3. **Mirror formula:** 1/v + 1/u = 1/f (f = R/2)
4. **Lens formula:** 1/v – 1/u = 1/f
5. **Lens Maker's Formula:** 1/f = (n–1)[1/R₁ – 1/R₂]
6. **Magnification:** m = v/u (lens); m = –v/u (mirror)
7. **Power of lens:** P = 1/f(in metres); unit = Diopter (D)
8. **Prism:** A + δ = i + e; at minimum deviation: i = e, r₁ = r₂ = A/2
9. **Prism refractive index:** n = sin[(A+δm)/2] / sin(A/2)
10. **Refraction at spherical surface:** n₂/v – n₁/u = (n₂–n₁)/R
11. **Telescope (astronomical):** m = fo/fe; L = fo + fe
12. **Compound Microscope:** m = –L/fo × (D/fe); L = tube length

#### Wave Optics — Key Concepts:
13. **Young's Double Slit:** fringe width β = λD/d; path difference: Δ = dsinθ
14. **Bright fringes:** Δ = nλ; Dark fringes: Δ = (2n+1)λ/2
15. **Single Slit Diffraction:** central max at zero; minima at a sinθ = nλ
16. **Diffraction vs Interference:** diffraction — same slit; interference — two sources
17. **Polarisation:** Brewster's angle: tan ip = n; Malus' Law: I = I₀cos²θ

#### CBSE Section E Favourites (BOTH must be mastered — alternate every year!):
- **Option A:** Lens Maker's Formula derivation (using refraction at two surfaces) + numerical
- **Option B:** Prism — derive A+δ=i+e, condition for min deviation + refractive index formula

#### Section C Most Common:
- Equiconvex lens problem (given n and f, find R)
- YDSE fringe width calculation
- TIR condition + critical angle calculation

#### Important Formulas:
```
Snell's Law:       n₁sinθ₁ = n₂sinθ₂
Mirror:            1/v + 1/u = 1/f; f = R/2
Lens:              1/v – 1/u = 1/f
Lens Maker's:      1/f = (n–1)[1/R₁ – 1/R₂]
Prism (min dev):   n = sin[(A+δm)/2]/sin(A/2)
YDSE fringe:       β = λD/d
Malus' Law:        I = I₀cos²θ
Brewster's:        tan ip = n
```

#### Common Errors:
- ❌ Sign convention: all distances from pole/optical centre; +ve in direction of incident light
- ❌ Forgetting that at minimum deviation i = e (most common derivation error)
- ❌ Not drawing ray diagram in Section E (auto-loses 1 mark)
- ❌ Confusing R₁ and R₂ sign convention in Lens Maker's formula

---

### 📘 CHAPTER 11: DUAL NATURE OF RADIATION & MATTER
**Marks Weightage: 5–8 | Sections: A, D | Priority: 🔴 MUST**

#### Key Concepts:
1. **Photoelectric Effect:** electrons ejected when ν > threshold ν₀
2. **Work Function:** φ = hν₀ (minimum energy needed)
3. **Einstein's Equation:** KE_max = hν – φ = h(ν–ν₀)
4. **Stopping Potential:** eV₀ = hν – φ → V₀ = h(ν–ν₀)/e
5. **Effect of intensity:** more electrons (more current) but NO change in KE
6. **Effect of frequency:** increase ν → increase KE; decrease ν below ν₀ → no emission
7. **de Broglie wavelength:** λ = h/p = h/mv = h/√(2mKE)
8. **For accelerated particle:** λ = h/√(2meV)

#### CBQ Pattern (Section D — appears every year):
- **CBQ 1:** Photoelectric effect apparatus diagram + stopping potential graph
- **CBQ 2:** Effect of intensity vs frequency on photoelectric current

#### Assertion-Reason Trap:
- "de Broglie wavelength of a freely falling body" — λ = h/mv; as it falls, v increases, λ decreases — BUT this is due to momentum increase not KE directly

#### Important Formulas:
```
Photoelectric:    KE_max = hν – φ
Stopping V:       eV₀ = hν – φ
de Broglie:       λ = h/mv = h/p
Accelerated e⁻:   λ = h/√(2meV)
Momentum-λ:       p = h/λ
```

---

### 📘 CHAPTER 12 & 13: ATOMS & NUCLEI
**Marks Weightage: 4–6 | Sections: A, B | Priority: 🟡 HIGH**

#### Bohr's Model:
1. **Radius:** rₙ = n²a₀ (a₀ = 0.529 Å for H)
2. **Energy:** Eₙ = –13.6/n² eV
3. **Velocity:** vₙ = e²/(2ε₀hn) (decreases with n)
4. **Spectral Series:** Lyman (UV), Balmer (Visible), Paschen (IR)
5. **Frequency:** ν = Rc(1/n₁² – 1/n₂²); R = 1.097×10⁷ m⁻¹

#### Nuclear Physics:
6. **Nuclear radius:** R = R₀A^(1/3) (R₀ = 1.2 fm)
7. **Binding Energy:** BE = Δm × 931.5 MeV (Δm = mass defect)
8. **BE/nucleon:** maximum for Iron (Fe-56) → most stable
9. **Radioactive Decay:** N = N₀e^(–λt); T½ = 0.693/λ
10. **Nuclear reactions:** α-decay (–4, –2); β-decay (0, ±1); γ-decay (no change)
11. **Q value:** Q = (mass of reactants – mass of products) × c²

#### Assertion-Reason Common (4/6 SQPs):
- "Nuclei stability and binding energy" — heavier nuclei less stable per nucleon

---

### 📘 CHAPTER 14: SEMICONDUCTOR ELECTRONICS
**Marks Weightage: 4–6 | Sections: A, D | Priority: 🔴 HIGH**

#### Key Concepts:
1. **Intrinsic semiconductors:** pure Si/Ge; n = p = nᵢ
2. **n-type:** donor impurity (pentavalent); n >> p
3. **p-type:** acceptor impurity (trivalent); p >> n
4. **p-n junction:** depletion layer; potential barrier
5. **Forward bias:** thin depletion layer; current flows; V_barrier reduced
6. **Reverse bias:** thick depletion layer; no current (except leakage)
7. **Diode I-V characteristic:** non-linear; knee voltage ~0.3V (Ge), ~0.7V (Si)
8. **Rectifier:** Half-wave (1 diode), Full-wave (2 or 4 diodes/bridge)
9. **Zener diode:** voltage regulator; breakdown in reverse bias
10. **Transistor:** NPN or PNP; three regions: emitter, base, collector
11. **Transistor action:** IE = IB + IC; α = IC/IE; β = IC/IB; β = α/(1–α)
12. **Logic Gates:** AND, OR, NOT, NAND, NOR, XOR — truth tables must be memorised
13. **NAND/NOR:** universal gates (can implement any logic)

#### CBQ Pattern (Section D):
- Diode circuit problem (forward/reverse bias, current calculation)
- Logic gate truth table + Boolean expression

---

## 🔥 SECTION-WISE EXAM STRATEGY

### Section A (16 marks) — MCQ + Assertion-Reason
**Top recurring MCQ topics (appeared 4–6/6 SQPs):**
- Electrostatic potential & equipotential surfaces
- Electric field lines + Gauss's Law
- Diode circuit problems (V₀ calculations, bias)
- Photoelectric effect (stopping potential, threshold frequency)
- Series LCR resonance (impedance, voltage)
- Diffraction vs interference
- Refractive index / optical path problems

**Assertion-Reason Trap (tested every year):**
> Both A and R are TRUE, but R is NOT the correct explanation of A
- This is the most commonly wrong answer — always read carefully!
- Check: Is R explaining WHY A happens? Or just a related fact?

### Section B (10 marks) — 2 marks each
Near-certain topics:
- de Broglie wavelength numerical
- YDSE fringe width calculation  
- Galvanometer → Ammeter OR Voltmeter conversion
- Magnetic force on moving charge

### Section C (21 marks) — 3 marks each
Near-certain topics:
- E due to electric dipole derivation
- Lens maker's application (equiconvex lens)
- AC circuit phasor diagram
- Wheatstone bridge (Kirchhoff's proof)
- Prism — angle of deviation derivation

### Section D (8 marks) — CBQ
- **CBQ 1 (Q29):** Motion of charged particle in magnetic field (radius, time period, helical motion); Cyclotron
- **CBQ 2 (Q30):** Photoelectric effect apparatus (current vs voltage graphs); stopping potential numericals

### Section E (15 marks) — 5 marks, all have internal choice
- **Q31:** Electrostatics OR Current Electricity
- **Q32:** Always Optics (Ray) — Lens Maker's vs Prism — MASTER BOTH
- **Q33:** EMI/AC OR Current Electricity

---

## ⚡ RAPID FIRE POOL (Physics)

| Q | Answer |
|---|--------|
| Unit of electric flux? | Nm²/C or Vm |
| Energy stored in capacitor? | U = ½CV² = Q²/2C |
| Resonant frequency LCR? | f = 1/(2π√LC) |
| de Broglie wavelength? | λ = h/mv = h/p |
| Lens Maker's formula? | 1/f = (n–1)[1/R₁ – 1/R₂] |
| Snell's law? | n₁sinθ₁ = n₂sinθ₂ |
| Transformer ratio? | Vs/Vp = Ns/Np |
| AC Generator EMF? | ε = NBAω sin(ωt) |
| Photoelectric threshold? | hν₀ = φ |
| Max BE/nucleon nucleus? | Iron (Fe-56) |
| Cyclotron frequency? | f = qB/2πm |
| TIR condition? | i > critical angle C, where sinC = n₂/n₁ |
| Brewster's Law? | tan ip = n |
| Solenoid B field? | B = μ₀nI |
| YDSE fringe width? | β = λD/d |

---

## 🧠 HIGH-VALUE NUMERICALS (appear almost every exam)

### 1. Galvanometer Conversion (2 marks — Section B)
**Type:** G = 49.5Ω, Ig = 0.05 A. Convert to ammeter of range 5A.
**Method:** S = GIg/(I–Ig) = 49.5 × 0.05/(5–0.05) = 2.475/4.95 = **0.5 Ω**

### 2. Lens Maker's Formula (3 marks — Section C)
**Type:** Equiconvex lens, n = 1.5, f = 20 cm. Find radius of curvature.
**Method:** 1/f = (n–1)[1/R₁ – 1/R₂]; R₁ = R, R₂ = –R
→ 1/20 = (1.5–1)[2/R] → 1/20 = 1/R → **R = 20 cm**

### 3. Stopping Potential (2 marks — Section B)
**Type:** Light of frequency 6×10¹⁴ Hz falls on metal (φ = 2.1 eV). Find V₀.
**Method:** eV₀ = hν – φ = (6.63×10⁻³⁴ × 6×10¹⁴)/(1.6×10⁻¹⁹) – 2.1
= 3.98 – 2.1 = **1.88 V** (approximately)

### 4. Transformer (5 marks — Section E)
**Type:** Vin = 200sin(100πt), N₁ = 1000, N₂ = 100, R = 4Ω, XL = 6Ω, XC = 2Ω
**Method:** Vs = Vp × N₂/N₁; then find I using Z = √(R² + (XL–XC)²)

---

## 📊 PHYSICAL CONSTANTS (Given in exam paper)

| Constant | Value |
|----------|-------|
| c (speed of light) | 3 × 10⁸ m/s |
| mₑ | 9.1 × 10⁻³¹ kg |
| mₚ | 1.7 × 10⁻²⁷ kg |
| e | 1.6 × 10⁻¹⁹ C |
| μ₀ | 4π × 10⁻⁷ Tm/A |
| h (Planck's) | 6.63 × 10⁻³⁴ J·s |
| ε₀ | 8.854 × 10⁻¹² C²N⁻¹m⁻² |
| Avogadro's N | 6.023 × 10²³ /mol |
| k = 1/4πε₀ | 9 × 10⁹ Nm²/C² |

---

## 🎓 ANSWER WRITING TIPS FOR SAHANA

### For Derivations (3/5 marks):
1. **State what you're deriving** (1 line)
2. **Draw the diagram** (2D is fine, neat labelling)
3. **Write assumptions** if any (e.g., "shell is uniformly charged")
4. **Stepwise algebra** — every step = marks
5. **Circle/box the final formula** with units

### For Numericals:
1. **List: Given** (all values with units)
2. **Write: Formula**
3. **Substitute** with units
4. **Calculate** and write final answer with units

### For 5-mark Long Answers:
- Section E always asks: Principle + Working + Diagram + Expression + Application
- Use the structure: **P-W-D-E-A** (Principle, Working, Diagram, Expression, Application)

### Keywords examiners look for:
- Electrostatics: "equipotential", "Gauss's Law", "dielectric constant"
- Optics: "normal to surface", "principle axis", "minimum deviation"  
- EMI: "flux linkage", "Lenz's law", "eddy currents"

---

*Physics Reference | Sahana's CBSE 12 Board Mentor System | Updated June 2026*
