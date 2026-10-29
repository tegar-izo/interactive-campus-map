// Membuat tombol pemilih lantai bulat (1, 2, 3) di dalam container.

export function createFloorControl({ container, floors, initialFloor, floorStyle, onSelect }) {
  container.innerHTML = '';
  const buttons = new Map();

  floors
    .slice()
    .sort((a, b) => a - b) // lantai 1 di atas, sesuai desain
    .forEach((floorId) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = floorId;
      btn.title = floorStyle[floorId].label;
      btn.setAttribute('aria-label', floorStyle[floorId].label);

      btn.addEventListener('click', () => {
        buttons.forEach((b, id) => b.classList.toggle('active', id === floorId));
        onSelect(floorId);
      });

      buttons.set(floorId, btn);
      container.appendChild(btn);
    });

  // Tandai lantai awal sebagai aktif
  buttons.get(initialFloor).classList.add('active');
}
