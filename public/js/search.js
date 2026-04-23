function searchShows(){
      const query = document.getElementById('searchInput').value.trim();
      const results = document.getElementById('searchResults');

      if (!query) {
        alert('Please type something!');
        return;
      }
      results.innerHTML = '<p style="color:gray; width:100%; text-align:center">Searching...</p>';
      results.scrollIntoView({ behavior: 'smooth' });

      fetch('https://api.tvmaze.com/search/shows?q=' + encodeURIComponent(query))
        .then(function(res) { return res.json(); })
        .then(function(data) {
          results.innerHTML = '';

          if (!data || data.length === 0) {
            results.innerHTML = '<p style="color:gray">No results found for "' + query + '"</p>';
            return;
          }

          data.forEach(function(item){
            var show = item.show;
            var poster = (show.image && show.image.medium)
              ? show.image.medium
              : 'https://via.placeholder.com/210x295?text=No+Image';
            var rating = (show.rating && show.rating.average)
              ? show.rating.average
              : 'N/A';
            var genre = (show.genres && show.genres.length > 0)
              ? show.genres[0]
              : '';

            var div = document.createElement('div');
            div.style.cssText = 'width:150px; text-align:center; cursor:pointer; margin-bottom:15px';
            div.innerHTML =
              '<img src="' + poster + '" style="width:100%; border-radius:5px">' +
              '<p style="font-size:13px; font-weight:600; margin-top:5px">' + show.name + '</p>' +
              '<p style="font-size:12px; color:green">⭐ ' + rating + '</p>' +
              '<p style="font-size:11px; color:gray">' + genre + '</p>';

            results.appendChild(div);
          });
        })
      //error 
            
        .catch(function(err){
          console.error('Search error:', err);
          results.innerHTML = '<p style="color:red">Search failed. Check console (F12).</p>';
        });
    }
