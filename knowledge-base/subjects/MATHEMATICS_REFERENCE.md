# 📐 MATHEMATICS — COMPLETE MENTOR REFERENCE
### CBSE Class 12 | Code 041 | Theory: 80 Marks | Internal Assessment: 20 Marks
### For use in Sahana's Board Exam Mentor System

---

## 📋 PAPER STRUCTURE

| Section | Questions | Type | Marks Each | Total |
|---------|-----------|------|-----------|-------|
| A | 18 MCQ + 2 Assertion-Reason | Objective | 1 | 20 |
| B | 5 | VSA (Very Short Answer) | 2 | 10 |
| C | 6 | SA (Short Answer) | 3 | 18 |
| D | 4 | LA (Long Answer) | 5 | 20 |
| E | 3 | Case Study-Based (CBQ) | 4 | 12 |
| **TOTAL** | **38** | | | **80** |

**Internal Choice:** 2 in Section B, 3 in Section C, 2 in Section D, 1 subpart each in 2 of Section E

---

## 🎯 MARKS PRIORITY ORDER

1. 🔴 **Integration (Definite + Indefinite)** — 15–18 marks every year — HIGHEST PRIORITY
2. 🔴 **Differential Equations** — 7–10 marks
3. 🔴 **Probability** — 8–12 marks (often CBQ)
4. 🔴 **3D Geometry** — 8–12 marks
5. 🔴 **Matrices & Determinants** — 8–10 marks
6. 🟡 **Linear Programming** — 5–6 marks
7. 🟡 **Vectors** — 4–6 marks
8. 🟡 **Application of Derivatives (AOD)** — 4–6 marks
9. 🟡 **Inverse Trigonometric Functions (ITF)** — 3–5 marks
10. 🟢 **Relations & Functions** — 2–4 marks
11. 🟢 **Continuity & Differentiability** — 3–5 marks

---

## 📚 CHAPTER REFERENCE

---

### 📘 CH 1: RELATIONS & FUNCTIONS | 2–4 marks | 🟢

**Key Concepts:**
1. **Types of Relations:** Empty, Universal, Reflexive, Symmetric, Transitive, Equivalence
   - Reflexive: (a,a) ∈ R for all a ∈ A
   - Symmetric: (a,b) ∈ R → (b,a) ∈ R
   - Transitive: (a,b),(b,c) ∈ R → (a,c) ∈ R
   - Equivalence = Reflexive + Symmetric + Transitive
2. **Types of Functions:** Injective (one-one), Surjective (onto), Bijective (both)
   - One-one test: f(x₁)=f(x₂) → x₁=x₂
   - Onto test: range = codomain
3. **Composition:** (fog)(x) = f(g(x)); if f,g bijective → fog bijective
4. **Binary Operations:** Commutative (a*b=b*a), Associative ((a*b)*c=a*(b*c))
5. **Identity element:** a*e = e*a = a
6. **Inverse:** a*a⁻¹ = a⁻¹*a = e

**Board Exam Pattern:** Usually 1–2 MCQs only; occasionally 2-mark VSA
**Common MCQ:** Identify function type from graph; composition of functions

---

### 📘 CH 2: INVERSE TRIGONOMETRIC FUNCTIONS (ITF) | 3–5 marks | 🟡

**Principal Value Branches (MUST memorise):**
| Function | Domain | Range (Principal Branch) |
|----------|--------|--------------------------|
| sin⁻¹x | [–1, 1] | [–π/2, π/2] |
| cos⁻¹x | [–1, 1] | [0, π] |
| tan⁻¹x | R | (–π/2, π/2) |
| cosec⁻¹x | R–(–1,1) | [–π/2, π/2]–{0} |
| sec⁻¹x | R–(–1,1) | [0, π]–{π/2} |
| cot⁻¹x | R | (0, π) |

**Key Properties:**
- sin⁻¹(sinx) = x only if x ∈ [–π/2, π/2]
- sin⁻¹x + cos⁻¹x = π/2
- tan⁻¹x + cot⁻¹x = π/2
- tan⁻¹x + tan⁻¹y = tan⁻¹((x+y)/(1–xy)) if xy < 1

**SQP Questions:**
- Evaluate tan(tan⁻¹(–1) + π/3) [2 marks]
  → tan⁻¹(–1) = –π/4; tan(–π/4 + π/3) = tan(π/12) = 2–√3
