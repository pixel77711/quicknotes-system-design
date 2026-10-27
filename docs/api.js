
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.getElementById("load-btn");
const statusMessage = document.getElementById("status");
const notesList = document.getElementById("notes-list");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitBtn = document.getElementById("submit-btn");

let notes = [];
let nextId = 101;
let isLoading = false;
let isCreating = false;
const deletingIds = new Set();

// Reusable function for making API requests.
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed: HTTP ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

function setStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

function updateButtons() {
    loadBtn.disabled = isLoading || isCreating;
    submitBtn.disabled = isCreating || isLoading;
    loadBtn.textContent = isLoading ? "Loading..." : "Load Notes";
    submitBtn.textContent = isCreating ? "Creating..." : "Create Note";

    notesList.querySelectorAll(".delete-btn").forEach((button) => {
        const id = Number(button.dataset.id);
        button.disabled = isLoading || isCreating || deletingIds.has(id);
        button.textContent = deletingIds.has(id) ? "Deleting..." : "Delete";
    });
}

function renderNotes() {
    notesList.replaceChildren();

    if (notes.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No notes to display.";
        notesList.appendChild(item);
        return;
    }

    notes.forEach((note) => {
        const item = document.createElement("li");
        const title = document.createElement("h3");
        const body = document.createElement("p");
        const deleteBtn = document.createElement("button");

        title.textContent = note.title;
        body.textContent = note.body || "No note body provided.";

        deleteBtn.textContent = "Delete";
        deleteBtn.type = "button";
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.id = String(note.id);
        deleteBtn.addEventListener("click", () => deleteNote(note.id));

        item.append(title, body, deleteBtn);
        notesList.appendChild(item);
    });

    updateButtons();
}

// GET: Load the first 10 notes.
async function loadNotes() {
    if (isLoading || isCreating) return;

    isLoading = true;
    setStatus("Loading notes...", "loading");
    updateButtons();

    try {
        notes = await request(`${API_URL}?_limit=10`);
        renderNotes();

        if (notes.length === 0) {
            setStatus("No notes found.", "success");
        } else {
            setStatus(`Successfully loaded ${notes.length} notes.`, "success");
        }
    } catch (error) {
        setStatus(`Could not load notes: ${error.message}`, "error");
    } finally {
        isLoading = false;
        updateButtons();
    }
}

// POST: Create a new note.
async function createNote(event) {
    event.preventDefault();

    if (isCreating || isLoading) return;

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) {
        setStatus("Please enter a title.", "error");
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        setStatus("The title cannot exceed 100 characters.", "error");
        titleInput.focus();
        return;
    }

    isCreating = true;
    setStatus("Creating note...", "loading");
    updateButtons();

    try {
        const newNote = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        // JSONPlaceholder does not persist new posts.
        // Keep the created note in this page's local state.
        notes.unshift({
            ...newNote,
            id: nextId++,
            title: title,
            body: body
        });

        renderNotes();
        noteForm.reset();
        setStatus("Note created successfully.", "success");
    } catch (error) {
        setStatus(`Could not create note: ${error.message}`, "error");
    } finally {
        isCreating = false;
        updateButtons();
    }
}

// DELETE: Remove a note.
async function deleteNote(id) {
    if (isLoading || isCreating || deletingIds.has(id)) return;

    deletingIds.add(id);
    setStatus("Deleting note...", "loading");
    updateButtons();

    try {
        await request(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        notes = notes.filter((note) => note.id !== id);
        renderNotes();

        if (notes.length === 0) {
            setStatus("Note deleted. Your notes list is now empty.", "success");
        } else {
            setStatus("Note deleted successfully.", "success");
        }
    } catch (error) {
        setStatus(`Could not delete note: ${error.message}`, "error");
    } finally {
        deletingIds.delete(id);
        updateButtons();
    }
}

loadBtn.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);

// Show the empty state when the page first opens.
renderNotes();
