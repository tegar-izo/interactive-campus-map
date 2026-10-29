// Kompas statis: arah utara = sumbu +Y (ke atas layar).
// Peta tidak diputar, jadi jarum selalu menunjuk ke atas.

export function createCompass({ container, config = {} }) {
  const size = config.size || 84;
  const title = config.title || 'Utara = sumbu +Y';
  const letters = config.letters || { n: 'U', e: 'T', s: 'S', w: 'B' };

  container.classList.add('compass');
  container.style.setProperty('--compass-size', `${size}px`);
  container.setAttribute('role', 'img');
  container.setAttribute('tabindex', '0');
  container.setAttribute('aria-label', `Kompas, utara ke atas. ${title}`);

  container.innerHTML = `
    <div class="compass__ring">
      <span class="compass__letter compass__letter--n">${letters.n}</span>
      <span class="compass__letter compass__letter--e">${letters.e}</span>
      <span class="compass__letter compass__letter--s">${letters.s}</span>
      <span class="compass__letter compass__letter--w">${letters.w}</span>
      <span class="compass__needle"></span>
    </div>
    <span class="compass__tip">${title}</span>
  `;

  return container;
}
