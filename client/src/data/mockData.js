export const users = [
  {
    id: 1,
    email: "teacher@exam.com",
    password: "1234",
    role: "teacher",
  },
  {
    id: 2,
    email: "student@exam.com",
    password: "1234",
    role: "student",
  },
];
export const exams = [
  {
    id: 1,
    title: "React Basics",
    date: "2026-06-20",
    status: "Published",
    ownerId: 1,
    duration: 60,
    published: true,
    questions: [
      {
        id: 1,
        text: "What is React?",
        type: "Multiple Choice",
        options: [
          "Library",
          "Database",
          "Operating System",
          "Programming Language"
        ],
        correctAnswer: "Library",
        points: 10,
      },
      {
        id: 2,
        text: "Explain the Virtual DOM.",
        type: "Open",
        points: 20,
      },
    ],
  },
];

