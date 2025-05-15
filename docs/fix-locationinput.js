document.addEventListener("DOMContentLoaded", () => {
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
          const locationInput = document.getElementById('locationInput');
          if (locationInput) {
            locationInput.value = location; // Update search input with posted location
          }
          postRoomForm.reset();
          if (typeof searchRooms === 'function') {
            searchRooms();
          }
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
