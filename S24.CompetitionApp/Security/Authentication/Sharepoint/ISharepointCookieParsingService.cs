namespace S24.CompetitionApp.Security.Authentication.Sharepoint
{
    public interface ISharepointCookieParsingService
    {
        SharepointAuthenticationCookie Parse(string cookieRaw);
    }
}