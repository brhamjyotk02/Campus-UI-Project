export const assignmentsData = [
  {
    id: 1,
    title: "Java OOP Assignment",
    subject: "Java",
    dueDate: "2026-09-10",
    priority: "High",
    status: "Pending",
    description: "Build a small Java program using classes, constructors and inheritance.",
    instructions: [
      "Create Student and Person classes.",
      "Use constructors and encapsulation.",
      "Demonstrate inheritance.",
      "Handle one invalid input using exception handling."
    ],
    marks: 10
  },
  {
    id: 2,
    title: "CPU Scheduling Worksheet",
    subject: "Operating Systems",
    dueDate: "2026-09-12",
    priority: "Medium",
    status: "Pending",
    description: "Solve FCFS and SJF scheduling problems and calculate waiting time.",
    instructions: [
      "Draw the Gantt chart.",
      "Calculate waiting time.",
      "Calculate turnaround time.",
      "Compare FCFS and SJF."
    ],
    marks: 10
  },
  {
    id: 3,
    title: "SQL Normalization Practice",
    subject: "DBMS",
    dueDate: "2026-09-06",
    priority: "High",
    status: "Pending",
    description: "Convert an unnormalized relation into 1NF, 2NF and 3NF.",
    instructions: [
      "Identify functional dependencies.",
      "Find candidate keys.",
      "Remove partial dependency.",
      "Remove transitive dependency."
    ],
    marks: 10
  },
  {
    id: 4,
    title: "Environmental Impact Report",
    subject: "EVS",
    dueDate: "2026-09-18",
    priority: "Low",
    status: "Submitted",
    description: "Prepare a short report on a local environmental issue.",
    instructions: [
      "Write the problem statement.",
      "Add causes and effects.",
      "Suggest practical solutions."
    ],
    marks: 10
  },
  {
    id: 5,
    title: "Exception Handling Lab",
    subject: "Java",
    dueDate: "2026-09-20",
    priority: "Medium",
    status: "Submitted",
    description: "Implement try-catch, finally and custom input validation.",
    instructions: [
      "Use try-catch.",
      "Show finally execution.",
      "Handle an invalid number input."
    ],
    marks: 10
  },
  {
    id: 6,
    title: "Process Management Questions",
    subject: "Operating Systems",
    dueDate: "2026-09-23",
    priority: "Medium",
    status: "Pending",
    description: "Practice fork(), exec(), wait() and process states.",
    instructions: [
      "Explain process creation.",
      "Differentiate fork and exec.",
      "Explain parent-child relationship."
    ],
    marks: 10
  }
];

