# ExamApp Entity Relationship Diagram (ERD)

![ExamApp ERD](diagrams/ExamApp_ERD.svg)

## Physical SQLite schema

This is the schema that is physically stored in SQLite.

```mermaid
erDiagram
    USERS ||--o{ EXAMS : "owns through ownerId"

    USERS {
        INTEGER id PK
        TEXT email UK
        TEXT passwordHash
        TEXT name
        TEXT role
        TEXT createdAt
    }

    EXAMS {
        INTEGER id PK
        TEXT title
        TEXT status
        TEXT startDate
        INTEGER durationMinutes
        TEXT examCode
        TEXT questions
        INTEGER submitted
        TEXT submittedAnswers
        TEXT grade
        INTEGER ownerId FK
        TEXT submissions
    }
```

```sql
CREATE TABLE users (
  id           INTEGER PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  name         TEXT NOT NULL DEFAULT '',
  role         TEXT NOT NULL DEFAULT 'student',
  createdAt    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exams (
  id              INTEGER PRIMARY KEY,
  title           TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'Draft',
  startDate       TEXT NOT NULL DEFAULT '',
  durationMinutes INTEGER NOT NULL DEFAULT 30,
  examCode        TEXT,
  questions       TEXT NOT NULL DEFAULT '[]',
  submitted       INTEGER NOT NULL DEFAULT 0,
  submittedAnswers TEXT NOT NULL DEFAULT '[]',
  grade           TEXT,
  ownerId         INTEGER,
  submissions     TEXT NOT NULL DEFAULT '[]',
  FOREIGN KEY (ownerId) REFERENCES users(id)
);
```

## Logical submission relationship

```mermaid
erDiagram
    USERS ||--o{ EXAMS : creates
    USERS ||--o{ SUBMISSIONS : makes
    EXAMS ||--o{ SUBMISSIONS : receives

    USERS {
        INTEGER id PK
        TEXT name
        TEXT email UK
        TEXT passwordHash
        TEXT role
        TEXT createdAt
    }

    EXAMS {
        INTEGER id PK
        TEXT title
        TEXT status
        TEXT startDate
        INTEGER durationMinutes
        TEXT examCode
        INTEGER ownerId FK
        JSON questions
        JSON submissions
    }

    SUBMISSIONS {
        INTEGER id PK
        INTEGER studentId FK
        TEXT studentName
        TEXT studentEmail
        JSON submittedAnswers
        TEXT submittedAt
        NUMBER grade
    }
```

## Relationship explanation

- One **teacher** user can create many exams through `EXAMS.ownerId`.
- One **student** user can create many submissions through `SUBMISSIONS.studentId`.
- One exam can receive many submissions, one per student.
- A submission belongs to exactly one student and one exam.

## Implementation note

The current SQLite schema persists `USERS` and `EXAMS` as tables. `SUBMISSIONS` is represented as objects inside the `EXAMS.submissions` JSON column rather than as a standalone table. It is shown as an entity in this ERD to clearly document the logical relationship model used by the application.

The `questions` field is similarly stored as a JSON array in the `EXAMS` table because questions are retrieved and saved together with their parent exam.
