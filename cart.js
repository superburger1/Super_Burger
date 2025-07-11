let cartItems = [];

function toggleCart() {
  const cart = document.getElementById("cart");
  const cartIcon = document.querySelector(".cart-icon");
  const cartCount = document.getElementById("cart-count");
  cart.classList.toggle("show");
  cartIcon.style.display = cart.classList.contains("show") ? "none" : "block";
  cartCount.style.display = cart.classList.contains("show") ? "none" : "block";
}

function addToCart(name, price) {
  const existingItem = cartItems.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ name, price, quantity: 1 });
  }
  updateCartDisplay();
  saveCart();
}

function removeFromCart(index) {
  if (cartItems[index].quantity > 1) {
    cartItems[index].quantity--;
  } else {
    cartItems.splice(index, 1);
  }
  updateCartDisplay();
  saveCart();
}

function clearCart() {
  cartItems = [];
  updateCartDisplay();
  saveCart();
}

function updateCartDisplay() {
  const list = document.getElementById("cart-items");
  const totalDiv = document.getElementById("total-price");
  list.innerHTML = "";
  const totalSandwiches = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = totalSandwiches;

  if (cartItems.length === 0) {
    list.innerHTML = "<p>أوردراتي فارغة</p>";
    totalDiv.textContent = "الإجمالي: 0 جنيه";
    return;
  }

  let total = 0;
  cartItems.forEach((item, index) => {
    const itemTotal = item.quantity * item.price;
    total += itemTotal;
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <span>${item.name} × ${itemTotal} = ${item.quantity} جنيه</span>
      <button class="remove-btn" onclick="removeFromCart(${index})">🗑️</button>
    `;
    list.appendChild(li);
  });

  totalDiv.textContent = "الإجمالي: " + total + " جنيه";
}

function sendOrder() {
  if (cartItems.length === 0) {
    alert("السلة فارغة!");
    return;
  }

  let message = "📦 طلب جديد من Super Burger:%0A%0A";
  let total = 0;
  let totalItems = 0;

  cartItems.forEach(item => {
    const itemTotal = item.quantity * item.price;
    total += itemTotal;
    totalItems += item.quantity;
    message += `🍔 ${item.name} × ${item.quantity} = ${itemTotal} جنيه%0A`;
  });

  message += `%0A📦 عدد العناصر: ${totalItems}`;
  message += `%0A💰 الإجمالي: ${total} جنيه%0A`;

  const encodedMessage = encodeURIComponent(message);


  const phone = "201271230053";
  const url = `https://wa.me/${phone}?text=${message}`;
  window.open(url, "_blank");
}

function saveCart() {
  localStorage.setItem("superburger_cart", JSON.stringify(cartItems));
}

function checkCartAndShowMessage() {
    const savedCart = localStorage.getItem("superburger_cart");
    const messageBox = document.getElementById("empty-message");

    if (!savedCart || JSON.parse(savedCart).length === 0) {
      messageBox.style.display = "block";
      setTimeout(() => {
        messageBox.style.display = "none";
      }, 5000);
    } else {
      window.location.href = "info.html";
    }
  }



window.onload = function () {
  const saved = localStorage.getItem("superburger_cart");
  if (saved) {
    cartItems = JSON.parse(saved);
    updateCartDisplay();
  }
};
