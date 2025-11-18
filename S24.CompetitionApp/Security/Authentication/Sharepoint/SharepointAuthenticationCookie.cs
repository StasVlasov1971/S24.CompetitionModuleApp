using System;

namespace S24.CompetitionApp.Security.Authentication.Sharepoint
{
    public class SharepointAuthenticationCookie
    {

        public static SharepointAuthenticationCookie Invalid => new SharepointAuthenticationCookie();

        public string UserName { get; } = string.Empty;

        public string UserKey { get; } = string.Empty;

        public string Signature { get; } = string.Empty;

        public bool IsPersisted { get; }

        public DateTime Expires { get; }

        public Uri AudienceUrl { get; }

        public SharepointAuthenticationCookie(string userName, string userKey, string signature, bool isPersisted, DateTime expires, Uri audienceUrl)
        {
            UserName = userName;
            UserKey = userKey;
            Signature = signature;
            IsPersisted = isPersisted;
            Expires = expires;
            AudienceUrl = audienceUrl;
        }

        private SharepointAuthenticationCookie() { }
    }
}