// API URL
const apiUrl = "https://66e0208b2fb67ac16f286fb6.mockapi.io/api/Income-Expense";

// Form Elements
const form = document.getElementById("entry-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const incomeRadio = document.getElementById("income");
const expenseRadio = document.getElementById("expense");
const entriesList = document.getElementById("entries-list");

// Modal Elements for Editing
const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-entry-form");
const editDescriptionInput = document.getElementById("edit-description");
const editAmountInput = document.getElementById("edit-amount");
const editIncomeRadio = document.getElementById("edit-income");
const editExpenseRadio = document.getElementById("edit-expense");
let currentEditId = null;

// Summary Elements
const totalIncomeElem = document.getElementById("total-income");
const totalExpenseElem = document.getElementById("total-expense");
const netBalanceElem = document.getElementById("net-balance");

// Filter Buttons
const allFilterBtn = document.getElementById("all-filter");
const incomeFilterBtn = document.getElementById("income-filter");
const expenseFilterBtn = document.getElementById("expense-filter");

// Fetch and Render Entries
async function fetchAndRenderEntries() {
  const response = await fetch(apiUrl);
  const entries = await response.json();
  renderEntries(entries);
  updateSummary(entries);
}

// Render Entries in Table
function renderEntries(entries) {
  entriesList.innerHTML = ""; // Clear existing entries

  entries.forEach((entry) => {
    const entryRow = document.createElement("tr");

    entryRow.innerHTML = `
            <td class="p-4">${entry.description}</td>
            <td class="p-4">₹${entry.amount}</td>
            <td class="p-4">${
              entry.type === "income" ? "Income" : "Expense"
            }</td>
            <td class="p-4 flex space-x-4">
                <button class="bg-blue-500 text-white p-2 rounded-md" onclick="editEntry('${
                  entry.id
                }')">Edit</button>
                <button class="bg-red-500 text-white p-2 rounded-md" onclick="deleteEntry('${
                  entry.id
                }')">Delete</button>
            </td>
        `;
    entriesList.appendChild(entryRow);
  });
}

// Add New Entry
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newEntry = {
    description: descriptionInput.value,
    amount: parseFloat(amountInput.value),
    type: incomeRadio.checked ? "income" : "expense",
  };

  await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newEntry),
  });

  form.reset(); // Clear form
  fetchAndRenderEntries(); // Refresh entries
});

// Edit Entry
function editEntry(id) {
  currentEditId = id;
  fetch(`${apiUrl}/${id}`)
    .then((response) => response.json())
    .then((data) => {
      editDescriptionInput.value = data.description;
      editAmountInput.value = data.amount;
      if (data.type === "income") {
        editIncomeRadio.checked = true;
      } else {
        editExpenseRadio.checked = true;
      }
      editModal.classList.remove("hidden");
    });
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedEntry = {
    description: editDescriptionInput.value,
    amount: parseFloat(editAmountInput.value),
    type: editIncomeRadio.checked ? "income" : "expense",
  };

  await fetch(`${apiUrl}/${currentEditId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedEntry),
  });

  editModal.classList.add("hidden");
  fetchAndRenderEntries(); // Refresh entries
});

// Delete Entry
async function deleteEntry(id) {
  await fetch(`${apiUrl}/${id}`, {
    method: "DELETE",
  });
  fetchAndRenderEntries(); // Refresh entries
}

// Update Summary Section
function updateSummary(entries) {
  const totalIncome = entries.reduce(
    (acc, entry) => (entry.type === "income" ? acc + entry.amount : acc),
    0
  );
  const totalExpense = entries.reduce(
    (acc, entry) => (entry.type === "expense" ? acc + entry.amount : acc),
    0
  );
  const netBalance = totalIncome - totalExpense;

  totalIncomeElem.textContent = `₹${totalIncome.toFixed(2)}`;
  totalExpenseElem.textContent = `₹${totalExpense.toFixed(2)}`;
  netBalanceElem.textContent = `₹${netBalance.toFixed(2)}`;
}

// Filtering Functionality
allFilterBtn.addEventListener("click", fetchAndRenderEntries);

incomeFilterBtn.addEventListener("click", async () => {
  const response = await fetch(apiUrl);
  const entries = await response.json();
  const filteredEntries = entries.filter((entry) => entry.type === "income");
  renderEntries(filteredEntries);
});

expenseFilterBtn.addEventListener("click", async () => {
  const response = await fetch(apiUrl);
  const entries = await response.json();
  const filteredEntries = entries.filter((entry) => entry.type === "expense");
  renderEntries(filteredEntries);
});

function renderEntries(entries) {
    entriesList.innerHTML = ""; // Clear existing entries

    entries.forEach((entry) => {
        const entryRow = document.createElement("tr");
        entryRow.className = `entry-row ${entry.type}`; // Add type-specific class

        entryRow.innerHTML = `
            <td class="p-4">${entry.description}</td>
            <td class="p-4">₹${entry.amount}</td>
            <td class="p-4">${entry.type === "income" ? "Income" : "Expense"}</td>
            <td class="p-4 flex space-x-4">
                <button class="bg-blue-500 text-white p-2 rounded-md" onclick="editEntry('${entry.id}')">Edit</button>
                <button class="bg-red-500 text-white p-2 rounded-md" onclick="deleteEntry('${entry.id}')">Delete</button>
            </td>
        `;
        entriesList.appendChild(entryRow);
    });
}

// Render Entries Functionality

function renderEntries(entries) {
  entriesList.innerHTML = ""; // Clear existing entries

  entries.forEach((entry) => {
    const entryRow = document.createElement("tr");
    entryRow.className = `entry-row ${entry.type} border-b border-gray-200`; // Add type-specific class and bottom border

    entryRow.innerHTML = `
            <td class="p-4 text-left">${entry.description}</td>
            <td class="p-4 text-left">₹${entry.amount}</td>
            <td class="p-4 text-left">${
              entry.type === "income" ? "Income" : "Expense"
            }</td>
            <td class="p-4 text-left">
                <button class="bg-blue-500 text-white p-2 rounded-md mr-2 hover:bg-blue-600 transition-all" onclick="editEntry('${
                  entry.id
                }')">Edit</button>
                <button class="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-all" onclick="deleteEntry('${
                  entry.id
                }')">Delete</button>
            </td>
        `;
    entriesList.appendChild(entryRow);
  });
}

// Initial Fetch
fetchAndRenderEntries();
