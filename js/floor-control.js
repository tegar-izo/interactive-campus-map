// Membuat tombol pemilih lantai secara dinamis di dalam container.

export function createFloorControl({ container, floors, initialFloor, floorStyle, onSelect }) {
  container.innerHTML = '';
  const buttons = new Map();

  floors
    .slice()
    .sort((a, b) => b - a) // tampilkan lantai tertinggi di atas
    .forEach((floorId) => {
      const btn = document.createElement('button');
      btn.textContent = floorStyle[floorId].label;

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