- Simplify: 2tan⁻¹(1/2) + tan⁻¹(1/7)
- Find domain of: f(x) = sin⁻¹(x²–4) etc.

---

### 📘 CH 3–4: MATRICES & DETERMINANTS | 8–10 marks | 🔴 HIGH

**Key Concepts — Matrices:**
1. **Types:** Row, Column, Square, Diagonal, Scalar, Identity, Zero, Symmetric, Skew-symmetric
   - Symmetric: A = Aᵀ
   - Skew-symmetric: A = –Aᵀ → diagonal elements = 0
2. **Operations:** A+B (same order); AB (m×n × n×p = m×p); NOT commutative in general
3. **Transpose:** (AB)ᵀ = BᵀAᵀ; (A+B)ᵀ = Aᵀ+Bᵀ
4. **Elementary row operations:** for finding inverse
5. **Inverse:** A⁻¹ = (adj A)/|A|; exists only if |A| ≠ 0 (non-singular)

**Key Concepts — Determinants:**
6. **Expansion:** cofactor expansion along any row/column
7. **Properties of Determinants:**
   - If any two rows/columns identical → det = 0
   - Multiply row by k → det multiplies by k
   - |kA| = kⁿ|A| for n×n matrix
   - |AB| = |A||B|
8. **Adjoint:** adj(A) = transpose of cofactor matrix
9. **Key Results:**
   - A(adj A) = |A|·I (SQP MCQ every year!)
   - |adj A| = |A|^(n-1) for n×n matrix (SQP MCQ every year!)
   - A⁻¹ = (adj A)/|A|
10. **Cramer's Rule & Matrix Method** for solving systems of equations

**SQP MCQ Traps:**
- A is 4th order, |adj A| = 27 → |adj A| = |A|³ → |A| = 3 → A(adj A) = 3I (not 3!)
- Skew-symmetric: if A = [0,r,–2; 3,p,t; q,–4,0], find q+t/p+r (off-diagonal elements are negatives of each other)

**Formulas:**
```
A(adj A) = |A|·I
|adj A| = |A|^(n-1)
A⁻¹ = (adj A)/|A|
For 2×2: [a,b;c,d]⁻¹ = (1/ad–bc)[d,–b;–c,a]
```

---

### 📘 CH 5: CONTINUITY & DIFFERENTIABILITY | 3–5 marks | 🟡

**Key Results:**
1. **Continuity at x=a:** lim(x→a) f(x) = f(a) (LHL = RHL = value)
2. **Piecewise functions:** equate LHL = RHL = f(a) to find k/value
3. **Differentiability:** if differentiable → continuous (not vice versa)
4. **Chain rule:** dy/dx = (dy/du)(du/dx)
5. **Implicit differentiation:** differentiate both sides wrt x
6. **Parametric differentiation:** dy/dx = (dy/dt)/(dx/dt)
7. **Second derivative:** d²y/dx²
8. **Logarithmic differentiation:** for xˣ, xˢⁱⁿˣ, uᵥ type

**Standard Derivatives:**
```
d/dx(sin⁻¹x) = 1/√(1–x²)
d/dx(cos⁻¹x) = –1/√(1–x²)
d/dx(tan⁻¹x) = 1/(1+x²)
d/dx(xˣ) = xˣ(1+ln x)
d/dx(eˣ) = eˣ; d/dx(aˣ) = aˣ ln a
```

**SQP Pattern:** Find k for continuity of piecewise function (appears 5/6 SQPs)

---

### 📘 CH 6: APPLICATION OF DERIVATIVES (AOD) | 4–6 marks | 🟡

**Key Concepts:**
1. **Rate of change:** dy/dt = (dy/dx)(dx/dt)
2. **Tangent:** slope = dy/dx at point; equation: y–y₁ = m(x–x₁)
3. **Normal:** slope = –1/(dy/dx); perpendicular to tangent
4. **Increasing/Decreasing:** f'(x) > 0 → increasing; f'(x) < 0 → decreasing
5. **Maxima/Minima:**
   - First derivative test: sign change of f'(x)
   - Second derivative test: f''(x) < 0 → max; f''(x) > 0 → min
6. **Absolute max/min on closed interval [a,b]:** evaluate at critical points + endpoints

**SQP Pattern:** f(x)=10–x–2x² is increasing on? → f'(x)=–1–4x>0 → x<–1/4 → (–∞,–1/4]

---

