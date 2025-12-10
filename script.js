window.history.pushState("", document.title, window.location.pathname); 

// Room prices
const roomPrices = {
  'Suite': 890,
  'Premium': 1250
};

// Gallery images for lightbox
const galleryImages = [
  'images/mountain-view.jpg',
  'images/restaurant.jpg',
  'images/spa.jpg',
  'images/lounge.jpeg',
  'images/room.jpg',
  'images/pool.jpg'
];
let currentLightboxIndex = 0;

// Scroll animations on page load
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('.rooms, .gallery, .booking');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    observer.observe(section);
  });

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('checkin').setAttribute('min', today);
  document.getElementById('checkout').setAttribute('min', today);
});

function scrollToRooms() {
  document.getElementById("rooms").scrollIntoView({ behavior: "smooth" }); 
}

function selectRoom(roomName, price) {
  const roomSelect = document.getElementById("room");
  roomSelect.value = roomName;
  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
  calculatePrice();
}

// Lightbox functions
function openLightbox(index) {
  currentLightboxIndex = index;
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = galleryImages[index];
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function changeLightboxImage(direction) {
  currentLightboxIndex += direction;
  if (currentLightboxIndex < 0) currentLightboxIndex = galleryImages.length - 1;
  if (currentLightboxIndex >= galleryImages.length) currentLightboxIndex = 0;
  document.getElementById('lightbox-img').src = galleryImages[currentLightboxIndex];
}

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') changeLightboxImage(-1);
  if (e.key === 'ArrowRight') changeLightboxImage(1);
});

// Field validation with visual feedback
function validateField(input) {
  const label = input.parentElement;
  const icon = label.querySelector('.validation-icon');
  
  if (input.validity.valid && input.value.trim() !== '') {
    icon.textContent = '✓';
    icon.style.color = '#4CAF50';
  } else {
    icon.textContent = '';
  }
}

// Simulated booked dates (for demo purposes)
const bookedDates = [
  '2025-12-15', '2025-12-16', '2025-12-17',
  '2025-12-24', '2025-12-25', '2025-12-26',
  '2026-01-01', '2026-01-02'
];

// Check if dates are available
function checkAvailability(checkin, checkout) {
  const start = new Date(checkin);
  const end = new Date(checkout);
  
  // Check each day in the range
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    if (bookedDates.includes(dateStr)) {
      return { available: false, conflictDate: dateStr };
    }
  }
  return { available: true };
}

// Calculate total price
function calculatePrice() {
  const roomSelect = document.getElementById('room');
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  const availabilityStatus = document.getElementById('availability-status');
  
  if (!checkinInput.value || !checkoutInput.value) return;
  
  const checkin = new Date(checkinInput.value);
  const checkout = new Date(checkoutInput.value);
  const roomName = roomSelect.value;
  const pricePerNight = roomPrices[roomName];
  
  if (checkout <= checkin) {
    document.getElementById('booking-summary').classList.add('hidden');
    availabilityStatus.classList.add('hidden');
    return;
  }
  
  // Check availability
  const availability = checkAvailability(checkinInput.value, checkoutInput.value);
  
  if (!availability.available) {
    // Show unavailable message
    const conflictDate = new Date(availability.conflictDate);
    availabilityStatus.innerHTML = `❌ <strong>Not Available</strong><br>Room is booked on ${conflictDate.toLocaleDateString()}. Please select different dates.`;
    availabilityStatus.className = 'availability-status unavailable';
    availabilityStatus.classList.remove('hidden');
    document.getElementById('booking-summary').classList.add('hidden');
    return;
  } else {
    // Show available message
    availabilityStatus.innerHTML = `✅ <strong>Available!</strong> These dates are free for booking.`;
    availabilityStatus.className = 'availability-status available';
    availabilityStatus.classList.remove('hidden');
  }
  
  const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
  const total = nights * pricePerNight;
  
  // Update summary
  document.getElementById('summary-room').textContent = roomName;
  document.getElementById('summary-dates').textContent = 
    `${checkin.toLocaleDateString()} - ${checkout.toLocaleDateString()}`;
  document.getElementById('summary-nights').textContent = nights;
  document.getElementById('summary-total').textContent = total.toLocaleString();
  
  document.getElementById('booking-summary').classList.remove('hidden');
}

function submitForm(event) { 
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const room = document.getElementById("room").value;
  const checkinInput = document.getElementById("checkin").value;
  const checkoutInput = document.getElementById("checkout").value;
  const checkin = new Date(checkinInput);
  const checkout = new Date(checkoutInput);

  if (checkin >= checkout) { 
    alert("❗ Check-out date must be after Check-in date.");
    return; 
  }

  // Check availability before booking
  const availability = checkAvailability(checkinInput, checkoutInput);
  if (!availability.available) {
    alert("❗ Sorry, these dates are not available. Please select different dates.");
    return;
  }

  if (name && email && room) { 
    const confirmation = document.getElementById("confirmation");
    confirmation.classList.remove("hidden");
    
    // Scroll to confirmation
    confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
    
    // Reset form after 5 seconds
    setTimeout(() => {
      document.querySelector('form').reset();
      confirmation.classList.add("hidden");
      document.getElementById('booking-summary').classList.add('hidden');
      document.getElementById('availability-status').classList.add('hidden');
    }, 5000);
  }
}