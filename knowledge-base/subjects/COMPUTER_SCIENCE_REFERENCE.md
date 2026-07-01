# 💻 COMPUTER SCIENCE — COMPLETE MENTOR REFERENCE
### CBSE Class 12 | Code 083 | Theory: 70 Marks | Practical: 30 Marks
### For use in Sahana's Board Exam Mentor System

---

## 📋 PAPER STRUCTURE

| Section | Questions | Type | Marks Each | Total |
|---------|-----------|------|-----------|-------|
| A | 21 | MCQ / T-F / Fill-in-blank / Assertion-Reason | 1 | 21 |
| B | 7 | Short Answer | 2 | 14 |
| C | 3 | Short Answer | 3 | 9 |
| D | 4 | Long Answer | 4 | 16 |
| E | 2 | Long Answer | 5 | 10 |
| **TOTAL** | **37** | | | **70** |

**All programming in Python only. In-case of MCQ, write correct option AND answer text.**

---

## 🎯 MARKS PRIORITY ORDER

1. 🔴 **Python Output Tracing** — 8–10 marks (Section A–C)
2. 🔴 **File Handling (Text + Binary + CSV)** — 5–10 marks (Section D–E)
3. 🔴 **SQL Queries** — 8–10 marks (Section D)
4. 🔴 **Stack (Data Structures)** — 3–4 marks (Section C)
5. 🟡 **Computer Networks** — 4–6 marks (Section A, B, E)
6. 🟡 **Python-MySQL Connectivity** — 4–5 marks (Section D–E)
7. 🟡 **Python Functions & OOP concepts** — 4–6 marks (Section B–C)
8. 🟢 **Exception Handling** — 2–3 marks
9. 🟢 **Society & Ethics / Cyber Law** — 1–3 marks

---

## 📚 PYTHON — COMPLETE REFERENCE

### 🐍 PYTHON OUTPUT TRACING (Section A — highest frequency!)

**String Operations (appears 3–4 times per paper):**
```python
# Slicing: s[start:stop:step] — default step=1, stop exclusive
s = "Soft Skills"
print(s[-3::-3])  # Start at index -3 (i), go backwards by 3
# s = S(0)o(1)f(2)t(3) (4)S(5)k(6)i(7)l(8)l(9)s(10)
# -3 = index 8 (l), going backwards by 3: l(8), S(5), t(3), S(0) → "lStS"
# Wait, let's trace: -3=8(l), 8-3=5(S), 5-3=2(f), 2-3=-1... → "lSf"
# Answer: lSf

s = "Waterskiing is thrilling!"
print(s.split("i"))  # Split on every 'i' — INCLUDES EMPTY STRINGS between consecutive i's
# "Watersk" "ng " "s thr" "ll" "ng!" with "" between k"i""i"ng
# Answer: ['Watersk', '', 'ng ', 's thr', 'll', 'ng!']
# TRAP: Two consecutive 'i's in "skiing" creates empty string!
```

**List/Dictionary/Function Tracing (appears 2–3 times):**
```python
# Global variable trap
i = 5
print(i, end='@@')        # Output: 5@@
def add():
    global i
    i = i + 7
    print(i, end='##')    # Output: 12##
add()
print(i)                   # Output: 12
# Final: 5@@12##12

# Dictionary emp with tuples (salary1, salary2)
emp = {"Arv":(85000,90000),"Ria":(78000,88000),"Jay":(72000,80000),"Tia":(80000,70000)}
selected = []
for name in emp:
    salary = emp[name]
    average = (salary[0] + salary[1]) / 2
    if average > 80000:
        selected.append(name)
print(selected)
# Arv avg=87500>80000 ✓; Ria avg=83000>80000 ✓; Jay avg=76000 ✗; Tia avg=75000 ✗
# Output: ['Arv', 'Ria']
```

**Exception Handling Trap (very common MCQ):**
```python
try:
    x = 10 / 0
except Exception:          # ← This catches FIRST (Exception is parent class)
    print("Some other error!")
except ZeroDivisionError:  # ← NEVER REACHED (parent caught it already)
    print("Division by zero error!")
# Answer: "Some other error!"
# RULE: More specific exception (ZeroDivisionError) must come BEFORE general (Exception)!

# finally ALWAYS executes:
try:
    x = 10/2
except:
    print("Error")
finally:
    print("Done")     # This ALWAYS prints regardless
```

**Random module:**
```python
import random
L = [10, 30, 50, 70]
Lower = random.randint(2, 2)   # Always returns 2
Upper = random.randint(2, 3)   # Returns 2 or 3
# If Upper=2: range(2,3) → [50]; If Upper=3: range(2,4) → [50, 70]
# Possible outputs: 50@ OR 50@70@
```

