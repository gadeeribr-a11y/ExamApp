# UML Class Diagram

```text
+----------------------+
|        User          |
+----------------------+
| - id                 |
| - email              |
| - password           |
| - role               |
+----------------------+

            |
            |
            v

+----------------------+
|        Exam          |
+----------------------+
| - id                 |
| - title              |
| - startDate          |
| - status             |
| - examCode           |
| - questions[]        |
+----------------------+

            |
            | 1..*
            v

+----------------------+
|      Question        |
+----------------------+
| - id                 |
| - text               |
| - type               |
| - answers[]          |
| - correctAnswer      |
+----------------------+



+----------------------+
|    AuthService       |
+----------------------+
| + login()            |
| + register()         |
| + logout()           |
+----------------------+


+----------------------+
|   StorageService     |
+----------------------+
| + save()             |
| + load()             |
| + remove()           |
+----------------------+


+----------------------+
|    LoggerService     |
+----------------------+
| + log()              |
| + error()            |
+----------------------+


+----------------------+
|    NotifyService     |
+----------------------+
| + notify()           |
+----------------------+


+----------------------+
|    ConfigService     |
+----------------------+
| + getConfig()        |
+----------------------+


+----------------------+
|    MockDBService     |
+----------------------+
| + getUsers()         |
| + getExams()         |
| + saveExams()        |
+----------------------+



Relationships

Exam 1 ----------- * Question

MockDBService ------ User
MockDBService ------ Exam

AuthService -------- User

StorageService <---- MockDBService
LoggerService  <---- All Services
NotifyService  <---- UI Components
```
