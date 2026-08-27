using System.Text.Json.Serialization;

namespace albums_api.Models
{
    public record Album(
        int Id,
        string Title,
        Artist Artist,
        int Year,
        decimal Price,
        [property: JsonPropertyName("image_url")] string ImageUrl)
    {
        private static readonly object SyncRoot = new();
        private static readonly List<Album> Albums =
        [
            new Album(1, "You, Me and an App Id", new Artist("Daprize", new DateOnly(1988, 4, 12), "Seattle, USA"), 2020, 10.99m, "https://aka.ms/albums-daprlogo"),
            new Album(2, "Seven Revision Army", new Artist("The Blue-Green Stripes", new DateOnly(1985, 9, 23), "Detroit, USA"), 2019, 13.99m, "https://aka.ms/albums-containerappslogo"),
            new Album(3, "Scale It Up", new Artist("KEDA Club", new DateOnly(1990, 2, 8), "Amsterdam, Netherlands"), 2021, 13.99m, "https://aka.ms/albums-kedalogo"),
            new Album(4, "Lost in Translation", new Artist("MegaDNS", new DateOnly(1982, 11, 17), "London, UK"), 2018, 12.99m, "https://aka.ms/albums-envoylogo"),
            new Album(5, "Lock Down Your Love", new Artist("V is for VNET", new DateOnly(1992, 6, 4), "Redmond, USA"), 2020, 12.99m, "https://aka.ms/albums-vnetlogo"),
            new Album(6, "Sweet Container O' Mine", new Artist("Guns N Probeses", new DateOnly(1987, 12, 19), "Los Angeles, USA"), 2021, 14.99m, "https://aka.ms/albums-containerappslogo")
        ];

        public static List<Album> GetAll()
        {
            lock (SyncRoot)
            {
                return Albums.ToList();
            }
        }

        public static Album? GetById(int id)
        {
            lock (SyncRoot)
            {
                return Albums.FirstOrDefault(album => album.Id == id);
            }
        }

        public static List<Album> GetByYear(int year)
        {
            lock (SyncRoot)
            {
                return Albums.Where(album => album.Year == year).ToList();
            }
        }

        public static Album Create(Album album)
        {
            lock (SyncRoot)
            {
                var createdAlbum = album with { Id = Albums.Max(existingAlbum => existingAlbum.Id) + 1 };
                Albums.Add(createdAlbum);
                return createdAlbum;
            }
        }

        public static Album? Update(int id, Album album)
        {
            lock (SyncRoot)
            {
                var index = Albums.FindIndex(existingAlbum => existingAlbum.Id == id);
                if (index < 0)
                {
                    return null;
                }

                var updatedAlbum = album with { Id = id };
                Albums[index] = updatedAlbum;
                return updatedAlbum;
            }
        }

        public static bool Delete(int id)
        {
            lock (SyncRoot)
            {
                return Albums.RemoveAll(album => album.Id == id) > 0;
            }
        }
    }
}
