self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          // Cache responses for required resources
          cache.put(event.request, response.clone());
          return response;
        })
      )
});
  
