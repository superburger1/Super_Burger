let cartItems = [];
const WHATSAPP_PHONE = "201271230053"; // رقم الواتساب - يجب تغييره لرقمك

// 1. تحميل السلة عند بدء التشغيل
window.onload = function () {
  const saved = localStorage.getItem("superburger_cart");
  if (saved) {
    try {
      cartItems = JSON.parse(saved);
      updateCartDisplay();
    } catch (e) {
      console.error("Error parsing cart from localStorage:", e);
      cartItems = []; // مسح السلة لو حدث خطأ في التحميل
    }
  }

  // إضافة مستمع حدث لإغلاق السلة عند النقر خارجها
  document.addEventListener('click', function(event) {
    const cart = document.getElementById("cart");
    const cartIcon = document.querySelector(".cart-icon");
    
    // التحقق مما إذا كانت السلة مفتوحة
    if (cart.classList.contains("show")) {
      // التحقق مما إذا كان النقر خارج السلة وخارج أيقونة السلة
      if (!cart.contains(event.target) && !cartIcon.contains(event.target)) {
        toggleCart();
      }
    }
  });
};
  const saved = localStorage.getItem("superburger_cart");
  if (saved) {
    try {
      cartItems = JSON.parse(saved);
      updateCartDisplay();
    } catch (e) {
      console.error("Error parsing cart from localStorage:", e);
      cartItems = []; // مسح السلة لو حدث خطأ في التحميل
    }
  }


// 2. حفظ السلة في التخزين المحلي
function saveCart() {
  localStorage.setItem("superburger_cart", JSON.stringify(cartItems));
}

// 3. فتح وإغلاق السلة
function toggleCart() {
  const cart = document.getElementById("cart");
  const cartIcon = document.querySelector(".cart-icon");
  const cartCount = document.getElementById("cart-count");

  cart.classList.toggle("show");

  // استخدام visibility بدلاً من display لتجنب "قفزة" في التخطيط
  if (cart.classList.contains("show")) {
    cartIcon.style.visibility = "hidden";
    cartCount.style.visibility = "hidden";
  } else {
    cartIcon.style.visibility = "visible";
    cartCount.style.visibility = "visible";
  }
}

// 4. إضافة منتج للسلة
function addToCart(name, price) {
  // تحويل السعر إلى رقم للتأكد
  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    console.error("Invalid price for item:", name, price);
    return;
  }

  const existingItem = cartItems.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ name, price: numericPrice, quantity: 1 });
  }
  updateCartDisplay();
  saveCart();
}

// 5. إزالة منتج من السلة (أو تقليل الكمية)
function removeFromCart(index) {
  if (index >= 0 && index < cartItems.length) {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity--;
    } else {
      cartItems.splice(index, 1);
    }
    updateCartDisplay();
    saveCart();
  }
}

// 6. مسح السلة بالكامل
function clearCart() {
  if (confirm("هل أنت متأكد من حذف جميع الأوردرات؟")) {
    cartItems = [];
    updateCartDisplay();
    saveCart();
  }
}

// 7. تحديث عرض السلة
function updateCartDisplay() {
  const list = document.getElementById("cart-items");
  const totalDiv = document.getElementById("total-price");
  const cartCountSpan = document.getElementById("cart-count");
  const checkoutBtn = document.getElementById("checkout-btn");
  const clearBtn = document.getElementById("clear-cart-btn");

  list.innerHTML = "";
  let totalItems = 0;
  let total = 0;

  cartItems.forEach((item, index) => {
    totalItems += item.quantity;
    // استخدام toFixed(2) لضمان عرض رقمين عشريين للسعر والإجمالي
    const itemTotal = item.quantity * item.price;
    total += itemTotal;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <span>${item.quantity} × ${item.name} (${item.price.toFixed(2)} ج.م) = ${itemTotal.toFixed(2)} ج.م</span>
      <button class="remove-btn" onclick="removeFromCart(${index})">🗑️</button>
    `;
    list.appendChild(li);
  });

  cartCountSpan.textContent = totalItems;
  totalDiv.textContent = `الإجمالي: ${total.toFixed(2)} جنيه`;

  // إظهار رسالة السلة الفارغة وإخفاء الأزرار إذا كانت السلة فارغة
  if (cartItems.length === 0) {
    list.innerHTML = "<p style='text-align: center; color: #777; margin-top: 20px;'>السلة فارغة. أضف منتجاتك من القائمة.</p>";
    if (checkoutBtn) checkoutBtn.disabled = true;
    if (clearBtn) clearBtn.disabled = true;
    cartCountSpan.style.display = "none";
  } else {
    if (checkoutBtn) checkoutBtn.disabled = false;
    if (clearBtn) clearBtn.disabled = false;
    cartCountSpan.style.display = "flex"; // لإظهار العداد
  }
}

// 8. التحقق من السلة قبل استكمال الطلب (يتم استدعاؤها من زر الواتساب)
function checkCartAndShowMessage() {
  if (cartItems.length === 0) {
    const messageBox = document.getElementById("empty-message");
    if (messageBox) {
      messageBox.style.display = "block";
      setTimeout(() => {
        messageBox.style.display = "none";
      }, 5000);
    } else {
      alert("أوردراتي فاضية! أضف منتجاتك قبل استكمال الطلب.");
    }
  } else {
      window.location.href = "info.html";
    }
}

// 9. إرسال الطلب عبر واتساب
function sendOrder() {
  let message = "📦 طلب جديد من Super Burger:\n\n";
  let total = 0;
  let totalItems = 0;

  cartItems.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    totalItems += item.quantity;
    message += `🍔 ${item.quantity} × ${item.name} = ${itemTotal.toFixed(2)} ج.م\n`;
  });

  message += `\n📦 عدد الأصناف: ${cartItems.length}`;
  message += `\n🍔 عدد السندوتشات الإجمالي: ${totalItems}`;
  message += `\n💰 الإجمالي الكلي: ${total.toFixed(2)} جنيه`;
  message += `\n\nيرجى إرسال الموقع والعنوان لتأكيد الطلب.`;

  // تشفير الرسالة لـ URL لضمان عرض الأحرف العربية بشكل صحيح
  const encodedMessage = encodeURIComponent(message);

  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
  window.open(url, "_blank");
}

// 10. دالة وهمية لإضافة منتج (للتجربة)
function addDummyProduct() {
  addToCart('ساندوتش برجر كلاسيك', 50);
  addToCart('بطاطس مقلية حجم كبير', 25);
  addToCart('كولا', 15);
}