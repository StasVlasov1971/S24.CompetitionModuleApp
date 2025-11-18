namespace S24.CompetitionApp.Security.Authentication.Sharepoint
{
    public interface ISharepointAuthenticationCookieValidator
    {
        bool IsValid(SharepointAuthenticationCookie cookie);
    }
}