**Operator Precedence Trap:**
```python
print(10 - 3**2**2 + 144/12)
# 3**2**2 = 3**(2**2) = 3**4 = 81 (right-to-left for **)
# 10 - 81 + 12 = -59
```

**statistics module:**
```python
import statistics
statistics.median([10,20,10,30,10,20,30])
# Sorted: [10,10,10,20,20,30,30] → median is 4th value = 20 (TRUE, not False!)
```

---

### 🐍 PYTHON FUNCTIONS

**Default, Keyword, *args, **kwargs:**
```python
def greet(name, msg="Hello"):
    return f"{msg}, {name}"

# String methods (Section B favourite):
review = "good morning good"
print(review.index("good"))   # 0 (first occurrence)
review.find("good")           # Same but returns -1 if not found

L1 = [3, 1, 4, 1, 5]
L1.sort(reverse=True)         # Sort descending in-place
sorted(L1, reverse=True)      # Returns new sorted list

# partition:
text = "Learn Python with fun and practice"
print(text.partition("with"))  # ('Learn Python ', 'with', ' fun and practice')
print(text.count("a"))         # Count 'a': Lerrn(no) Python(no) with(no)... count each!
```

**Function returning modified list:**
```python
def remove_element(L, n):
    if n in L:
        L.remove(n)
    else:
        print("Element not found")
```

**Error fixing (Section B — SQP pattern):**
```python
# ORIGINAL WITH ERRORS:
define remove_first_last(str):     # ERROR: 'define' should be 'def'
    if len(str) < 2:
        return str
    new_str = str[1:-2]           # LOGICAL ERROR: should be str[1:-1]
    return new_str
result = remove_first_last("Hello")
Print("Resulting string: " result)  # ERRORS: Print→print; missing comma

# CORRECTED:
def remove_first_last(str):
    if len(str) < 2:
        return str
    new_str = str[1:-1]
    return new_str
result = remove_first_last("Hello")
print("Resulting string:", result)
```

---

### 🐍 FILE HANDLING (Section D–E — HIGH VALUE)

**TEXT FILE OPERATIONS:**
```python
# Reading
with open("Prog.txt", "r") as f:
    content = f.read()           # Entire file as string
    lines = f.readlines()        # List of lines (with \n)
    line = f.readline()          # One line at a time

# Count occurrences in text file
def count_python():
    count = 0
    with open("Prog.txt", "r") as f:
        for line in f:
            words = line.split()
            for word in words:
                if word == "Python":
                    count += 1
    return count

# Read lines not starting with vowel (SQP Section C pattern)
def read_non_vowel():
    with open("STORIES.TXT", "r") as f:
        for line in f:
            if line[0].upper() not in 'AEIOU':
                print(line, end="")
```

**BINARY FILE OPERATIONS (pickle — Section D/E every year):**
```python
import pickle

# Write/Create
with open("data.dat", "wb") as f:
    pickle.dump(record, f)

# Append
with open("data.dat", "ab") as f:
    pickle.dump(record, f)

# Read all records
def read_all():
    with open("data.dat", "rb") as f:
        while True:
            try:
                record = pickle.load(f)
                print(record)
            except EOFError:
                break

# Update a record
def update_salary(dept, new_salary):
    records = []
    with open("emp.dat", "rb") as f:
        while True:
            try:
                rec = pickle.load(f)
                records.append(rec)
            except EOFError:
                break
    with open("emp.dat", "wb") as f:
        for rec in records:
            if rec["dept"] == dept:
                rec["salary"] = new_salary
            pickle.dump(rec, f)
```

**SQP PATTERN (Section E — 5 marks — appears every year):**
```python
# Typical: Accept record + append to binary file + Update field for a condition

# Example: Employee records - append + update IT department salary
def append_employee(emp_id, name, dept, salary):
    emp = {"id": emp_id, "name": name, "dept": dept, "salary": salary}
    with open("employee.dat", "ab") as f:
        pickle.dump(emp, f)

def update_it_salary(new_salary):
    records = []
    with open("employee.dat", "rb") as f:
        while True:
            try:
                records.append(pickle.load(f))
            except EOFError:
                break
    with open("employee.dat", "wb") as f:
        for rec in records:
            if rec["dept"] == "IT":
                rec["salary"] = new_salary
            pickle.dump(rec, f)
```

