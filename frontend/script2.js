async function fetchRoomDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('id');
  
    if (!roomId) {
      alert("Room not found!");
      window.location.href = "index.html";
      return;
    }
  
    const res = await fetch(`http://localhost:5000/api/rooms/${roomId}`);
    const room = await res.json();
  
    if (room) {
      document.getElementById("room-title").textContent = room.title;
      document.getElementById("room-description").textContent = room.description;
      document.getElementById("room-location").textContent = room.location;
      document.getElementById("room-rent").textContent = room.rent;
      document.getElementById("room-image").src = room.image;
    }
  }
  
  // Load room details on page load
  window.onload = fetchRoomDetails;
  