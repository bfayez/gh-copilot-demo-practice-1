using albums_api.Controllers;
using albums_api.Models;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace albums_api.Tests;

public class AlbumControllerTests
{
    private readonly AlbumController controller = new();

    [Fact]
    public void Get_ReturnsSeededAlbumsWithArtistDetails()
    {
        var result = Assert.IsType<OkObjectResult>(controller.Get());
        var albums = Assert.IsType<List<Album>>(result.Value);

        Assert.NotEmpty(albums);
        Assert.All(albums, album =>
        {
            Assert.False(string.IsNullOrWhiteSpace(album.Artist.Name));
            Assert.False(string.IsNullOrWhiteSpace(album.Artist.BirthPlace));
            Assert.NotEqual(default, album.Artist.Birthdate);
        });
    }

    [Fact]
    public void GetByYear_ReturnsOnlyAlbumsFromRequestedYear()
    {
        var result = Assert.IsType<OkObjectResult>(controller.GetByYear(2020));
        var albums = Assert.IsType<List<Album>>(result.Value);

        Assert.NotEmpty(albums);
        Assert.All(albums, album => Assert.Equal(2020, album.Year));
    }

    [Fact]
    public void CreateUpdateDelete_ManagesAlbumLifecycle()
    {
        var request = NewAlbum("Unit Test Album", 2035);
        Album? createdAlbum = null;

        try
        {
            var createResult = Assert.IsType<CreatedAtActionResult>(controller.Create(request));
            createdAlbum = Assert.IsType<Album>(createResult.Value);
            Assert.True(createdAlbum.Id > 0);
            Assert.Equal(nameof(AlbumController.Get), createResult.ActionName);
            Assert.Equal(request.Artist.Name, createdAlbum.Artist.Name);

            var getResult = Assert.IsType<OkObjectResult>(controller.Get(createdAlbum.Id));
            Assert.Equal(createdAlbum, Assert.IsType<Album>(getResult.Value));

            var updateRequest = NewAlbum("Updated Unit Test Album", 2036);
            var updateResult = Assert.IsType<OkObjectResult>(controller.Update(createdAlbum.Id, updateRequest));
            var updatedAlbum = Assert.IsType<Album>(updateResult.Value);
            Assert.Equal(createdAlbum.Id, updatedAlbum.Id);
            Assert.Equal("Updated Unit Test Album", updatedAlbum.Title);
            Assert.Equal(2036, updatedAlbum.Year);

            var yearResult = Assert.IsType<OkObjectResult>(controller.GetByYear(2036));
            var albumsByYear = Assert.IsType<List<Album>>(yearResult.Value);
            Assert.Contains(albumsByYear, album => album.Id == createdAlbum.Id);

            Assert.IsType<NoContentResult>(controller.Delete(createdAlbum.Id));
            Assert.IsType<NotFoundResult>(controller.Get(createdAlbum.Id));
            createdAlbum = null;
        }
        finally
        {
            if (createdAlbum is not null)
            {
                Album.Delete(createdAlbum.Id);
            }
        }
    }

    [Fact]
    public void UpdateAndDelete_ReturnNotFoundForMissingAlbum()
    {
        const int missingId = int.MaxValue;

        Assert.IsType<NotFoundResult>(controller.Update(missingId, NewAlbum("Missing", 2037)));
        Assert.IsType<NotFoundResult>(controller.Delete(missingId));
    }

    private static Album NewAlbum(string title, int year)
    {
        return new Album(
            0,
            title,
            new Artist("Test Artist", new DateOnly(1991, 5, 14), "Test City"),
            year,
            9.99m,
            "https://example.com/album.jpg");
    }
}