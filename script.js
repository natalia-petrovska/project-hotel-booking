window.history.pushState("", document.title, window.location.pathname);


function scrollToRooms() {
  document.getElementById("rooms").scrollIntoView({ behavior: "smooth" });
}

function selectRoom(roomName) {
  document.getElementById("room").value = roomName;
  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
}

function submitForm(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const room = document.getElementById("room").value;

  if (name && email && room) {
    document.getElementById("confirmation").classList.remove("hidden");
  }
}


