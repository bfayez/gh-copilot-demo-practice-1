import { beforeEach, describe, expect, it } from "vitest";
import { handleRequest } from "./app.js";
import { resetAlbums } from "./albums.js";

describe("album-api-v2 routes", () => {
  beforeEach(() => {
    resetAlbums();
  });

  it("lists the sample albums", () => {
    const response = handleRequest("GET", "/albums");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
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
    ]);
  });

  it("gets an album by id", () => {
    const response = handleRequest("GET", "/albums/1");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 1,
      title: "You, Me and an App Id"
    });
  });

  it("adds an album", () => {
    const response = handleRequest("POST", "/albums", {
      title: "New Album",
      artist: "New Artist",
      price: 9.99,
      image_url: "https://example.com/album.png"
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 7,
      title: "New Album",
      artist: "New Artist",
      price: 9.99,
      image_url: "https://example.com/album.png"
    });
  });

  it("updates an album", () => {
    const response = handleRequest("PUT", "/albums/1", {
      price: 11.99
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 1,
      title: "You, Me and an App Id",
      price: 11.99
    });
  });

  it("deletes an album", () => {
    const response = handleRequest("DELETE", "/albums/1");

    expect(response.status).toBe(204);
    expect(response.body).toBeUndefined();
    expect(handleRequest("GET", "/albums/1").status).toBe(404);
  });
});
