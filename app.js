// GET ELEMENTS

const form = document.querySelector("#feedbackForm");
const ratingStars = document.querySelectorAll("#ratingStars span");
const successMsg = document.querySelector("#successMsg");
const feedbackList = document.querySelector("#feedbackList");
const adminView = document.querySelector("#adminView");

// ===============================
// STAR RATING LOGIC
// ===============================
let selectedRating = 0;

ratingStars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = star.dataset.value;

    // Remove active from all
    ratingStars.forEach((s) => s.classList.remove("active"));

    // Add active up to selected
    for (let i = 0; i < selectedRating; i++) {
      ratingStars[i].classList.add("active");
    }
  });
});

// ===============================
// LOCAL STORAGE HELPERS
// ===============================
function getFeedbackFromStorage() {
  return JSON.parse(localStorage.getItem("planktor_feedback")) || [];
}

function saveFeedbackToStorage(arr) {
  localStorage.setItem("planktor_feedback", JSON.stringify(arr));
}

// ===============================
// RENDER FEEDBACK ITEMS IN ADMIN VIEW
// ===============================
function renderFeedbackList() {
  feedbackList.innerHTML = ""; // Clear old render

  const data = getFeedbackFromStorage();

  data.forEach((item, index) => {
    // Create LI
    const li = document.createElement("li");
    li.classList.add("feedback-item");

    // TEXT CONTENT
    li.innerHTML = `
      <div>
        <strong>${item.name || "Anonymous"}</strong>
        <p>⭐ ${item.rating}</p>
        <p>${item.message}</p>
      </div>

      <div class="feedback-actions">
        <button class="resolve-btn" title="Mark as resolved">✔</button>
        <button class="delete-btn" title="Delete">🗑</button>
      </div>
    `;

    // DELETE BUTTON
    li.querySelector(".delete-btn").addEventListener("click", () => {
      const updated = data.filter((_, i) => i !== index);
      saveFeedbackToStorage(updated);
      renderFeedbackList();
    });

    // RESOLVE BUTTON
    li.querySelector(".resolve-btn").addEventListener("click", () => {
      li.style.opacity = 0.3;
      li.style.textDecoration = "line-through";
    });
    feedbackList.appendChild(li);
  });
}

// CLEAR ALL BUTTON
const clearAllBtn = document.querySelector("#clearAllBtn");

clearAllBtn.addEventListener("click", () => {
  const confirmDelete = confirm(
    "Are you sure you want to delete all feedback?"
  );

  if (confirmDelete) {
    saveFeedbackToStorage([]); // clear all data
    renderFeedbackList(); // refresh UI
  }
});

// Initial load
renderFeedbackList();

// ===============================
// HANDLE FORM SUBMISSION
// ===============================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const message = document.querySelector("#message").value.trim();

  if (selectedRating == 0) {
    ratingError.classList.remove("hidden");
    return;
  } else {
    ratingError.classList.add("hidden");
  }

  if (message === "") {
    alert("Feedback message is required.");
    return;
  }

  // Create feedback object
  const feedback = {
    name,
    email,
    rating: selectedRating,
    message,
    timestamp: Date.now(),
  };

  // Save to localStorage
  const existing = getFeedbackFromStorage();
  existing.push(feedback);
  saveFeedbackToStorage(existing);

  // Show success message
  successMsg.classList.add("show");
  setTimeout(() => successMsg.classList.remove("show"), 2000);

  // Reset form fields
  form.reset();
  selectedRating = 0;
  ratingStars.forEach((s) => s.classList.remove("active"));

  // Re-render admin list
  renderFeedbackList();
});

// ===============================
// ADMIN MODE TOGGLE LOGIC
// ===============================

const adminSwitch = document.querySelector("#adminSwitch");

// load admin mode
let isAdmin = localStorage.getItem("isAdmin") === "true";

// function to show/hide admin panel
function updateAdminView() {
  if (isAdmin) {
    adminView.classList.remove("hidden");
    form.classList.add("hidden");

    adminSwitch.textContent = "Admin Mode: ON";
    adminSwitch.classList.add("admin-on");
  } else {
    // Hide admin panel
    adminView.classList.add("hidden");

    // Show form for users
    form.classList.remove("hidden");

    // Update button UI
    adminSwitch.textContent = "Admin Mode: OFF";
    adminSwitch.classList.remove("admin-on");
  }
}

// When clicking the switch button
adminSwitch.addEventListener("click", () => {
  // flip the value
  isAdmin = !isAdmin;

  // save new value
  localStorage.setItem("isAdmin", isAdmin);

  // update the UI
  updateAdminView();
});

// Run at page load
updateAdminView();
