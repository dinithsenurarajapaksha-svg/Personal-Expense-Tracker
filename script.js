
// =====================================
// 1. SELECT HTML ELEMENTS
// =====================================

const transactionForm = document.getElementById("transaction-form");

const typeInput = document.getElementById("type");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const transactionList = document.getElementById("transaction-list");


// =====================================
// 2. CREATE TRANSACTION ARRAY
// =====================================

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];


// =====================================
// 3. ADD TRANSACTION
// =====================================

transactionForm.addEventListener("submit", function(event) {

    // Prevent page refresh
    event.preventDefault();

    // Get values from form
    const type = typeInput.value;
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    // Validate amount
    if (amount <= 0 || !Number.isFinite(amount)) {
        alert("Please enter a valid amount greater than zero.");
        return;
    }

    // Create transaction object
    const transaction = {
        id: Date.now(),
        type: type,
        description: description,
        amount: amount,
        category: category,
        date: date
    };

    transactions.push(transaction);

    // Save data
    saveTransactions();

    // Update dashboard and table
    displayTransactions();
    calculateTotals();

    // Clear form
    transactionForm.reset();

    });

// =====================================
// 4. FILTER TRANSACTIONS
// =====================================

// Select filter dropdown
const filterType = document.getElementById("filter-type");
const searchInput = document.getElementById("search-input");

// Update table when filter changes
filterType.addEventListener("change", function() {
    displayTransactions();
});


// =====================================
// 5. UPDATED DISPLAY TRANSACTIONS
// =====================================

function displayTransactions() {

    // Clear existing table rows
    transactionList.innerHTML = "";

    // Get selected filter value
    const selectedFilter = filterType.value;

    // Get search text
    const searchText = searchInput.value.toLowerCase().trim();

    // Filter transactions using filter and search
    const filteredTransactions = transactions.filter(function(transaction) {

        // Check transaction type
        const matchesFilter =
            selectedFilter === "All" ||
            transaction.type === selectedFilter;

        // Check search text
        const matchesSearch =
            transaction.description.toLowerCase().includes(searchText) ||
            transaction.category.toLowerCase().includes(searchText) ||
            transaction.type.toLowerCase().includes(searchText) ||
            transaction.date.includes(searchText) ||
            transaction.amount.toString().includes(searchText);

        // Return transactions matching both conditions
        return matchesFilter && matchesSearch;

    });


    // Display filtered transactions
    filteredTransactions.forEach(function(transaction) {

        const row = document.createElement("tr");

        // Date
        const dateCell = document.createElement("td");
        dateCell.textContent = transaction.date;

        // Description
        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = transaction.description;

        // Type
        const typeCell = document.createElement("td");
        typeCell.textContent = transaction.type;

        typeCell.classList.add(
            transaction.type === "Income" ? "income-text" : "expense-text"
        );

        // Category
        const categoryCell = document.createElement("td");
        categoryCell.textContent = transaction.category;

        // Amount
        const amountCell = document.createElement("td");
        amountCell.textContent =
            "LKR " + transaction.amount.toLocaleString("en-US");

        // Action
        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        deleteButton.addEventListener("click", function() {
            deleteTransaction(transaction.id);
        });

        actionCell.appendChild(deleteButton);

        // Add cells to row
        row.appendChild(dateCell);
        row.appendChild(descriptionCell);
        row.appendChild(typeCell);
        row.appendChild(categoryCell);
        row.appendChild(amountCell);
        row.appendChild(actionCell);

        // Add row to table
        transactionList.appendChild(row);

    });

}


// =====================================
// 6. DELETE TRANSACTION
// =====================================

function deleteTransaction(id) {

    transactions = transactions.filter(function(transaction) {

        return transaction.id !== id;

    });

    // Save updated transactions
    saveTransactions();

    // Update table and totals
    displayTransactions();
    calculateTotals();

}


// =====================================
// 7. CALCULATE TOTALS
// =====================================

function calculateTotals() {

    let totalIncome = 0;
    let totalExpenses = 0;

    // Calculate income and expenses
    transactions.forEach(function(transaction) {

        if (transaction.type === "Income") {

            totalIncome += transaction.amount;

        } else if (transaction.type === "Expense") {

            totalExpenses += transaction.amount;

        }

    });

    // Calculate current balance
    const currentBalance = totalIncome - totalExpenses;

    // Update dashboard
    document.getElementById("total-income").textContent =
        "LKR " + totalIncome.toLocaleString("en-US", {
            minimumFractionDigits: 2
        });

    document.getElementById("total-expenses").textContent =
        "LKR " + totalExpenses.toLocaleString("en-US", {
            minimumFractionDigits: 2
        });

    document.getElementById("current-balance").textContent =
        "LKR " + currentBalance.toLocaleString("en-US", {
            minimumFractionDigits: 2
        });

}

// =====================================
// 8. SEARCH TRANSACTIONS
// =====================================

searchInput.addEventListener("input", function() {

    displayTransactions();

});

// =====================================
// 9. SAVE TRANSACTIONS
// =====================================

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

// =====================================
// 10. INITIALIZE APPLICATION
// =====================================

// Display saved transactions
displayTransactions();

// Calculate saved totals
calculateTotals();


