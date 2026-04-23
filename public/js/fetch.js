document.addEventListener('DOMContentLoaded', () => {
  const randomPage1 = Math.floor(Math.random() * 20);
  const randomPage2 = Math.floor(Math.random() * 20);
  const randomPage3 = Math.floor(Math.random() * 20);

  function createCard(show) {
    const div = document.createElement('div');
    div.style.cssText = 'width:17%; text-align:center; cursor:pointer; margin-bottom:20px';
    const poster = show.image ? show.image.medium : 'https://via.placeholder.com/210x295?text=No+Image';
    const rating = show.rating?.average ?? 'N/A';
    const genre = show.genres?.[0] ?? '';
    div.innerHTML = `
      <img src="${poster}" alt="${show.name}" style="width:100%; border-radius:5px; margin-block:15px; transition:0.3s"
        onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
      <p style="font-size:13px; font-weight:600">${show.name}</p>
      <p style="font-size:12px; color:green">⭐ ${rating}/10</p>
      <p style="font-size:11px; color:gray">${genre}</p>
    `;
    div.addEventListener('click', () => openModal(show));
    return div;
  }

  function loadShows(page, cardId) {
    fetch(`https://api.tvmaze.com/shows?page=${page}`)
      .then(res => res.json())
      .then(data => {
        const cardContainer = document.getElementById(cardId);
        cardContainer.innerHTML = '';
        const shuffled = data.sort(() => Math.random() - 0.5);
        shuffled.slice(0, 5).forEach(show => cardContainer.appendChild(createCard(show)));
      })
      .catch(() => {
        document.getElementById(cardId).innerHTML = '<p style="color:red; text-align:center">Failed to load.</p>';
      });
  }

  function openModal(show) {
    // Store current show globally so booking.js can access it
    window.currentShow = show;

    document.getElementById('movieModal').style.display = 'flex';
    document.getElementById('modalTitle').innerText = show.name;
    document.getElementById('modalImg').src = show.image?.medium ?? 'https://via.placeholder.com/210x295?text=No+Image';
    document.getElementById('modalDesc').innerHTML = show.summary ?? 'No description available';
    document.getElementById('modalRating').innerText = show.rating?.average ?? 'N/A';
    document.getElementById('modalGenres').innerText = show.genres?.join(', ') ?? '';
    document.getElementById('modalPremiered').innerText = show.premiered ?? 'N/A';
    document.getElementById('modalActors').innerText = 'Fetching...';

    fetch(`https://api.tvmaze.com/shows/${show.id}/cast`)
      .then(res => res.json())
      .then(cast => {
        const names = cast.map(c => c.person.name);
        document.getElementById('modalActors').innerText = names.join(', ') || 'N/A';
      });
  }

  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('movieModal').style.display = 'none';
    window.currentShow = null;
  });

  loadShows(randomPage1, 'movieCard');
  loadShows(randomPage2, 'eventCard');
  loadShows(randomPage3, 'premiereCard');
});
