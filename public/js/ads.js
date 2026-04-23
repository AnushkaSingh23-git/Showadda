(function () {
  const INTERVAL = 5000;

  const panel    = document.getElementById('bannerAdPanel');
  const content  = document.getElementById('bannerAdContent');
  const dotsWrap = document.getElementById('bannerAdDots');
  const progress = document.getElementById('bannerAdProgress');
  const closeBtn = document.getElementById('bannerAdClose');

  if (!panel || !content) return;

  let movies  = [];
  let current = 0;
  let timer   = null;

  // gradient overlays for variety
  const GRADIENTS = [
    'linear-gradient(160deg,#0f0c29,#302b63,#24243e)',
    'linear-gradient(160deg,#134e5e,#1a6b4a)',
    'linear-gradient(160deg,#c94b4b,#4b134f)',
    'linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)',
    'linear-gradient(160deg,#373b44,#4286f4)',
    'linear-gradient(160deg,#4b1248,#f10711)',
  ];

  function buildDots(count) {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const d = document.createElement('div');
      d.style.cssText = `width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,${i===0?'0.9':'0.25'});transition:background 0.3s;`;
      dotsWrap.appendChild(d);
    }
  }

  function showSlide(idx) {
    current = (idx + movies.length) % movies.length;
    const m  = movies[current];
    const bg = m.image?.medium
      ? `url('${m.image.medium}') center/cover no-repeat`
      : GRADIENTS[current % GRADIENTS.length];

    content.style.opacity    = '0';
    content.style.transition = 'opacity 0.35s';

    setTimeout(() => {
      // if poster available, show it with overlay; else use gradient + emoji
      if (m.image?.medium) {
        content.innerHTML = `
          <div style="position:relative;width:100%;border-radius:10px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.5);">
            <img src="${m.image.medium}" alt="${m.name}"
              style="width:100%;height:160px;object-fit:cover;display:block;">
            <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.1) 60%);"></div>
            <div style="position:absolute;bottom:0;left:0;right:0;padding:10px 12px;">
              <div style="font-size:13px;font-weight:800;color:#fff;line-height:1.2;">${m.name}</div>
              <div style="font-size:10px;color:rgba(255,255,255,0.7);margin-top:3px;">
                ⭐ ${m.rating?.average ?? 'N/A'} &nbsp;·&nbsp; ${m.genres?.slice(0,2).join(', ') || 'Entertainment'}
              </div>
            </div>
          </div>
          <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:rgb(244,69,98);margin-top:4px;">🎬 NOW SHOWING</div>
        `;
      } else {
        content.innerHTML = `
          <div style="font-size:42px;line-height:1;">🎬</div>
          <div style="font-size:13px;font-weight:800;color:#fff;line-height:1.3;text-align:center;">${m.name}</div>
          <div style="font-size:10px;color:rgba(255,255,255,0.65);">
            ⭐ ${m.rating?.average ?? 'N/A'} &nbsp;·&nbsp; ${m.genres?.slice(0,2).join(', ') || 'Entertainment'}
          </div>
          <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:rgb(244,69,98);">🎟 NOW SHOWING</div>
        `;
      }

      // update background
      const card = document.getElementById('bannerAdCard');
      if (card) {
        card.style.background = m.image?.medium
          ? 'rgba(10,10,20,0.92)'
          : GRADIENTS[current % GRADIENTS.length].replace('linear-gradient', 'linear-gradient') + ', rgba(0,0,0,0.3)';
        card.style.backdropFilter = 'blur(10px)';
      }

      content.style.opacity = '1';
    }, 350);

    // dots
    dotsWrap.querySelectorAll('div').forEach((d, i) => {
      d.style.background = i === current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)';
    });

    // progress bar
    progress.style.transition = 'none';
    progress.style.width = '0%';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      progress.style.transition = `width ${INTERVAL}ms linear`;
      progress.style.width = '100%';
    }));

    clearTimeout(timer);
    timer = setTimeout(() => showSlide(current + 1), INTERVAL);
  }

  // fetch movies from TVMaze, pick top-rated ones with posters
  fetch('https://api.tvmaze.com/shows?page=0')
    .then(r => r.json())
    .then(data => {
      movies = data
        .filter(m => m.image?.medium && m.rating?.average >= 7)
        .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
        .slice(0, 8);

      if (!movies.length) {
        // fallback: any shows with images
        movies = data.filter(m => m.image?.medium).slice(0, 8);
      }

      buildDots(movies.length);
      showSlide(0);
    })
    .catch(() => {
      // fallback static movie ads if API fails
      movies = [
        { name: 'Avengers: Secret Wars', rating: { average: 9.1 }, genres: ['Action','Adventure'], image: null },
        { name: 'Inception 2',           rating: { average: 8.8 }, genres: ['Thriller','Sci-Fi'],  image: null },
        { name: 'KGF Chapter 3',         rating: { average: 8.5 }, genres: ['Action','Drama'],     image: null },
      ];
      buildDots(movies.length);
      showSlide(0);
    });

  // close button
  closeBtn.addEventListener('click', () => {
    clearTimeout(timer);
    panel.style.transition = 'opacity 0.3s, transform 0.3s';
    panel.style.opacity    = '0';
    panel.style.transform  = 'translateY(-50%) scale(0.9)';
    setTimeout(() => panel.remove(), 300);
  });
  closeBtn.addEventListener('mouseenter', () => { closeBtn.style.color = '#fff'; });
  closeBtn.addEventListener('mouseleave', () => { closeBtn.style.color = 'rgba(255,255,255,0.55)'; });
})();
