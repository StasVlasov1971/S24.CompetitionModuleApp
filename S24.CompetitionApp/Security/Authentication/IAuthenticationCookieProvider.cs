using System.Security.Claims;
using System.Web.Http.Controllers;

namespace S24.CompetitionApp.Security.Authentication
{
    public interface IAuthenticationCookieProvider
    {
        AuthenticationCookie GetCookie(HttpActionContext actionContext);

        ClaimsIdentity CookieToClaim(string userName);
    }
}
