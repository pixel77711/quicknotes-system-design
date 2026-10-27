
# QuickNotes Data Model

## 1. Entities and Columns

### Users

| Column | Type | Key |
|---|---|---|
| id | BIGINT | Primary key |
| name | VARCHAR(100) | |
| email | VARCHAR(255) | Unique |
| created_at | TIMESTAMP | |

### Notes

| Column | Type | Key |
|---|---|---|
| id | BIGINT | Primary key |
| user_id | BIGINT | Foreign key to users.id |
| title | VARCHAR(100) | Required |
| body | TEXT | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### Tags

| Column | Type | Key |
|---|---|---|
| id | BIGINT | Primary key |
| name | VARCHAR(50) | Unique |

### Note_Tags

| Column | Type | Key |
|---|---|---|
| note_id | BIGINT | Primary key and foreign key |
| tag_id | BIGINT | Primary key and foreign key |

## 2. Relationships

- One user can own many notes (one-to-many).
- Each note belongs to one user.
- One note can have many tags.
- One tag can be attached to many notes.
- The note_tags junction table implements the many-to-many relationship.

## 3. CREATE TABLE Statements

```sql
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    body TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE note_tags (
    note_id BIGINT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);
```

## 4. Example SQL Queries

### Query 1: List all notes

```sql
SELECT id, title, body
FROM notes
ORDER BY created_at DESC;
```

### Query 2: Find notes belonging to a user

```sql
SELECT id, title, body
FROM notes
WHERE user_id = 1;
```

### Query 3: JOIN notes to users

```sql
SELECT users.name, notes.title
FROM users
JOIN notes ON users.id = notes.user_id;
```

### Query 4: Find notes with their tags

```sql
SELECT notes.title, tags.name
FROM notes
JOIN note_tags ON notes.id = note_tags.note_id
JOIN tags ON note_tags.tag_id = tags.id;
```

## 5. Index

```sql
CREATE INDEX idx_notes_user_created
ON notes (user_id, created_at DESC);
```

This index helps retrieve a user's notes in date order without scanning every note.

The primary key on note_tags also supports lookups beginning with note_id.

## 6. SQL or NoSQL?

I would choose a relational SQL database such as PostgreSQL. Users, notes and tags have clear relationships, and foreign keys protect data integrity. SQL supports joins, transactions and structured queries. A NoSQL database could be useful for a different workload, but SQL is a strong starting choice for this application's relational data.
