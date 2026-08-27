export interface Album {
  id: number;
  title: string;
  artist: string;
  price: number;
  image_url: string;
}

const sampleAlbums: Album[] = [
  {
    id: 1,
    title: "You, Me and an App Id",
    artist: "Daprize",
    price: 10.99,
    image_url: "https://aka.ms/albums-daprlogo"
  },
  {
    id: 2,
    title: "Seven Revision Army",
    artist: "The Blue-Green Stripes",
    price: 13.99,
    image_url: "https://aka.ms/albums-containerappslogo"
  },
  {
    id: 3,
    title: "Scale It Up",
    artist: "KEDA Club",
    price: 13.99,
    image_url: "https://aka.ms/albums-kedalogo"
  },
  {
    id: 4,
    title: "Lost in Translation",
    artist: "MegaDNS",
    price: 12.99,
    image_url: "https://aka.ms/albums-envoylogo"
  },
  {
    id: 5,
    title: "Lock Down Your Love",
    artist: "V is for VNET",
    price: 12.99,
    image_url: "https://aka.ms/albums-vnetlogo"
  },
  {
    id: 6,
    title: "Sweet Container O' Mine",
    artist: "Guns N Probeses",
    price: 14.99,
    image_url: "https://aka.ms/albums-containerappslogo"
  }
];

let albums = structuredClone(sampleAlbums);

export function resetAlbums(): void {
  albums = structuredClone(sampleAlbums);
}

export function listAlbums(): Album[] {
  return albums;
}

export function getAlbum(id: number): Album | undefined {
  return albums.find((album) => album.id === id);
}

export function addAlbum(album: Omit<Album, "id"> & Partial<Pick<Album, "id">>): Album {
  const nextId = album.id ?? Math.max(0, ...albums.map((item) => item.id)) + 1;
  const newAlbum = { ...album, id: nextId };
  albums.push(newAlbum);
  return newAlbum;
}

export function updateAlbum(id: number, updates: Partial<Omit<Album, "id">>): Album | undefined {
  const index = albums.findIndex((album) => album.id === id);

  if (index === -1) {
    return undefined;
  }

  albums[index] = { ...albums[index], ...updates, id };
  return albums[index];
}

export function deleteAlbum(id: number): boolean {
  const initialLength = albums.length;
  albums = albums.filter((album) => album.id !== id);
  return albums.length !== initialLength;
}