**CSV FILE OPERATIONS (Section D — appears every year):**
```python
import csv

# Write to CSV
def Accept():
    with open("Sales.csv", "a", newline="") as f:
        writer = csv.writer(f)
        pid = input("Product ID: ")
        pname = input("Product Name: ")
        qty = int(input("Quantity: "))
        price = float(input("Price: "))
        writer.writerow([pid, pname, qty, price])

# Read and calculate from CSV
def CalculateTotalSales():
    total = 0
    with open("Sales.csv", "r") as f:
        reader = csv.reader(f)
        for row in reader:
            if row:  # skip empty rows
                total += int(row[2]) * float(row[3])  # qty × price
    return total
```

---

### 🐍 DATA STRUCTURES — STACK (Section C — every exam)

**Stack = List used as LIFO (Last In First Out)**

```python
# Stack template (MUST know by heart)
def Push_element(L, stack):
    for item in L:
        name, price = item
        if price > 50:
            stack.append(item)

def Pop_element(stack):
    if not stack:
        print("Stack Empty")
    else:
        while stack:
            print(stack.pop())
        print("Stack Empty")

# Usage:
L = [("Laptop", 90000), ("Mobile", 30000), ("Pen", 50), ("Headphones", 1500)]
stack = []
Push_element(L, stack)
# Stack after push: [('Laptop', 90000), ('Mobile', 30000), ('Headphones', 1500)]
# Note: Pen(50) NOT included (50 is NOT > 50)

Pop_element(stack)
# Output: ('Headphones', 1500) → ('Mobile', 30000) → ('Laptop', 90000) → Stack Empty
```

**SQP Exact Pattern:**
- Push only items WHERE price > X (check: > vs >=, often a trap!)
- Pop and display, then print "Stack Empty"
- Sometimes: push from dictionary instead of list

---

### 🐍 EXCEPTION HANDLING

```python
try:
    # code that may raise exception
except SpecificError:     # More specific first!
    # handle specific
except Exception:         # General last!
    # handle general
else:
    # runs only if NO exception
finally:
    # ALWAYS runs (with or without exception)

# Common exceptions:
# ZeroDivisionError, ValueError, TypeError, FileNotFoundError, IndexError, KeyError
# NameError, AttributeError, EOFError (end of binary file!)
```

**RULE: Specific exceptions MUST come before general Exception**
**RULE: finally ALWAYS executes — even with return/exception**

---

### 🐍 PYTHON-MYSQL CONNECTIVITY (Section D/E)

```python
import mysql.connector

# Connection
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="password",
    database="WarehouseDB"
)
cursor = conn.cursor()

# Execute query
cursor.execute("SELECT * FROM product_inventory")
data = cursor.fetchall()   # All rows as list of tuples
# cursor.fetchone()        # One row
# cursor.fetchmany(n)      # n rows

# For INSERT/UPDATE/DELETE — must commit!
cursor.execute("UPDATE product_inventory SET stock=stock-1 WHERE Item_code=101")
conn.commit()

# Display results
for row in data:
    print(row)

conn.close()
```

**SQP Pattern (Section D/E):**
- Connect to database
- Fetch records with condition
- Update/delete with condition
- Must include: fetchall() + loop to display

---

## 🗄️ SQL — COMPLETE REFERENCE

### SQL COMMANDS BY CATEGORY

**DDL (Data Definition Language):**
```sql
CREATE TABLE Students (
    RollNo INT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Marks DECIMAL(5,2)
);

ALTER TABLE Students ADD COLUMN Email VARCHAR(100);
ALTER TABLE Students DROP COLUMN Email;         -- Remove column (SQP MCQ!)
ALTER TABLE Students MODIFY Name VARCHAR(100);

DROP TABLE Students;    -- Removes entire table (structure + data)
TRUNCATE TABLE Students; -- Removes all data, keeps structure
```

**DML (Data Manipulation Language):**
```sql
INSERT INTO Students VALUES (1, 'Sahana', 95.5);
UPDATE Students SET Marks = 96 WHERE RollNo = 1;
DELETE FROM Students WHERE Marks < 40;
SELECT * FROM Students;
```

**CRITICAL SQL TRAP (SQP — appears almost every paper!):**
```sql
-- WRONG ORDER:
SELECT department, COUNT(*) FROM employees
HAVING COUNT(*) > 5
GROUP BY department;   -- HAVING must come AFTER GROUP BY!

-- CORRECT:
SELECT department, COUNT(*) FROM employees
GROUP BY department
HAVING COUNT(*) > 5;
```

### SQL FUNCTIONS

