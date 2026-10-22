// Mengambil file GeoJSON dari server.

export async function loadFloorData(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Gagal memuat ${path} (HTTP ${res.status})`);
  }
  return res.json();
}
