using albums_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace albums_api.Controllers
{
    [Route("albums")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        /// <summary>
        /// Retrieves all albums.
        /// </summary>
        /// <returns>An HTTP 200 response containing the collection of albums.</returns>
        [HttpGet]
        public IActionResult Get()
        {
            var albums = Album.GetAll();

            return Ok(albums);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var album = Album.GetById(id);
            if (album == null)
            {
                return NotFound();
            }

            return Ok(album);
        }

        [HttpGet("year/{year}")]
        public IActionResult GetByYear(int year)
        {
            return Ok(Album.GetByYear(year));
        }

        [HttpPost]
        public IActionResult Create(Album album)
        {
            var createdAlbum = Album.Create(album);

            return CreatedAtAction(nameof(Get), new { id = createdAlbum.Id }, createdAlbum);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Album album)
        {
            var updatedAlbum = Album.Update(id, album);
            if (updatedAlbum == null)
            {
                return NotFound();
            }

            return Ok(updatedAlbum);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!Album.Delete(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("sorted")]
        public IActionResult GetSorted([FromQuery] string? sortBy)
        {
            var albums = Album.GetAll();
            switch (sortBy?.Trim().ToLowerInvariant())
            {
                case "title":
                    albums = albums.OrderBy(a => a.Title).ToList();
                    break;
                case "artist":
                    albums = albums.OrderBy(a => a.Artist.Name).ToList();
                    break;
                case "price":
                    albums = albums.OrderBy(a => a.Price).ToList();
                    break;
                default:
                    return BadRequest("Invalid sort parameter. Use 'title', 'artist', or 'price'.");
            }
            return Ok(albums);
        }
    }
}