**Aggregate Functions:**
```sql
SELECT COUNT(*) FROM emp;           -- count rows
SELECT COUNT(salary) FROM emp;      -- count non-NULL salary values
SELECT SUM(salary) FROM emp;
SELECT AVG(price) FROM Sales WHERE product='Tablet';
SELECT MAX(marks), MIN(marks) FROM students;
```

**String Functions:**
```sql
UPPER(name), LOWER(name)
SUBSTRING(name, 1, 3)   -- first 3 characters
LENGTH(name)
CONCAT(first_name, ' ', last_name)
```

**Date Functions:**
```sql
NOW(), CURDATE(), YEAR(date), MONTH(date), DAY(date)
```

### SQL CLAUSES & QUERIES

```sql
-- WHERE vs HAVING: WHERE filters rows BEFORE grouping; HAVING filters AFTER grouping
SELECT dept, COUNT(*) FROM emp
WHERE salary > 50000       -- Filter rows first
GROUP BY dept
HAVING COUNT(*) > 5;       -- Then filter groups

-- ORDER BY
SELECT * FROM Sales ORDER BY product DESC;    -- Z to A
SELECT * FROM Sales ORDER BY price ASC;       -- Low to High

-- DISTINCT
SELECT DISTINCT product FROM Sales;

-- LIKE patterns
WHERE name LIKE 'S%'        -- starts with S
WHERE name LIKE '%e'        -- ends with e
WHERE name LIKE '_a%'       -- second letter is a

-- IN operator
SELECT * FROM Hotels WHERE city IN ('Mumbai', 'Chennai', 'Kolkata');

-- BETWEEN
WHERE marks BETWEEN 60 AND 80;

-- NULL handling
WHERE email IS NULL;
WHERE email IS NOT NULL;
```

### SQL JOINS

```sql
-- Cartesian Product (Cross Join)
SELECT * FROM Hotels, Bookings;
-- OR:
SELECT * FROM Hotels CROSS JOIN Bookings;

-- Equi-Join / Inner Join (most common in SQP)
SELECT c.Name, h.Hotel_name
FROM Customers c, Hotels h
WHERE c.Hotel_ID = h.Hotel_ID;
-- OR:
SELECT Customers.Name, Hotels.Hotel_name
FROM Customers INNER JOIN Hotels ON Customers.Hotel_ID = Hotels.Hotel_ID;

-- Display customers who booked in Delhi
SELECT b.Customer_name FROM Bookings b, Hotels h
WHERE b.Hotel_ID = h.Hotel_ID AND h.City = 'Delhi';
```

**Degree vs Cardinality:**
- **Degree** = number of columns (attributes)
- **Cardinality** = number of rows (tuples)
- Adding 2 columns to 5-column table → degree = 7

**Which JOIN creates duplicate columns?**
→ Natural Join and Cross Join (SQP MCQ answer!)

**Commands that change cardinality:**
→ INSERT and DELETE (add/remove rows) — SQP MCQ answer!

---

## 🌐 COMPUTER NETWORKS — COMPLETE REFERENCE

### Key Terms (Section A/B — every paper)

| Term | Definition |
|------|-----------|
| **Hub** | Broadcasts data to ALL devices in network |
| **Switch** | Sends data to SPECIFIC destination device only |
| **Router** | Connects different networks; routes data packets |
| **Gateway** | Entry/exit point between two networks; protocol conversion |
| **Modem** | Modulates digital signals to analog (and vice versa) for transmission |
| **Repeater** | Amplifies/regenerates signal over long distances |
| **Bridge** | Connects two segments of SAME network type |
| **Access Point** | Wireless LAN connection device |

### Protocols (Section A — MCQ every year)

| Protocol | Full Form | Use |
|----------|----------|-----|
| **HTTP** | Hypertext Transfer Protocol | Web browsing |
| **HTTPS** | HTTP Secure | Secure web browsing |
| **FTP** | File Transfer Protocol | Transferring files |
| **SMTP** | Simple Mail Transfer Protocol | Sending emails |
| **POP3** | Post Office Protocol 3 | **Retrieving** emails from server |
| **IMAP** | Internet Message Access Protocol | Accessing emails on server |
| **TCP/IP** | Transmission Control Protocol/Internet Protocol | Core internet protocol |
| **DNS** | Domain Name System | Converts domain names to IP addresses |
| **DHCP** | Dynamic Host Configuration Protocol | Assigns IP addresses automatically |
| **VoIP** | Voice over Internet Protocol | Voice calls over internet |

**SQP MCQ Traps:**
- Email retrieval = **POP3** (NOT SMTP — SMTP is for SENDING)
- Hub vs Switch: Hub = broadcasts to ALL; Switch = sends to SPECIFIC device only

