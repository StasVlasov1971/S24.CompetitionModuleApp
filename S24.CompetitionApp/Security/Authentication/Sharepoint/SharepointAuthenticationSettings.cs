using System.Collections.Specialized;

namespace S24.CompetitionApp.Security.Authentication.Sharepoint
{
    public class SharepointAuthenticationSettings
    {
        private const string AuthCookieNameKey = "Security.SharePoint.AuthCookieName";
        private const string CertificateThumbprintKey = "Security.SharePoint.CertificateThumbprint";
        private const string UseSharePointCookieAuthenticationKey = "Security.SharePoint.UseSharePointCookieAuthentication";
        
        public readonly string AuthCookieName = "FedAuth";
        public readonly string ClaimUserNameTypeId = @"http://signicat.com/claims/2010/12/uniqueid";
        public readonly bool IsAuthenticationEnabled = true;
        public readonly string AuthentificationMethod = "SharepointAuthentication";
        public readonly string CertificateThumbprint = string.Empty;
        public readonly char CookieSeparator = ',';

        public SharepointAuthenticationSettings(NameValueCollection appSettings)
        {
            AuthCookieName = appSettings[AuthCookieNameKey] ?? AuthCookieName;
            CertificateThumbprint = appSettings[CertificateThumbprintKey] ?? CertificateThumbprint;
            bool.TryParse(appSettings[UseSharePointCookieAuthenticationKey] ?? "true", out IsAuthenticationEnabled);
        }
    }
}