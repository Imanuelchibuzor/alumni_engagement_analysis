// Data structure to hold counts
let data = {
  lackEngaging: 0,
  engagedOther: 0,
  noData: 0,
  deviceIssues: 0,
  noResponse: 0,
  total: 0,
};

// Action history to enable undo
let actionHistory = [];

// DOM elements
const elements = {
  buttons: {
    lackEngaging: document.getElementById("lackEngaging"),
    engagedOther: document.getElementById("engagedOther"),
    noData: document.getElementById("noData"),
    deviceIssues: document.getElementById("deviceIssues"),
    noResponse: document.getElementById("noResponse"),
    resetStats: document.getElementById("resetStats"),
    undoAction: document.getElementById("undoAction"),
  },
  counts: {
    totalResponses: document.getElementById("totalResponses"),
    lackEngaging: document.getElementById("countLackEngaging"),
    engagedOther: document.getElementById("countEngagedOther"),
    noData: document.getElementById("countNoData"),
    deviceIssues: document.getElementById("countDeviceIssues"),
    noResponse: document.getElementById("countNoResponse"),
  },
  percents: {
    lackEngaging: document.getElementById("percentLackEngaging"),
    engagedOther: document.getElementById("percentEngagedOther"),
    noData: document.getElementById("percentNoData"),
    deviceIssues: document.getElementById("percentDeviceIssues"),
    noResponse: document.getElementById("percentNoResponse"),
  },
  progress: {
    lackEngaging: document.getElementById("progressLackEngaging"),
    engagedOther: document.getElementById("progressEngagedOther"),
    noData: document.getElementById("progressNoData"),
    deviceIssues: document.getElementById("progressDeviceIssues"),
    noResponse: document.getElementById("progressNoResponse"),
  },
  bars: {
    lackEngaging: document.getElementById("barLackEngaging"),
    engagedOther: document.getElementById("barEngagedOther"),
    noData: document.getElementById("barNoData"),
    deviceIssues: document.getElementById("barDeviceIssues"),
    noResponse: document.getElementById("barNoResponse"),
  },
};

// Load data from local storage if available
function loadData() {
  const savedData = localStorage.getItem("alumniEngagementData");
  const savedHistory = localStorage.getItem("alumniEngagementHistory");

  if (savedData) {
    data = JSON.parse(savedData);
    updateStats();
    updateVisualization();
  }

  if (savedHistory) {
    actionHistory = JSON.parse(savedHistory);
    updateUndoButton();
  }
}

// Save data to local storage
function saveData() {
  localStorage.setItem("alumniEngagementData", JSON.stringify(data));
  localStorage.setItem(
    "alumniEngagementHistory",
    JSON.stringify(actionHistory)
  );
}

// Function to update statistics displayed on the page
function updateStats() {
  const total = data.total;
  const percent = (count) =>
    total > 0 ? ((count / total) * 100).toFixed(1) : 0;

  // Update counts
  elements.counts.totalResponses.textContent = total;
  elements.counts.lackEngaging.textContent = data.lackEngaging;
  elements.counts.engagedOther.textContent = data.engagedOther;
  elements.counts.noData.textContent = data.noData;
  elements.counts.deviceIssues.textContent = data.deviceIssues;
  elements.counts.noResponse.textContent = data.noResponse;

  // Update percentages
  elements.percents.lackEngaging.textContent = percent(data.lackEngaging);
  elements.percents.engagedOther.textContent = percent(data.engagedOther);
  elements.percents.noData.textContent = percent(data.noData);
  elements.percents.deviceIssues.textContent = percent(data.deviceIssues);
  elements.percents.noResponse.textContent = percent(data.noResponse);

  // Update progress bars
  elements.progress.lackEngaging.style.width = `${percent(data.lackEngaging)}%`;
  elements.progress.engagedOther.style.width = `${percent(data.engagedOther)}%`;
  elements.progress.noData.style.width = `${percent(data.noData)}%`;
  elements.progress.deviceIssues.style.width = `${percent(data.deviceIssues)}%`;
  elements.progress.noResponse.style.width = `${percent(data.noResponse)}%`;
}

