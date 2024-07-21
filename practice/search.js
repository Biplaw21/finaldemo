document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestions');
  
    // Array of suggestions with text and URLs
    const suggestions = [
      { text: 'Home', url: 'index.html' },
      { text: 'Pricing', url: 'pricing.html' },
      { text: 'Services', url: 'services.html' },
      { text: 'About Us', url: 'about.html' },
      { text: 'Contact', url: '#footer' }
    ];
  
    // Event listener for input changes in the search field
    searchInput.addEventListener('input', function () {
      const query = searchInput.value.toLowerCase();
      suggestionsContainer.innerHTML = ''; // Clear previous suggestions
  
      if (query) {
        // Filter suggestions based on the query
        const filteredSuggestions = suggestions.filter(suggestion =>
          suggestion.text.toLowerCase().includes(query)
        );
  
        // Populate the suggestions container with filtered suggestions
        filteredSuggestions.forEach(suggestion => {
          const div = document.createElement('div');
          div.className = 'suggestion-item p-2 cursor-pointer';
          div.textContent = suggestion.text;
          div.addEventListener('click', function () {
            window.location.href = suggestion.url;
          });
          suggestionsContainer.appendChild(div);
        });
  
        if (filteredSuggestions.length > 0) {
          suggestionsContainer.style.display = 'block'; // Show suggestions if any
        } else {
          suggestionsContainer.style.display = 'none'; // Hide if no matches
        }
      } else {
        suggestionsContainer.style.display = 'none'; // Hide if query is empty
      }
    });
  
    // Event listener to hide suggestions when clicking outside
    document.addEventListener('click', function (e) {
      if (!suggestionsContainer.contains(e.target) && e.target !== searchInput) {
        suggestionsContainer.style.display = 'none'; // Hide suggestions if clicked outside
      }
    });
  
    // Prevent form submission to handle search locally
    document.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent form from submitting and refreshing the page
      // Implement custom form submission or search handling logic here
    });
  });
  