const API_BASE = "http://localhost:5000/api/auth";


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  
 
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById("locationInput").value = data.display_name;
    })
    .catch(error => console.error('Error:', error));
}

function showError(error) {
  alert("Unable to retrieve your location. Please enter manually.");
}


document.addEventListener("DOMContentLoaded", () => {
  // Removed duplicate API_BASE declaration

  // Login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "interface.html";
      } else {
        alert("Login failed");
      }
    });
  }

  // Register
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const role = document.getElementById("role").value;

      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await res.json();
      if (data.message) {
        alert("Registration successful! Please log in.");
        window.location.href = "login.html";
      } else {
        alert("Registration failed");
      }
    });
  }

  // Add event listener for search button
  const searchBtn = document.querySelector('.search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const location = document.getElementById("locationInput").value;
      if (location) {
        window.location.href = `roomdetails.html?location=${encodeURIComponent(location)}`;
      } else {
        alert("Please enter a location to search.");
      }
    });
  }

  // Other existing functions remain unchanged...
  // (Include all other functions as in your current script.js)

  // Post Room form submission
  const postRoomForm = document.getElementById('postRoomForm');
  if (postRoomForm) {
    postRoomForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(postRoomForm);

      try {
        const res = await fetch('http://localhost:5000/api/rooms', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          alert('Room posted successfully!');
          const location = document.getElementById('location').value;
          document.getElementById('locationInput').value = location; // Update search input with posted location
          postRoomForm.reset();
          searchRooms();
        } else {
          alert('Failed to post room.');
        }
      } catch (error) {
        console.error('Error posting room:', error);
        alert('Failed to post room due to network error.');
      }
    });
  }
});

// Fetching room listings from backend
async function fetchRooms() {
  const res = await fetch("http://localhost:5000/api/rooms");
  const rooms = await res.json();

  const roomListingsContainer = document.getElementById("room-listings");
  if (!roomListingsContainer) return;
  roomListingsContainer.innerHTML = ''; // Clear existing listings

  rooms.forEach(room => {
    const roomDiv = document.createElement("div");
    roomDiv.classList.add("room");

    roomDiv.innerHTML = `
      <h3>${room.title}</h3>
      <p>${room.description}</p>
      <p><strong>Location:</strong> ${room.location}</p>
      <p><strong>Rent:</strong> ₹${room.rent}</p>
      ${room.image ? `<img src="${room.image}" alt="${room.title}" class="room-image" />` : ''}
      <a href="room-details.html?id=${room._id}">View Details</a>
    `;

    roomListingsContainer.appendChild(roomDiv);
  });
}

// Search Rooms by Location
async function searchRooms() {
  const location = document.getElementById("locationInput").value;
  const res = await fetch(`http://localhost:5000/api/rooms?location=${location}`);
  const rooms = await res.json();

  const roomListingsContainer = document.getElementById("room-listings");
  roomListingsContainer.innerHTML = '';

  rooms.forEach(room => {
    const roomDiv = document.createElement("div");
    roomDiv.classList.add("room");

    roomDiv.innerHTML = `
      <h3>${room.title}</h3>
      <p>${room.description}</p>
      <p><strong>Location:</strong> ${room.location}</p>
      <p><strong>Rent:</strong> ₹${room.rent}</p>
      ${room.image ? `<img src="${room.image}" alt="${room.title}" class="room-image" />` : ''}
      <a href="room-details.html?id=${room._id}">View Details</a>
    `;

    roomListingsContainer.appendChild(roomDiv);
  });
}// Function to update UI after login
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

function updateUserUI() {
  const token = localStorage.getItem('token');
  const logDiv = document.getElementById('log');
  if (token && logDiv) {
    // Decode token payload to get username
    const payload = JSON.parse(atob(token.split('.')[1]));
    const username = payload.id || 'User'; // Adjust if username is stored differently

    // Replace login and signup buttons with user profile display and logout button
    logDiv.innerHTML = `
      <div class="user-profile" style="display:flex; align-items:center;">
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjY2NjY2NjIiByeD0iMTUiLz48dGV4dCB4PSI1IiB5PSIyMCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiI+VXNlcjwvdGV4dD48L3N2Zz4=" alt="Profile" style="border-radius:50%; margin-right:8px;" />
        <span style="margin-right: 10px;">${username}</span>
        <button id="logoutBtn" style="background-color: transparent; border: none; color: #007bff; cursor: pointer; font-size: 14px; padding: 0;">Logout</button>
      </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', logout);
  }
}

window.onload = () => {
  if (document.getElementById('log')) {
    updateUserUI();
  }
  fetchRooms();
};