### Network Topologies

| Topology | Advantages | Disadvantages |
|----------|-----------|---------------|
| **Star** | Easy to troubleshoot; failure of one node doesn't affect others | Central hub = single point of failure |
| **Bus** | Simple, inexpensive | Entire network down if cable breaks |
| **Ring** | Equal access; no collisions | Failure of one node = entire network fails |
| **Mesh** | Highly reliable; multiple paths | Expensive, complex |
| **Tree** | Scalable, hierarchical | Root failure affects all |

### Network Types

- **PAN** — Personal Area Network (Bluetooth, < 10m)
- **LAN** — Local Area Network (building/campus, < 1 km)
- **MAN** — Metropolitan Area Network (city, 1–100 km)
- **WAN** — Wide Area Network (countries, > 100 km)

### SQP Section E Network Problem (appears every year — 5 marks)

**Pattern:** 4 buildings with distances shown in diagram. Answer:
1. Suggest best location for server (central/most connected building)
2. Suggest placement for repeater (longest cable run > 100m)
3. Suggest efficient cable layout (minimum spanning tree)
4. Suggest technology to connect to HQ (lease line/satellite for long distance)

**Template Answer:**
1. Server: Building with most connections OR given as central building
2. Repeater: On cable run longer than 100 metres
3. Layout: Star topology with server as centre OR minimum wiring layout shown
4. HQ link: Lease Line (for high reliability) or Satellite Link (for long distance)

---

## 📌 ASSERTION-REASON PATTERNS (Section A)

**SQP Assertion-Reason traps:**

1. **Tuple append:**
   - A: (1,2,3,4).append(5) will modify original sequence
   - R: append() adds to end of list and modifies in place
   - **Answer: A is FALSE** (tuples are immutable! append() doesn't apply)

2. **Primary Key:**
   - A: Primary key must be unique and cannot have NULL values
   - R: Primary key uniquely identifies each row
   - **Answer: Both A and R true; R IS correct explanation**

---

## ⚡ RAPID FIRE POOL (Computer Science)

| Q | Answer |
|---|--------|
| Email retrieval protocol? | POP3 |
| Sends data to specific device only? | Switch (Hub sends to all) |
| Degree of a relation = ? | Number of columns |
| Cardinality of a relation = ? | Number of rows |
| finally block executes? | Always (with or without exception) |
| Remove a column from table? | ALTER TABLE ... DROP COLUMN |
| Which join creates duplicate columns? | Natural Join / Cross Join |
| statistics.median([10,20,10,30,10,20,30])? | 20 |
| pickle module used for? | Binary file handling (serialization) |
| VoIP full form? | Voice over Internet Protocol |
| Tuple is (mutable/immutable)? | Immutable |
| Exception order rule? | More specific BEFORE more general |
| Commands that change cardinality? | INSERT and DELETE |
| Protocol for sending emails? | SMTP |
| HTML is used to? | Create structure of web page |
| CSS is used to? | Style web pages |
| Stack follows? | LIFO (Last In First Out) |
| Queue follows? | FIFO (First In First Out) |
| SQL for removing entire table? | DROP TABLE |
| SQL for removing all data (keep structure)? | TRUNCATE TABLE |

---

## 🎓 ANSWER WRITING TIPS FOR SAHANA

### For Python Code Questions:
1. **Always add comments** — one line per logical step
2. Show expected output where asked
3. For file handling: always use `with open(...)` syntax
4. For binary files: always import pickle; use try-except with EOFError
5. For CSV: always `import csv`; use `newline=""` when writing

### For SQL Questions:
1. **Correct order:** SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY
2. Write SQL keywords in UPPERCASE (professional practice)
3. For joins: always specify join condition clearly
4. For aggregate + condition: use HAVING (not WHERE)

### For Network Questions:
1. Distinguish clearly: Hub=broadcast, Switch=specific, Router=between networks
2. For topology questions: state both advantage AND disadvantage
3. For protocol questions: expand abbreviation AND explain purpose

### Common Student Errors (Flag in Strengthen Mode):
- ❌ HAVING used BEFORE GROUP BY (most common SQL error!)
- ❌ Specific exception after general Exception (code becomes unreachable)
- ❌ Forgetting `newline=""` in CSV writing (creates blank lines)
- ❌ Not calling `conn.commit()` after INSERT/UPDATE/DELETE in MySQL
- ❌ Using > instead of >= (or vice versa) in stack push condition

---

*Computer Science Reference | Sahana's CBSE 12 Board Mentor System | Updated June 2026*
