using System.Text.RegularExpressions;

namespace S24.CompetitionApp.Utilities
{
    public static class ValidationHelper
    {
        public static bool ValidateSpecialCharacters(string txt)
        {
            Regex regex = new Regex("^[a-zA-Z0-9ÆØÅזרו_\\s-]*$");
            return regex.IsMatch(txt);
        }
    }
}