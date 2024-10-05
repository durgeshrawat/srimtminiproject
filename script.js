// script.js

// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('section');

// Dashboard Elements
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const balanceEl = document.getElementById('balance');
const budgetRemainingEl = document.getElementById('budget-remaining');

// Expenses Elements
const expenseDescription = document.getElementById('expense-description');
const expenseAmount = document.getElementById('expense-amount');
const expenseDate = document.getElementById('expense-date');
const expenseCategory = document.getElementById('expense-category');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const expensesList = document.getElementById('expensesList');

// Income Elements
const incomeDescription = document.getElementById('income-description');
const incomeAmount = document.getElementById('income-amount');
const incomeDate = document.getElementById('income-date');
const incomeCategory = document.getElementById('income-category');
const addIncomeBtn = document.getElementById('addIncomeBtn');
const incomeList = document.getElementById('incomeList');

// Budget Elements
const budgetAmount = document.getElementById('budget-amount');
const setBudgetBtn = document.getElementById('setBudgetBtn');
const currentBudgetEl = document.getElementById('current-budget');

// Reports Elements
const expenseChartCtx = document.getElementById('expenseChart').getContext('2d');
const incomeChartCtx = document.getElementById('incomeChart').getContext('2d');

// Categories Elements
const newCategoryInput = document.getElementById('new-category');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const categoriesList = document.getElementById('categoriesList');

// Settings Elements
const themeSelect = document.getElementById('theme-select');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

// Data Structures
let expenses = [];
let incomes = [];
let categories = [];
let budget = 0;

// Charts
let expenseChart;
let incomeChart;

// Initialize App
document.addEventListener('DOMContentLoaded', initApp);

// Navigation Functionality
navButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    navButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
    // Hide all sections
    sections.forEach(section => section.classList.remove('active'));
    // Show target section
    const target = document.getElementById(button.getAttribute('data-target'));
    target.classList.add('active');
  });
});

// Initialize App Function
function initApp() {
  loadData();
  populateCategories();
  renderExpenses();
  renderIncomes();
  renderCategories();
  updateDashboard();
  initializeCharts();
  applySettings();
}

// Load Data from localStorage
function loadData() {
  expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  incomes = JSON.parse(localStorage.getItem('incomes')) || [];
  categories = JSON.parse(localStorage.getItem('categories')) || ['General'];
  budget = parseFloat(localStorage.getItem('budget')) || 0;
  currentBudgetEl.textContent = budget.toFixed(2);
}

// Save Data to localStorage
function saveData() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
  localStorage.setItem('incomes', JSON.stringify(incomes));
  localStorage.setItem('categories', JSON.stringify(categories));
  localStorage.setItem('budget', budget.toString());
}

// Populate Categories in Dropdowns
function populateCategories() {
  // Clear existing options
  expenseCategory.innerHTML = '';
  incomeCategory.innerHTML = '';
  categories.forEach(cat => {
    const option1 = document.createElement('option');
    option1.value = cat;
    option1.textContent = cat;
    expenseCategory.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = cat;
    option2.textContent = cat;
    incomeCategory.appendChild(option2);
  });
}

// Add Expense
addExpenseBtn.addEventListener('click', () => {
  const desc = expenseDescription.value.trim();
  const amt = parseFloat(expenseAmount.value.trim());
  const date = expenseDate.value;
  const cat = expenseCategory.value;

  if (desc === '' || isNaN(amt) || date === '') {
    alert('Please enter valid expense details.');
    return;
  }

  const expense = {
    id: Date.now(),
    description: desc,
    amount: amt,
    date,
    category: cat
  };

  expenses.push(expense);
  saveData();
  renderExpenses();
  updateDashboard();
  updateCharts();
  clearExpenseForm();
});

// Render Expenses
function renderExpenses() {
  expensesList.innerHTML = '';
  expenses.forEach(exp => {
    const li = document.createElement('li');
    li.classList.add('expense');

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('details');
    detailsDiv.innerHTML = `<strong>${exp.description}</strong> - $${exp.amount.toFixed(2)} <small>${exp.date} (${exp.category})</small>`;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteExpense(exp.id));

    li.appendChild(detailsDiv);
    li.appendChild(deleteBtn);
    expensesList.appendChild(li);
  });
}

