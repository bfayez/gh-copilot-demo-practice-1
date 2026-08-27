using Microsoft.Data.SqlClient;
using System.Data;

namespace UnsecureApp.Controllers
{
    public sealed class MyController
    {
        private readonly string allowedDirectory;
        private readonly string connectionString;

        public MyController(string allowedDirectory, string connectionString)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(allowedDirectory);
            ArgumentException.ThrowIfNullOrWhiteSpace(connectionString);

            this.allowedDirectory = Path.GetFullPath(allowedDirectory);
            this.connectionString = connectionString;
        }

        public string ReadFile(string userInput)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(userInput);

            var filePath = Path.GetFullPath(userInput, allowedDirectory);
            var relativePath = Path.GetRelativePath(allowedDirectory, filePath);
            if (relativePath == ".." || relativePath.StartsWith($"..{Path.DirectorySeparatorChar}"))
            {
                throw new UnauthorizedAccessException("The requested file is outside the allowed directory.");
            }

            return File.ReadAllText(filePath);
        }

        public int GetProduct(string productName)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(productName);

            using var connection = new SqlConnection(connectionString);
            using var sqlCommand = new SqlCommand(
                "SELECT ProductId FROM Products WHERE ProductName = @productName",
                connection);
            sqlCommand.CommandType = CommandType.Text;
            sqlCommand.Parameters.Add("@productName", SqlDbType.NVarChar, 200).Value = productName;

            connection.Open();
            var productId = sqlCommand.ExecuteScalar();
            if (productId is null || productId == DBNull.Value)
            {
                throw new KeyNotFoundException($"No product named '{productName}' was found.");
            }

            return Convert.ToInt32(productId);
        }
    }
}