### 📘 CH 7: INTEGRALS (INDEFINITE + DEFINITE) | 15–18 marks | 🔴🔴🔴 TOP PRIORITY

**THIS IS THE HIGHEST MARKS CHAPTER — master all 7 integration types!**

#### TYPE 1: Standard Results (must be memorised)
```
∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ –1)
∫1/x dx = ln|x| + C
∫eˣ dx = eˣ + C; ∫aˣ dx = aˣ/ln a + C
∫sin x dx = –cos x + C; ∫cos x dx = sin x + C
∫tan x dx = ln|sec x| + C; ∫cot x dx = ln|sin x| + C
∫sec²x dx = tan x + C; ∫cosec²x dx = –cot x + C
∫sec x tan x dx = sec x + C; ∫cosec x cot x dx = –cosec x + C
∫1/√(1–x²) dx = sin⁻¹x + C; ∫–1/√(1–x²) dx = cos⁻¹x + C
∫1/(1+x²) dx = tan⁻¹x + C
∫1/√(a²–x²) dx = sin⁻¹(x/a) + C
∫1/(a²+x²) dx = (1/a)tan⁻¹(x/a) + C
∫1/√(x²±a²) dx = ln|x + √(x²±a²)| + C
∫1/(x²–a²) dx = (1/2a)ln|(x–a)/(x+a)| + C
∫1/(a²–x²) dx = (1/2a)ln|(a+x)/(a–x)| + C
```

#### TYPE 2: Integration by Substitution
- Identify inner function u = g(x), substitute, integrate, back-substitute
- Examples: ∫2x/(1+x²)dx [u=1+x²]; ∫sin³x cos x dx [u=sin x]; ∫eˢⁱⁿˣ cos x dx