// Delete Expense
function deleteExpense(id) {
  if (confirm('Are you sure you want to delete this expense?')) {
    expenses = expenses.filter(exp => exp.id !== id);
    saveData();
    renderExpenses();
    updateDashboard();
    updateCharts();
  }
}

// Clear Expense Form
function clearExpenseForm() {
  expenseDescription.value = '';
  expenseAmount.value = '';
  expenseDate.value = '';
}

// Add Income
addIncomeBtn.addEventListener('click', () => {
  const desc = incomeDescription.value.trim();
  const amt = parseFloat(incomeAmount.value.trim());
  const date = incomeDate.value;
  const cat = incomeCategory.value;

  if (desc === '' || isNaN(amt) || date === '') {
    alert('Please enter valid income details.');
    return;
  }

  const income = {
    id: Date.now(),
    description: desc,
    amount: amt,
    date,
    category: cat
  };

  incomes.push(income);
  saveData();
  renderIncomes();
  updateDashboard();
  updateCharts();
  clearIncomeForm();
});

// Render Incomes
function renderIncomes() {
  incomeList.innerHTML = '';
  incomes.forEach(inc => {
    const li = document.createElement('li');
    li.classList.add('income');

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('details');
    detailsDiv.innerHTML = `<strong>${inc.description}</strong> - $${inc.amount.toFixed(2)} <small>${inc.date} (${inc.category})</small>`;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteIncome(inc.id));

    li.appendChild(detailsDiv);
    li.appendChild(deleteBtn);
    incomeList.appendChild(li);
  });
}

// Delete Income
function deleteIncome(id) {
  if (confirm('Are you sure you want to delete this income?')) {
    incomes = incomes.filter(inc => inc.id !== id);
    saveData();
    renderIncomes();
    updateDashboard();
    updateCharts();
  }
}

// Clear Income Form
function clearIncomeForm() {
  incomeDescription.value = '';
  incomeAmount.value = '';
  incomeDate.value = '';
}

// Set Budget
setBudgetBtn.addEventListener('click', () => {
  const amt = parseFloat(budgetAmount.value.trim());
  if (isNaN(amt) || amt < 0) {
    alert('Please enter a valid budget amount.');
    return;
  }
  budget = amt;
  saveData();
  currentBudgetEl.textContent = budget.toFixed(2);
  updateDashboard();
  updateCharts();
  budgetAmount.value = '';
});

// Update Dashboard
function updateDashboard() {
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpenses;
  const budgetRemaining = budget - totalExpenses;

  totalIncomeEl.textContent = totalIncome.toFixed(2);
  totalExpensesEl.textContent = totalExpenses.toFixed(2);
  balanceEl.textContent = balance.toFixed(2);
  budgetRemainingEl.textContent = budgetRemaining.toFixed(2);

  // Optionally, you can change the color based on budget remaining
  if (budgetRemaining < 0) {
    budgetRemainingEl.style.color = '#e74c3c';
  } else {
    budgetRemainingEl.style.color = '#2c3e50';
  }
}

// Add Category
addCategoryBtn.addEventListener('click', () => {
  const newCat = newCategoryInput.value.trim();
  if (newCat === '' || categories.includes(newCat)) {
    alert('Please enter a unique category name.');
    return;
  }
  categories.push(newCat);
  saveData();
  populateCategories();
  renderCategories();
  newCategoryInput.value = '';
});

// Render Categories
function renderCategories() {
  categoriesList.innerHTML = '';
  categories.forEach(cat => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = cat;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';
    // Prevent deleting default 'General' category
    if (cat !== 'General') {
      deleteBtn.addEventListener('click', () => deleteCategory(cat));
    } else {
      deleteBtn.disabled = true;
      deleteBtn.style.background = '#95a5a6';
      deleteBtn.style.cursor = 'not-allowed';
    }

    li.appendChild(span);
    li.appendChild(deleteBtn);
    categoriesList.appendChild(li);
  });
}

