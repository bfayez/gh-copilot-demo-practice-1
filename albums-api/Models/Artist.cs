namespace albums_api.Models
{
    public class Artist
    {
        public Artist(string name, DateOnly birthdate, string birthPlace)
        {
            Name = name;
            Birthdate = birthdate;
            BirthPlace = birthPlace;
        }

        public string Name { get; set; }

        public DateOnly Birthdate { get; set; }

        public string BirthPlace { get; set; }
    }
}