#### TYPE 3: Integration by Parts (IBP)
**Formula:** ∫u·v dx = u·∫v dx – ∫(u'·∫v dx)dx
**ILATE rule** (priority for u): Inverse trig → Logarithm → Algebraic → Trigonometric → Exponential
- ∫x eˣ dx = xeˣ – eˣ + C
- ∫ln x dx = x ln x – x + C
- ∫eˣ(f(x) + f'(x)) dx = eˣf(x) + C ← **GOLDEN FORMULA** (appears almost every exam!)

#### TYPE 4: Partial Fractions
```
1/((x+a)(x+b)) = A/(x+a) + B/(x+b)
1/(x(x²+1)) = A/x + (Bx+C)/(x²+1)
```

#### TYPE 5: Integration of Trigonometric Functions
- For ∫sin^m x cos^n x dx:
  - If m is odd: substitute u = cos x
  - If n is odd: substitute u = sin x  
  - If both even: use half-angle formulas
- ∫1/(a+b cos x) dx: use t = tan(x/2) substitution

#### TYPE 6: Definite Integrals — Key Properties (HIGH VALUE!)
```
∫ₐᵇ f(x)dx = ∫ₐᵇ f(a+b–x)dx  ← most tested property!
∫₀ᵃ f(x)dx = ∫₀ᵃ f(a–x)dx
∫₋ₐᵃ f(x)dx = 2∫₀ᵃ f(x)dx if f is even; = 0 if f is odd
∫₀²ᵃ f(x)dx = 2∫₀ᵃ f(x)dx if f(2a–x) = f(x); = 0 if f(2a–x) = –f(x)
```
**SQP MCQ:** If f(a+b–x)=f(x), then ∫ₐᵇ x·f(x)dx = ((a+b)/2)·∫ₐᵇ f(x)dx

#### TYPE 7: Area Under Curves (Section D/E — 5 marks)
- Area = ∫ₐᵇ |f(x)| dx
- Between two curves: Area = ∫ₐᵇ [f(x) – g(x)] dx
- Always sketch the region first!

---

### 📘 CH 9: DIFFERENTIAL EQUATIONS | 7–10 marks | 🔴 MUST

**Types of Differential Equations:**

1. **Variable Separable:** dy/dx = f(x)g(y) → separate x and y, integrate both sides

2. **Linear DE (1st order):** dy/dx + P(x)y = Q(x)
   - Integrating Factor (IF): μ = e^(∫P dx)
   - Solution: y·μ = ∫(Q·μ)dx + C

3. **Homogeneous DE:** dy/dx = f(y/x) — substitute y = vx → dx/x = dv/(f(v)–v)

**SQP Pattern:**
- Find order and degree of given DE (order = highest derivative; degree = power of highest derivative when rational)
- Verify solution by substitution + differentiation
- Form DE from general solution (differentiate and eliminate constants)
- Solve variable separable or linear DE

**Common exam DE types:**
- (x²+1)dy/dx + 2xy = 4x² (linear — IF = x²+1)
- dy/dx = y/x + tan(y/x) (homogeneous)
- cos²x dy/dx + y = tan x (linear)

---

### 📘 CH 10: VECTORS | 4–6 marks | 🟡

**Key Formulas:**
```
Magnitude: |a⃗| = √(x²+y²+z²)
Unit vector: â = a⃗/|a⃗|
Dot product: a⃗·b⃗ = |a⃗||b⃗|cosθ = x₁x₂+y₁y₂+z₁z₂
Cross product: |a⃗×b⃗| = |a⃗||b⃗|sinθ
Area of triangle = ½|a⃗×b⃗|
Area of parallelogram = |a⃗×b⃗|
Projection of a⃗ on b⃗ = (a⃗·b⃗)/|b⃗|
Scalar triple product: [a⃗,b⃗,c⃗] = a⃗·(b⃗×c⃗) = 0 → coplanar
```

**Section A MCQ pattern:**
- a⃗×b⃗ is perpendicular to both a⃗ and b⃗
- Angle between vectors using dot product
- Coplanar condition

---

### 📘 CH 11: 3D GEOMETRY | 8–12 marks | 🔴 MUST

**Line Equations:**
```
Cartesian: (x–x₁)/l = (y–y₁)/m = (z–z₁)/n
Vector: r⃗ = a⃗ + λb⃗
Angle between lines: cosθ = |l₁l₂+m₁m₂+n₁n₂|
Parallel: l₁/l₂ = m₁/m₂ = n₁/n₂
Perpendicular: l₁l₂+m₁m₂+n₁n₂ = 0
```

**Plane Equations:**
```
General: ax + by + cz = d
Normal form: r⃗·n̂ = p
Through 3 points: use determinant form
Angle between planes: cosθ = |a₁a₂+b₁b₂+c₁c₂|/√(a₁²+b₁²+c₁²)√(a₂²+b₂²+c₂²)
Distance from point to plane: d = |ax₁+by₁+cz₁+d|/√(a²+b²+c²)
```

**Skew Lines:**
- Distance = ||(a⃗₂–a⃗₁)·(b⃗₁×b⃗₂)||/||b⃗₁×b⃗₂||

**SQP Pattern (Section D — 5 marks):**
- Find foot of perpendicular from point to line/plane
- Find image of point in a plane
- Find equation of plane through intersection of two planes + condition

---

### 📘 CH 12: LINEAR PROGRAMMING | 5–6 marks | 🟡

**Method (5 steps — always show all):**
1. Define variables (x = ..., y = ...)
2. Write objective function Z = ax + by
3. Write all constraints as inequalities
4. Graph the feasible region (shade correctly)
5. Evaluate Z at each corner point → find max/min

**SQP Pattern (Section C or D):**
- Given constraints, find max/min value of Z
- Identify vertices of feasible region
- Check: if feasible region is unbounded, verify max/min using open half-plane test

---

### 📘 CH 13: PROBABILITY | 8–12 marks | 🔴 MUST (often CBQ)

**Key Formulas:**
```
Conditional: P(A|B) = P(A∩B)/P(B)
Multiplication: P(A∩B) = P(A)·P(B|A)
Independent: P(A∩B) = P(A)·P(B)
Total Probability: P(B) = ΣP(Aᵢ)·P(B|Aᵢ)
Bayes' Theorem: P(Aᵢ|B) = P(B|Aᵢ)P(Aᵢ) / ΣP(B|Aⱼ)P(Aⱼ)
Binomial: P(X=r) = ⁿCᵣ·pʳ·qⁿ⁻ʳ; Mean = np; Variance = npq
```

**SQP Case Study (CBQ) — appears every year:**
- Medical diagnosis / disease screening type:
  - Group 1: 60% population, 80% have symptom
  - Group 2: 30% population, 70% have symptom  
  - Group 3: 10% population, 30% have symptom
  - Find P(has symptom) using total probability
  - Find P(from Group 2 | has symptom) using Bayes'

**Section D Pattern:** Binomial distribution problems; expected value; variance

---

## ⚡ RAPID FIRE POOL (Mathematics)

| Q | Answer |
|---|--------|
| ∫eˣ(f(x)+f'(x))dx = ? | eˣf(x) + C |
| ∫₀ᵃ f(x)dx = ? | ∫₀ᵃ f(a–x)dx |
| |adj A| for n×n = ? | |A|^(n-1) |
| Principal branch of sin⁻¹x? | [–π/2, π/2] |
| Integrating factor of dy/dx + Py = Q? | e^(∫P dx) |
| Distance between skew lines formula? | ||(a₂–a₁)·(b₁×b₂)||/||b₁×b₂|| |
| Bayes' theorem? | P(Aᵢ|B) = P(B|Aᵢ)P(Aᵢ)/ΣP(B|Aⱼ)P(Aⱼ) |
| A(adj A) = ? | |A|·I |
| a⃗×b⃗ perpendicular to? | Both a⃗ and b⃗ |
| Integration by parts formula? | ∫u·v dx = u∫v dx – ∫(u'·∫v dx)dx |
| ∫1/√(1–x²) dx = ? | sin⁻¹x + C |
| sin⁻¹x + cos⁻¹x = ? | π/2 |
| For odd function ∫₋ₐᵃ f(x)dx = ? | 0 |
| Order of DE? | Order of highest derivative |
| Degree of DE? | Power of highest derivative (when rational) |

---

## 🧠 HIGH-VALUE PROBLEMS (Appear Almost Every Exam)

### 1. Definite Integral Property (1-mark MCQ — appears 5/6 SQPs)
If f(a+b–x) = f(x), then ∫ₐᵇ x·f(x)dx = ?
**Answer:** = (a+b)/2 · ∫ₐᵇ f(x)dx
**Proof:** Let I = ∫ₐᵇ x·f(x)dx; use property → I = ∫ₐᵇ (a+b–x)f(x)dx; add → 2I = (a+b)∫f(x)dx

### 2. Matrices — |adj A| (1-mark MCQ — appears every SQP)
A is 4th order, |adj A| = 27. Find A(adj A).
**Answer:** |adj A| = |A|^(n-1) = |A|³ = 27 → |A| = 3 → A(adj A) = |A|·I = **3I**

### 3. ITF Evaluation (2 marks)
Evaluate: tan(tan⁻¹(–1) + π/3)
**Answer:** tan⁻¹(–1) = –π/4; angle = –π/4 + π/3 = π/12; tan(π/12) = 2–√3

### 4. Bayes' Theorem Case Study (4 marks — CBQ — every year)
Pattern: Three groups with different probabilities → find conditional probability
**Template answer structure:**
- Define events clearly
- Apply total probability: P(E) = P(A₁)P(E|A₁) + P(A₂)P(E|A₂) + ...
- Apply Bayes': P(Aᵢ|E) = P(Aᵢ)P(E|Aᵢ)/P(E)

### 5. Linear DE (3–5 marks)
Solve: dy/dx + 2y/(x) = x² [standard linear DE]
**Answer:** P = 2/x; IF = e^(∫2/x dx) = e^(2ln x) = x²
y·x² = ∫x²·x² dx = ∫x⁴ dx = x⁵/5 + C → **y = x³/5 + C/x²**

---

## 🎓 ANSWER WRITING TIPS FOR SAHANA

### For Integration (5-mark problems):
1. **Identify the type FIRST** (substitution? IBP? partial fractions?)
2. Show every substitution step clearly
3. Back-substitute to original variable
4. Always add + C for indefinite integrals
5. For area: draw rough sketch of region

### For Matrices/Determinants:
- Show row operations step by step (R1→R1–2R2 format)
- Never skip cofactor expansion steps
- For solving equations: show [A|B] augmented matrix

### For 3D Geometry:
- Write parametric form of line before proceeding
- For plane through intersection: use λ method (π₁ + λπ₂ = 0)
- Always verify by substituting given point back

### For Probability:
- ALWAYS define events clearly (Let A = event that...)
- For Bayes' — tabular format impresses examiners
- Show tree diagram for multi-step probability

### Keywords Examiners Look For:
- Relations: "equivalence", "reflexive", "transitive"
- Calculus: "differentiable implies continuous", "critical points", "second derivative test"
- Probability: "mutually exclusive", "independent", "conditional"
- 3D: "direction cosines", "direction ratios", "normal to plane"

---

*Mathematics Reference | Sahana's CBSE 12 Board Mentor System | Updated June 2026*
