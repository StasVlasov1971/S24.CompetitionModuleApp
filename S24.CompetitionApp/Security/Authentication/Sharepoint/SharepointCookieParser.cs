using System;
using System.Globalization;
using System.Xml;

namespace S24.CompetitionApp.Security.Authentication.Sharepoint
{
    public class SharepointCookieParsingService : ISharepointCookieParsingService
    {
        private const char CookieSeparator = ',';
        private readonly SharepointAuthenticationSettings _settings;

        public SharepointCookieParsingService(SharepointAuthenticationSettings settings)
        {
            _settings = settings;
        }

        public SharepointAuthenticationCookie Parse(string rawCookieValue)
        {
            if (string.IsNullOrEmpty(rawCookieValue)) { return SharepointAuthenticationCookie.Invalid; }

            try
            {
                byte[] rawString = Convert.FromBase64String(rawCookieValue);
                var rawCookie = ReadCookie(rawString);
                var values = rawCookie?.Split(_settings.CookieSeparator);
                var userKey = GetUserKey(values);
                var userName = GetUserName(values);
                var expires = GetExpiry(values);
                var isPersisted = GetPersisted(values);
                var audienceUrl = GetAudience(values);
                var signature = GetSignature(values);

                return new SharepointAuthenticationCookie(userName, userKey, signature, isPersisted, expires, audienceUrl);
            }
            catch (Exception ex)
            {
                return SharepointAuthenticationCookie.Invalid;
            }
        }

        private string GetSignature(string[] cookieArray)
        {
            return cookieArray[4];
        }

        private Uri GetAudience(string[] cookieArray)
        {
            return new Uri(cookieArray[5]);
        }

        private bool GetPersisted(string[] cookieArray)
        {
            var rawValue = cookieArray[3];
            return string.Equals(rawValue, bool.TrueString, StringComparison.OrdinalIgnoreCase);
        }

        private DateTime GetExpiry(string[] cookieArray)
        {
            var rawValue = cookieArray[2];
            return DateTime.FromFileTime(long.Parse(rawValue, CultureInfo.InvariantCulture));
        }

        private string GetUserKey(string[] cookieArray)
        {
            return cookieArray[0];
        }

        private string GetUserName(string[] cookieArray)
        {
            return cookieArray[1];
        }

        private string ReadCookie(byte[] cookieContent)
        {
            using (var textReader = XmlDictionaryReader.CreateTextReader(cookieContent, XmlDictionaryReaderQuotas.Max))
            {
                if (textReader.IsStartElement("SP"))
                {
                    return textReader.ReadElementContentAsString();
                }
            }
            return null;
        }
    }
}