// GET ELEMENTS
const form = document.querySelector(".feedback-form");
const ratingStars = document.querySelectorAll(".stars span"); //NodeList
const successMsg = document.querySelector(".success-msg");
const adminView = document.querySelector(".admin-view");
const feedbackList = document.querySelector(".feedback-list");

//Rating Logic
let selectedRating = 0;

ratingStars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = star.dataset.value;

    ratingStars.forEach((stars) => stars.classList.remove("active"));

    for (let i = 0; i < selectedRating; i++) {
      ratingStars[i].classList.add("active");
    }
    ratingError.classList.add("hidden");
  });
});

// Local Storage Helpers
function saveFeedbackToStorage(arr) {
  localStorage.setItem("submitted-feedback", JSON.stringify(arr));
}

function getFeedbackFromStorage() {
  return JSON.parse(localStorage.getItem("submitted-feedback")) || [];
}

// Render Feedback Items in Admin View
function renderFeedbackList() {
  feedbackList.innerHTML = ""; // Clear old render

  const data = getFeedbackFromStorage();

  data.forEach((item, index) => {
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

      // data.splice(index, 1);
      // saveFeedbackToStorage(data);  // It mutates the original array so we dont need to create a new one (const updated = ... ) we use data array direc
      // renderFeedbackList();
    });

    // Resolve Button
    li.querySelector(".resolve-btn").addEventListener("click", () => {
      li.classList.toggle("resolved");
    });
    feedbackList.appendChild(li);
  });
}

// CLEAR ALL BUTTON
const clearAllBtn = document.querySelector(".clear-all-btn");

clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete ALL feedbacks?")) {
    saveFeedbackToStorage([]);
    renderFeedbackList();
  }
});

// Initial load
renderFeedbackList();

// == HANDLE FORM SUBMISSION ==//
// submit event
form.addEventListener("submit", (e) => {
  e.preventDefault();
  //get form values
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const message = document.querySelector("#message").value.trim();
  // check rating
  if (selectedRating === 0) {
    ratingError.classList.remove("hidden");
    return;
  } else {
    ratingError.classList.add("hidden");
  }

  // check message
  if (message === "") {
    alert("Please enter your feedback message.");
    return;
  }

  // Create feedback object (collect data from the form)
  const feedback = {
    name,
    email,
    message,
    rating: selectedRating,
    timestamp: new Date().toISOString(),
  };

  // Save to localStorage
  const allData = getFeedbackFromStorage(); //بجيب الاراي القديم -> بضيف عليه الاوبجكت الجديد-> بحفظ الاراي الجديد في اللوكال ستوريدج
  allData.push(feedback);
  saveFeedbackToStorage(allData);

  // Show success message
  successMsg.classList.add("show");
  setTimeout(() => successMsg.classList.remove("show"), 2000);

  // Reset form fields
  form.reset();
  selectedRating = 0;
  ratingStars.forEach((star) => star.classList.remove("active"));

  // Re-render admin list
  renderFeedbackList();
});

// == ADMIN MODE TOGGLE LOGIC ==//
//pick admin toggle button
const adminSwitch = document.querySelector(".admin-toggle");
const headerTitle = document.querySelector(".widget-header h2");
const headerSubtitle = document.querySelector(".widget-header p");

// load admin mode
let isAdmin = localStorage.getItem("isAdmin") === "true";

// function to show/hide admin panel
function updateMode() {
  if (isAdmin) {
    adminView.classList.remove("hidden");
    form.classList.add("hidden");
    headerTitle.textContent = "Feedback Dashboard";
    headerSubtitle.textContent = " ";

    adminSwitch.textContent = "Admin Mode";
    adminSwitch.classList.add("admin-on");
  } else {
    adminView.classList.add("hidden");
    form.classList.remove("hidden");

    adminSwitch.textContent = "User Mode";
    adminSwitch.classList.remove("admin-on");
  }
}

// When clicking the switch button
adminSwitch.addEventListener("click", () => {
  isAdmin = !isAdmin;
  localStorage.setItem("isAdmin", isAdmin);
  updateMode();
});

// Initial load
updateMode();
