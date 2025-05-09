const fetch = require('node-fetch');

async function testRoomSearch(location) {
  const res = await fetch(`http://localhost:5000/api/rooms?location=${encodeURIComponent(location)}`);
  const rooms = await res.json();
  console.log('Rooms found:', rooms);
}

testRoomSearch('SampleLocation'); // Replace with actual location to test
