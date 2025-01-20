document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";
    const cartList = document.getElementById("cart-list");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");

    let cartData = [];
    let subtotal = 0;

    // Fetch cart data
    async function fetchCartData() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            cartData = data.items;
            populateCart();
            calculateTotals();
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }

    // Populate cart items
    function populateCart() {
        cartList.innerHTML = ""; // Clear previous items
        cartData.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <span>${item.title}</span>
                <span>₹${(item.price / 100).toFixed(2)}</span>
                <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                <span class="item-subtotal">₹${(item.line_price / 100).toFixed(2)}</span>
                <span class="remove-btn" data-id="${item.id}">🗑️</span>
            `;
            cartList.appendChild(li);
        });

        attachEventListeners();
    }

    // Attach event listeners for quantity changes and item removal
    function attachEventListeners() {
        const quantityInputs = document.querySelectorAll(".quantity-input");
        const removeButtons = document.querySelectorAll(".remove-btn");

        quantityInputs.forEach(input => {
            input.addEventListener("change", updateQuantity);
        });

        removeButtons.forEach(button => {
            button.addEventListener("click", removeItem);
        });
    }

    // Update quantity
    function updateQuantity(event) {
        const id = event.target.dataset.id;
        const newQuantity = parseInt(event.target.value);

        const item = cartData.find(item => item.id == id);
        if (item) {
            item.quantity = newQuantity;
            item.line_price = item.price * newQuantity;
            populateCart();
            calculateTotals();
        }
    }

    // Remove item
    function removeItem(event) {
        const id = event.target.dataset.id;
        cartData = cartData.filter(item => item.id != id);
        populateCart();
        calculateTotals();
    }

    // Calculate totals
    function calculateTotals() {
        subtotal = cartData.reduce((acc, item) => acc + item.line_price, 0);
        subtotalElement.textContent = (subtotal / 100).toFixed(2);
        totalElement.textContent = (subtotal / 100).toFixed(2); // Assuming no extra charges
    }

    // Initial fetch
    fetchCartData();
});