// Delete Category
function deleteCategory(category) {
  if (confirm(`Are you sure you want to delete the category "${category}"?`)) {
    categories = categories.filter(cat => cat !== category);
    // Update expenses and incomes to 'General' category
    expenses.forEach(exp => {
      if (exp.category === category) exp.category = 'General';
    });
    incomes.forEach(inc => {
      if (inc.category === category) inc.category = 'General';
    });
    saveData();
    populateCategories();
    renderExpenses();
    renderIncomes();
    renderCategories();
    updateDashboard();
    updateCharts();
  }
}

// Initialize Charts
function initializeCharts() {
  expenseChart = new Chart(expenseChartCtx, {
    type: 'pie',
    data: {
      labels: getExpenseCategories(),
      datasets: [{
        label: 'Expenses by Category',
        data: getExpenseAmountsByCategory(),
        backgroundColor: generateColors(getExpenseCategories().length)
      }]
    },
    options: {
      responsive: true
    }
  });

  incomeChart = new Chart(incomeChartCtx, {
    type: 'pie',
    data: {
      labels: getIncomeCategories(),
      datasets: [{
        label: 'Income by Category',
        data: getIncomeAmountsByCategory(),
        backgroundColor: generateColors(getIncomeCategories().length)
      }]
    },
    options: {
      responsive: true
    }
  });
}

// Update Charts
function updateCharts() {
  // Update Expense Chart
  expenseChart.data.labels = getExpenseCategories();
  expenseChart.data.datasets[0].data = getExpenseAmountsByCategory();
  expenseChart.data.datasets[0].backgroundColor = generateColors(getExpenseCategories().length);
  expenseChart.update();

  // Update Income Chart
  incomeChart.data.labels = getIncomeCategories();
  incomeChart.data.datasets[0].data = getIncomeAmountsByCategory();
  incomeChart.data.datasets[0].backgroundColor = generateColors(getIncomeCategories().length);
  incomeChart.update();
}

// Get Expense Categories
function getExpenseCategories() {
  const cats = {};
  expenses.forEach(exp => {
    cats[exp.category] = (cats[exp.category] || 0) + exp.amount;
  });
  return Object.keys(cats);
}

// Get Expense Amounts by Category
function getExpenseAmountsByCategory() {
  const cats = {};
  expenses.forEach(exp => {
    cats[exp.category] = (cats[exp.category] || 0) + exp.amount;
  });
  return Object.values(cats);
}

// Get Income Categories
function getIncomeCategories() {
  const cats = {};
  incomes.forEach(inc => {
    cats[inc.category] = (cats[inc.category] || 0) + inc.amount;
  });
  return Object.keys(cats);
}

// Get Income Amounts by Category
function getIncomeAmountsByCategory() {
  const cats = {};
  incomes.forEach(inc => {
    cats[inc.category] = (cats[inc.category] || 0) + inc.amount;
  });
  return Object.values(cats);
}

// Generate Random Colors
function generateColors(num) {
  const colors = [];
  for (let i = 0; i < num; i++) {
    const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;
    colors.push(color);
  }
  return colors;
}

// Update Dashboard
// Already handled by updateDashboard function

// Settings Functionality
saveSettingsBtn.addEventListener('click', () => {
  const selectedTheme = themeSelect.value;
  document.body.setAttribute('data-theme', selectedTheme);
  localStorage.setItem('theme', selectedTheme);
  alert('Settings saved!');
});

// Apply Settings on Load
function applySettings() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  themeSelect.value = savedTheme;
}

// Initialize Charts and Dashboard on Data Load
function initializeDashboardAndCharts() {
  updateDashboard();
  updateCharts();
}

// Watch for changes in expenses and incomes to update dashboard and charts
function watchDataChanges() {
  // Already handled by calling updateDashboard and updateCharts after data changes
}

// Invoke functions after initial load
initApp();