export const notesData = [
  {
    id: 1,
    subject: "Java",
    icon: "☕",
    title: "Classes & Objects",
    folder: "OOP Concepts",
    description: "Blueprints, objects, constructors, fields and methods.",
    tags: ["class", "object", "constructor"],
    readTime: "7 min",
    content: {
      overview: "A class is a blueprint that defines data and behaviour. An object is an instance created from that class.",
      sections: [
        {
          heading: "1. What is a Class?",
          text: "A class groups related data and methods into one unit. It describes what an object will contain and what it can do.",
          code: "class Student {\\n    String name;\\n    int marks;\\n\\n    void display() {\\n        System.out.println(name);\\n    }\\n}"
        },
        {
          heading: "2. What is an Object?",
          text: "An object is a real instance of a class. The new keyword allocates memory and creates the object.",
          code: "Student s1 = new Student();\\ns1.name = \"Rahul\";"
        },
        {
          heading: "3. Constructor",
          text: "A constructor initializes an object. It has the same name as the class and does not have a return type.",
          code: "Student(String name, int marks) {\\n    this.name = name;\\n    this.marks = marks;\\n}"
        },
        {
          heading: "4. Class vs Object",
          text: "Class is the blueprint; object is the instance. One class can create many objects, each with its own state."
        }
      ],
      keyPoints: [
        "Class = blueprint.",
        "Object = instance of a class.",
        "new is commonly used to create objects.",
        "Constructor initializes object state.",
        "this refers to the current object."
      ],
      viva: [
        "What is a class?",
        "What is an object?",
        "What is the difference between class and object?",
        "Why does a constructor not have a return type?",
        "What is the use of this keyword?"
      ],
      quickRevision: "Class defines properties and behaviour. Object is its instance. Constructor initializes the object. this refers to the current object."
    }
  },
  {
    id: 2,
    subject: "Java",
    icon: "☕",
    title: "Inheritance",
    folder: "OOP Concepts",
    description: "Parent-child relationship, extends keyword and method reuse.",
    tags: ["inheritance", "extends", "oop"],
    readTime: "8 min",
    content: {
      overview: "Inheritance allows a child class to reuse accessible fields and methods of a parent class.",
      sections: [
        {
          heading: "1. Basic Inheritance",
          text: "A child class uses extends to inherit from a parent class.",
          code: "class Person {\\n    void speak() {\\n        System.out.println(\"Hello\");\\n    }\\n}\\n\\nclass Student extends Person {\\n    void study() {\\n        System.out.println(\"Studying\");\\n    }\\n}"
        },
        {
          heading: "2. Why Use Inheritance?",
          text: "It improves code reuse and models an is-a relationship. Student is a Person, so Student can inherit suitable behaviour from Person."
        },
        {
          heading: "3. Method Overriding",
          text: "A child class can provide its own version of an inherited method. This is called method overriding."
        }
      ],
      keyPoints: [
        "extends is used for class inheritance.",
        "Inheritance supports code reuse.",
        "Child class can override methods.",
        "Java classes support single, multilevel and hierarchical inheritance.",
        "Multiple inheritance through classes is not supported."
      ],
      viva: [
        "What is inheritance?",
        "Which keyword is used for inheritance?",
        "What is method overriding?",
        "Does Java support multiple inheritance using classes?",
        "What is an is-a relationship?"
      ],
      quickRevision: "Inheritance = reusing parent behaviour in a child class. Use extends. Overriding lets the child change inherited method behaviour."
    }
  },
  {
    id: 3,
    subject: "Java",
    icon: "☕",
    title: "Exception Handling",
    folder: "OOP Concepts",
    description: "try, catch, finally, throw and throws with practical examples.",
    tags: ["exception", "try", "catch", "finally"],
    readTime: "9 min",
    content: {
      overview: "Exception handling lets a program respond to abnormal situations without crashing unexpectedly.",
      sections: [
        {
          heading: "1. try and catch",
          text: "Risky code is placed in try. If an exception occurs, a matching catch block can handle it.",
          code: "try {\\n    int x = 10 / 0;\\n} catch (ArithmeticException e) {\\n    System.out.println(\"Cannot divide by zero\");\\n}"
        },
        {
          heading: "2. finally",
          text: "finally normally runs after try/catch and is useful for cleanup work."
        },
        {
          heading: "3. throw and throws",
          text: "throw explicitly creates an exception. throws declares that a method may pass an exception to its caller."
        }
      ],
      keyPoints: [
        "try contains risky code.",
        "catch handles an exception.",
        "finally is used for cleanup.",
        "throw explicitly throws an exception.",
        "throws declares possible exceptions."
      ],
      viva: [
        "What is an exception?",
        "Difference between throw and throws?",
        "Why do we use finally?",
        "Can we have multiple catch blocks?",
        "What happens when no matching catch is found?"
      ],
      quickRevision: "try = risky code, catch = handling, finally = cleanup, throw = explicitly create exception, throws = declare possible exception."
    }
  },
  {
    id: 4,
    subject: "Operating Systems",
    icon: "💻",
    title: "CPU Scheduling",
    folder: "Process Management",
    description: "FCFS, SJF, waiting time, turnaround time and Gantt charts.",
    tags: ["fcfs", "sjf", "scheduling"],
    readTime: "10 min",
    content: {
      overview: "CPU scheduling decides which ready process gets the CPU next.",
      sections: [
        {
          heading: "1. FCFS",
          text: "First Come First Serve executes processes in their arrival order. It is simple but can suffer from the convoy effect."
        },
        {
          heading: "2. SJF",
          text: "Shortest Job First selects the process with the shortest CPU burst. It can reduce average waiting time when burst lengths are known."
        },
        {
          heading: "3. Important Formulas",
          text: "Turnaround Time = Completion Time - Arrival Time. Waiting Time = Turnaround Time - Burst Time."
        }
      ],
      keyPoints: [
        "FCFS follows arrival order.",
        "SJF selects the shortest burst.",
        "Waiting time measures time spent waiting.",
        "Turnaround time measures total time from arrival to completion."
      ],
      viva: [
        "What is CPU scheduling?",
        "What is convoy effect?",
        "Which algorithm generally gives lower average waiting time: FCFS or SJF?",
        "What is waiting time?",
        "What is turnaround time?"
      ],
      quickRevision: "FCFS follows arrival order. SJF chooses the shortest burst. TAT = CT - AT. WT = TAT - BT."
    }
  },
  {
    id: 5,
    subject: "DBMS",
    icon: "🗄️",
    title: "Normalization",
    folder: "Database Design",
    description: "1NF, 2NF, 3NF, keys and functional dependencies.",
    tags: ["1nf", "2nf", "3nf", "normalization"],
    readTime: "11 min",
    content: {
      overview: "Normalization organizes relational data to reduce redundancy and update anomalies.",
      sections: [
        {
          heading: "1. First Normal Form (1NF)",
          text: "A relation should contain atomic values and should not have repeating groups."
        },
        {
          heading: "2. Second Normal Form (2NF)",
          text: "A table in 2NF is in 1NF and has no partial dependency of a non-key attribute on part of a composite key."
        },
        {
          heading: "3. Third Normal Form (3NF)",
          text: "A table in 3NF is in 2NF and has no transitive dependency of a non-key attribute on another non-key attribute."
        }
      ],
      keyPoints: [
        "Normalization reduces redundancy.",
        "1NF requires atomic values.",
        "2NF removes partial dependency.",
        "3NF removes transitive dependency."
      ],
      viva: [
        "What is normalization?",
        "What is 1NF?",
        "What is partial dependency?",
        "What is transitive dependency?",
        "Why is normalization useful?"
      ],
      quickRevision: "1NF = atomic values. 2NF = remove partial dependency. 3NF = remove transitive dependency."
    }
  },
  {
    id: 6,
    subject: "DBMS",
    icon: "🗄️",
    title: "SQL Basics",
    folder: "SQL",
    description: "SELECT, WHERE, ORDER BY, GROUP BY and basic aggregate functions.",
    tags: ["sql", "select", "query"],
    readTime: "8 min",
    content: {
      overview: "SQL is used to create, read, update and manage relational database data.",
      sections: [
        {
          heading: "1. SELECT",
          text: "SELECT retrieves columns from one or more tables.",
          code: "SELECT ename, esal\\nFROM employee;"
        },
        {
          heading: "2. WHERE",
          text: "WHERE filters rows according to a condition.",
          code: "SELECT *\\nFROM employee\\nWHERE esal > 50000;"
        },
        {
          heading: "3. Aggregate Functions",
          text: "COUNT, SUM, AVG, MIN and MAX summarize groups of rows."
        }
      ],
      keyPoints: [
        "SELECT reads data.",
        "WHERE filters rows.",
        "ORDER BY sorts results.",
        "GROUP BY creates groups for aggregation."
      ],
      viva: [
        "What is SQL?",
        "Difference between WHERE and GROUP BY?",
        "What does COUNT do?",
        "What is the purpose of ORDER BY?"
      ],
      quickRevision: "SELECT retrieves, WHERE filters, ORDER BY sorts, GROUP BY groups and aggregate functions summarize."
    }
  },
  {
    id: 7,
    subject: "Operating Systems",
    icon: "💻",
    title: "Process System Calls",
    folder: "Process Management",
    description: "fork, exec and wait with parent-child process concepts.",
    tags: ["fork", "exec", "wait", "process"],
    readTime: "9 min",
    content: {
      overview: "System calls provide a controlled way for programs to request services from the operating system.",
      sections: [
        {
          heading: "1. fork()",
          text: "fork creates a new process. The existing process is called the parent and the new process is the child."
        },
        {
          heading: "2. exec()",
          text: "The exec family replaces the current process image with another program."
        },
        {
          heading: "3. wait()",
          text: "wait allows a parent process to wait for a child process to finish."
        }
      ],
      keyPoints: [
        "fork creates a process.",
        "exec replaces the process program image.",
        "wait synchronizes a parent with child completion."
      ],
      viva: [
        "What does fork do?",
        "Difference between fork and exec?",
        "Why is wait used?",
        "What is a parent process?",
        "What is a child process?"
      ],
      quickRevision: "fork creates; exec replaces the running program; wait lets the parent wait for a child."
    }
  }
];