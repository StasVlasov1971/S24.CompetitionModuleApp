using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using S24.CompetitionApp.Security.Authentication;

namespace S24.CompetitionApp.HttpFilters
{
    internal class SharepointCookieAuthenticationFilter : AuthorizeAttribute
    {
        private readonly IAuthenticationCookieProvider _cookieProvider;

        public SharepointCookieAuthenticationFilter(IAuthenticationCookieProvider cookieProvider)
        {
            _cookieProvider = cookieProvider;
        }

        public override void OnAuthorization(HttpActionContext actionContext)
        {

            if (IsAnonymusAccessAlowed(actionContext))
            {
                base.OnAuthorization(actionContext);
                return;
            }

            var cookie = _cookieProvider.GetCookie(actionContext);

            if (cookie.IsValid)
            {
                SetIdentity(cookie);
            }
            else
            {
                HandleUnauthorizedRequest(actionContext);
            }

            base.OnAuthorization(actionContext);
        }

        public override Task OnAuthorizationAsync(HttpActionContext actionContext, CancellationToken cancellationToken)
        {

            if (IsAnonymusAccessAlowed(actionContext))
            {
                return base.OnAuthorizationAsync(actionContext, cancellationToken);
            }

            var cookie = _cookieProvider.GetCookie(actionContext);

            if (cookie.IsValid)
            {
                SetIdentity(cookie);
            }
            else
            {
                HandleUnauthorizedRequest(actionContext);
            }

            return base.OnAuthorizationAsync(actionContext, cancellationToken);
        }

        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
            base.HandleUnauthorizedRequest(actionContext);
        }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var cookie = _cookieProvider.GetCookie(actionContext);
            return cookie.IsValid;
        }

        private bool IsAnonymusAccessAlowed(HttpActionContext actionContext)
        {
            if (actionContext == null) { return false; }
            return actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any() ||
                actionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any();
        }

        private void SetIdentity(AuthenticationCookie cookie)
        {
            HttpContext.Current.User = new ClaimsPrincipal(_cookieProvider.CookieToClaim(cookie.UserName));
        }
    }
}