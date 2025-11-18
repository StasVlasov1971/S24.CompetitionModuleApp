using NLog;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Web.Http.Controllers;

namespace S24.CompetitionApp.Security.Authentication.Sharepoint
{
    internal class SharepointAuthenticationCookieProvider : IAuthenticationCookieProvider
    {
        private readonly SharepointAuthenticationSettings _settings;
        private readonly ISharepointAuthenticationCookieValidator _validationService;
        private readonly ISharepointCookieExtractingService _extractingService;
        private readonly ISharepointCookieParsingService _parsingService;
        private static readonly ILogger Logger = LogManager.GetLogger("CompetitionController");

        public SharepointAuthenticationCookieProvider(SharepointAuthenticationSettings config,
            ISharepointAuthenticationCookieValidator cookieValidationService,
            ISharepointCookieExtractingService extractingService,
            ISharepointCookieParsingService parsingService)
        {
            _settings = config;
            _validationService = cookieValidationService;
            _extractingService = extractingService;
            _parsingService = parsingService;
        }

        public AuthenticationCookie GetCookie(HttpActionContext actionContext)
        {
            try
            {
                var cookieRaw = _extractingService.ExtractCookie(actionContext.Request.Headers);
                var sharepointCookie = _parsingService.Parse(cookieRaw);
                var isAuthenticated = _validationService.IsValid(sharepointCookie);
                return new AuthenticationCookie(sharepointCookie.UserName, isAuthenticated);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"Cannot parse cookies", $"{nameof(SharepointAuthenticationCookieProvider)}.{nameof(AuthenticationCookie)}");
                return AuthenticationCookie.InvalidAuthenticationCookie;
            }
        }

        public ClaimsIdentity CookieToClaim(string userName)
        {
            var claimsList = new List<Claim>
            {
                new Claim(_settings.ClaimUserNameTypeId, userName),
                new Claim(ClaimTypes.Name, userName)
            };

            return new ClaimsIdentity(claimsList, _settings.AuthentificationMethod);
        }
    }
}