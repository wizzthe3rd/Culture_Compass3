document.getElementById('user-form').addEventListener('submit', function(event)
 {
    event.preventDefault(); // Prevent form submission
  
    // Get form values
    const userId = document.getElementById('userId').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const points = parseInt(document.getElementById('points').value);

    function createUser(event)
     {
        event.preventDefault();
      
  
    // Validate form data
    if (!userId || !username || !email || isNaN(points)) {
      alert('Please fill in all fields correctly.');
      return;
    }
  
    // Create user data object
    const userData = {
      username: username,
      email: email,
      points: points
    };
  
    // Send POST request to Flask API
    fetch(`http://localhost:5000/users/${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then(response => response.json())
      .then(data => {
        // Display response
        const responseDiv = document.getElementById('response');
        responseDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the user.');
      });
  }
});
  
// Function to fetch all users
function fetchUsers() {
    fetch('http://localhost:5000/users')
      .then(response => response.json())
      .then(data => {
        // Display users
        const responseDiv = document.getElementById('response');
        responseDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  // Add event listener for form submission
  document.getElementById('user-form').addEventListener('submit', createUser);
  
  // Fetch users on page load
  window.onload = fetchUsers;