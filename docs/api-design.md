
# QuickNotes API Design

## Overview

QuickNotes uses a REST API. Resources are represented as JSON.
The base URL is `/api/v1`.

## REST Endpoints

| Method | Path | Description | Success status |
|---|---|---|---|
| GET | /api/v1/notes | List notes | 200 OK |
| GET | /api/v1/notes/{id} | Retrieve one note | 200 OK |
| POST | /api/v1/notes | Create a note | 201 Created |
| PUT | /api/v1/notes/{id} | Replace a note | 200 OK |
| PATCH | /api/v1/notes/{id} | Update selected note fields | 200 OK |
| DELETE | /api/v1/notes/{id} | Delete a note | 204 No Content |
| GET | /api/v1/tags | List available tags | 200 OK |
| POST | /api/v1/notes/{id}/tags | Attach tags to a note | 200 OK |

## Create a Note

Request:

POST /api/v1/notes

Content-Type: application/json

```json
{
  "title": "Biology revision",
  "body": "Revise cells and organelles",
  "tagIds": [1, 2]
}
```

Response: 201 Created

```json
{
  "id": 101,
  "userId": 1,
  "title": "Biology revision",
  "body": "Revise cells and organelles",
  "tags": [
    {"id": 1, "name": "School"},
    {"id": 2, "name": "Revision"}
  ],
  "createdAt": "2026-10-27T10:00:00Z",
  "updatedAt": "2026-10-27T10:00:00Z"
}
```

## List Notes

Request:

GET /api/v1/notes?limit=10&offset=0

Response: 200 OK

```json
{
  "data": [
    {
      "id": 101,
      "userId": 1,
      "title": "Biology revision",
      "body": "Revise cells and organelles"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 1
  }
}
```

## Error Status Codes

| Status | Meaning |
|---|---|
| 400 | Bad Request: invalid input |
| 401 | Unauthorized: authentication required |
| 403 | Forbidden: insufficient permission |
| 404 | Not Found: resource does not exist |
| 409 | Conflict: duplicate or conflicting data |
| 422 | Unprocessable Content: validation failure |
| 429 | Too Many Requests: rate limit exceeded |
| 500 | Internal Server Error |

Example error response:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The title field is required.",
    "details": {
      "field": "title"
    }
  }
}
```

## Design Principles

- Use nouns for resource paths.
- Use HTTP methods to describe actions.
- Return JSON for resource data and errors.
- Validate all input on the server.
- Authenticate users and authorize access to their notes.
- Use pagination for large collections.
