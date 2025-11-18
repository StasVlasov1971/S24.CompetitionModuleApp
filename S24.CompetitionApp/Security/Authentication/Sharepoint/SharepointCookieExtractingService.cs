using System;
using System.Linq;
using System.Net.Http.Headers;

namespace S24.CompetitionApp.Security.Authentication.Sharepoint
{
    public class SharepointCookieExtractingService : ISharepointCookieExtractingService
    {
        private readonly SharepointAuthenticationSettings _settings;

        public SharepointCookieExtractingService(SharepointAuthenticationSettings settings)
        {
            _settings = settings;
        }

        public string ExtractCookie(HttpRequestHeaders headers)
        {
            if (headers == null) { return string.Empty; }

            var cookiesRaw = headers.FirstOrDefault(c => c.Key == "Cookie").Value as string[];

            if (cookiesRaw != null && cookiesRaw.Any())
            {
                var cookieCollection = cookiesRaw[0].Split(';');

                foreach (var cookieObject in cookieCollection)
                {
                    var splitPosition = cookieObject.IndexOf("=", StringComparison.InvariantCulture);
                    var cookieName = cookieObject.Substring(0, splitPosition).Trim();

                    if (cookieName == _settings.AuthCookieName)
                    {
                        return cookieObject.Substring(splitPosition + 1).Trim();
                    }
                }
            }

            return string.Empty;
        }
    }
}