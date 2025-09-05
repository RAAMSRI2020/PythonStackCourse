// Pizza Menu Data
const pizzaMenu = [
    { id: 1, name: "Margherita", description: "Tomato sauce, mozzarella, basil", price: 10.99, image: "🍕" },
    { id: 2, name: "Pepperoni", description: "Pepperoni, mozzarella, tomato sauce", price: 12.99, image: "🍕" },
    { id: 3, name: "Vegetarian", description: "Mixed vegetables, mozzarella", price: 11.99, image: "🍕" },
    { id: 4, name: "Hawaiian", description: "Ham, pineapple, mozzarella", price: 13.99, image: "🍕" }
];

// Current Order
let currentOrder = {
    items: [],
    total: 0
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    displayMenu();
    setupEventListeners();
});

// Display pizza menu
function displayMenu() {
    const menuContainer = document.getElementById('menu-container');
    
    pizzaMenu.forEach(pizza => {
        const pizzaCard = `
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div class="p-4 text-center text-4xl">${pizza.image}</div>
                <div class="p-4">
                    <h3 class="font-semibold text-xl">${pizza.name}</h3>
                    <p class="text-gray-600 my-2">${pizza.description}</p>
                    <div class="flex justify-between items-center mt-4">
                        <span class="font-bold text-lg">$${pizza.price.toFixed(2)}</span>
                        <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 add-to-cart" data-id="${pizza.id}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        menuContainer.innerHTML += pizzaCard;
    });
}

// Set up event listeners
function setupEventListeners() {
    // Add to order from menu
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const pizzaId = parseInt(this.dataset.id);
            const pizza = pizzaMenu.find(p => p.id === pizzaId);
            addToOrder(pizza, 1, []);
        });
    });

    // Custom pizza builder
    document.getElementById('add-to-order').addEventListener('click', buildCustomPizza);
    
    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', checkout);
}

// Build custom pizza from form
function buildCustomPizza() {
    const size = document.querySelector('input[name="size"]:checked').value;
    const toppings = Array.from(document.querySelectorAll('input[name="toppings"]:checked')).map(t => t.value);
    const quantity = parseInt(document.getElementById('quantity').value);

    const sizePrices = { small: 10, medium: 12, large: 15 };
    const basePrice = sizePrices[size];
    const toppingsPrice = toppings.length * 1;
    const totalPrice = (basePrice + toppingsPrice) * quantity;

    const customPizza = {
        id: Date.now(), // Unique ID
        name: `Custom ${size.charAt(0).toUpperCase() + size.slice(1)} Pizza`,
        description: `${size} pizza with ${toppings.join(', ') || 'no toppings'}`,
        price: totalPrice,
        quantity: quantity
    };

    addToOrder(customPizza, quantity, toppings);
}

// Add item to order
function addToOrder(item, quantity, toppings) {
    currentOrder.items.push({
        ...item,
        quantity: quantity,
        toppings: toppings
    });
    
    updateOrderSummary();
}

// Update order summary display
function updateOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    const totalElement = document.getElementById('total-price');
    
    // Calculate total
    currentOrder.total = currentOrder.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update display
    if (currentOrder.items.length === 0) {
        orderSummary.innerHTML = '<p class="text-gray-600">Your order will appear here...</p>';
    } else {
        orderSummary.innerHTML = currentOrder.items.map(item => `
            <div class="border-b py-2">
                <div class="flex justify-between">
                    <span class="font-medium">${item.name} x${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                ${item.toppings && item.toppings.length > 0 ? 
                    `<p class="text-sm text-gray-600">Toppings: ${item.toppings.join(', ')}</p>` : ''}
            </div>
        `).join('');
    }
    
    totalElement.textContent = `$${currentOrder.total.toFixed(2)}`;
}

// Checkout function
function checkout() {
    if (currentOrder.items.length === 0) {
        alert('Please add items to your order first!');
        return;
    }
    
    alert(`Order placed! Total: $${currentOrder.total.toFixed(2)}\nThank you for your order!`);
    
    // Reset order
    currentOrder = { items: [], total: 0 };
    updateOrderSummary();
    
    // Reset form
    document.querySelector('input[name="size"][value="small"]').checked = true;
    document.querySelectorAll('input[name="toppings"]').forEach(cb => cb.checked = false);
    document.getElementById('quantity').value = 1;
}

// Additional feature: Remove item from order
function setupRemoveButtons() {
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.id);
            removeFromOrder(itemId);
        });
    });
}

function removeFromOrder(itemId) {
    currentOrder.items = currentOrder.items.filter(item => item.id !== itemId);
    updateOrderSummary();
}