import { addAlbum, deleteAlbum, getAlbum, listAlbums, updateAlbum } from "./albums.js";

export interface ApiResponse {
  status: number;
  body: unknown;
}

const albumPathPattern = /^\/albums\/(\d+)$/;

function json(status: number, body: unknown): ApiResponse {
  return { status, body };
}

export function handleRequest(method: string, pathname: string, body?: unknown): ApiResponse {
  if (pathname === "/" && method === "GET") {
    return json(200, { message: "Hit the /albums endpoint to retrieve a list of albums!" });
  }

  if (pathname === "/albums") {
    if (method === "GET") {
      return json(200, listAlbums());
    }

    if (method === "POST") {
      return json(201, addAlbum(body as Parameters<typeof addAlbum>[0]));
    }
  }

  const albumMatch = albumPathPattern.exec(pathname);
  if (albumMatch) {
    const id = Number(albumMatch[1]);

    if (method === "GET") {
      const album = getAlbum(id);
      return album ? json(200, album) : json(404, { message: "Album not found" });
    }

    if (method === "PUT") {
      const album = updateAlbum(id, body as Parameters<typeof updateAlbum>[1]);
      return album ? json(200, album) : json(404, { message: "Album not found" });
    }

    if (method === "DELETE") {
      return deleteAlbum(id) ? json(204, undefined) : json(404, { message: "Album not found" });
    }
  }

  return json(404, { message: "Route not found" });
}