// Function to update the visualization
function updateVisualization() {
  const total = data.total;
  const percent = (count) => (total > 0 ? (count / total) * 100 : 0);

  // Update chart bars
  elements.bars.lackEngaging.style.height = `${percent(data.lackEngaging)}%`;
  elements.bars.engagedOther.style.height = `${percent(data.engagedOther)}%`;
  elements.bars.noData.style.height = `${percent(data.noData)}%`;
  elements.bars.deviceIssues.style.height = `${percent(data.deviceIssues)}%`;
  elements.bars.noResponse.style.height = `${percent(data.noResponse)}%`;
}

// Update the undo button state
function updateUndoButton() {
  const undoButton = elements.buttons.undoAction;
  if (actionHistory.length > 0) {
    undoButton.disabled = false;

    // Update tooltip to show what will be undone
    const lastAction = actionHistory[actionHistory.length - 1];
    const categoryName = getCategoryDisplayName(lastAction);
    undoButton.title = `Undo last action: ${categoryName}`;
  } else {
    undoButton.disabled = true;
    undoButton.title = "Nothing to undo";
  }
}

// Get display name for a category
function getCategoryDisplayName(category) {
  const displayNames = {
    lackEngaging: "Lack of Engaging Content",
    engagedOther: "Engaged with Other Activities",
    noData: "No Data",
    deviceIssues: "Device Issues",
    noResponse: "No Response",
  };

  return displayNames[category] || category;
}

// Handler to record a response and update the stats
function recordResponse(category) {
  // Add visual feedback for button click
  const button = elements.buttons[category];
  button.classList.add("clicked");

  // Update data
  data[category]++;
  data.total++;

  // Add to action history
  actionHistory.push(category);

  // Update UI
  updateStats();
  updateVisualization();
  updateUndoButton();
  saveData();

  // Remove visual feedback after animation
  setTimeout(() => {
    button.classList.remove("clicked");
  }, 300);
}

// Undo the last action
function undoLastAction() {
  if (actionHistory.length === 0) return;

  // Get the last action
  const lastAction = actionHistory.pop();

  // Update data
  data[lastAction]--;
  data.total--;

  // Update UI
  updateStats();
  updateVisualization();
  updateUndoButton();
  saveData();

  // Add visual feedback
  const undoButton = elements.buttons.undoAction;
  undoButton.classList.add("clicked");

  // Show toast notification
  showToast(`Undid: ${getCategoryDisplayName(lastAction)}`);

  // Remove visual feedback after animation
  setTimeout(() => {
    undoButton.classList.remove("clicked");
  }, 300);
}

// Show a toast notification
function showToast(message) {
  // Create toast element if it doesn't exist
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);

    // Add toast styles
    const style = document.createElement("style");
    style.textContent = `
      #toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      #toast.show {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  // Set message and show toast
  toast.textContent = message;
  toast.classList.add("show");

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Reset all statistics
function resetStats() {
  if (
    confirm(
      "Are you sure you want to reset all statistics? This action cannot be undone."
    )
  ) {
    data = {
      lackEngaging: 0,
      engagedOther: 0,
      noData: 0,
      deviceIssues: 0,
      noResponse: 0,
      total: 0,
    };

    // Clear action history
    actionHistory = [];

    updateStats();
    updateVisualization();
    updateUndoButton();
    saveData();

    // Show confirmation message
    showToast("Statistics have been reset successfully.");
  }
}

// Add event listeners to each button
elements.buttons.lackEngaging.addEventListener("click", () =>
  recordResponse("lackEngaging")
);
elements.buttons.engagedOther.addEventListener("click", () =>
  recordResponse("engagedOther")
);
elements.buttons.noData.addEventListener("click", () =>
  recordResponse("noData")
);
elements.buttons.deviceIssues.addEventListener("click", () =>
  recordResponse("deviceIssues")
);
elements.buttons.noResponse.addEventListener("click", () =>
  recordResponse("noResponse")
);
elements.buttons.resetStats.addEventListener("click", resetStats);
elements.buttons.undoAction.addEventListener("click", undoLastAction);

// Add button click animation styles
document.head.insertAdjacentHTML(
  "beforeend",
  `
  <style>
    .btn.clicked, .undo-btn.clicked, .reset-btn.clicked {
      transform: scale(0.95);
      opacity: 0.8;
    }
  </style>
`
);

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  loadData();
});
