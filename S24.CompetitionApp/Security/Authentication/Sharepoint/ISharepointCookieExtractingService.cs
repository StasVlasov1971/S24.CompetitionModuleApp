using System.Net.Http.Headers;

namespace S24.CompetitionApp.Security.Authentication.Sharepoint
{
    public interface ISharepointCookieExtractingService
    {
        string ExtractCookie(HttpRequestHeaders headers);
    }
}