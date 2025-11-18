using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Mvc;
using NLog;
using S24.CompetitionApp.ClientService;
using S24.CompetitionApp.Security.Authentication.Sharepoint;
using AuthorizeAttribute = System.Web.Http.AuthorizeAttribute;

namespace S24.CompetitionApp.HttpFilters
{
    public class AuthorizeScm : AuthorizeAttribute
    {

        private static readonly ILogger Logger = LogManager.GetLogger("HomeController");

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var sharepointSettings = DependencyResolver.Current.GetService<SharepointAuthenticationSettings>();
            var scmService2Adapter = DependencyResolver.Current.GetService<IScmServiceAdapter>();

            if (sharepointSettings.IsAuthenticationEnabled)
            {
                var username = actionContext.RequestContext.Principal.Identity.Name;

                if (!username.StartsWith("i:"))
                {
                    username = "i:" + username;
                }

                try
                {

                }
                catch (Exception e)
                {
                    Logger.Error(e, "Error when checking sharepoint userGroup for SCM");
                    throw;
                }
                // get user roles and information
                var usersInScm = scmService2Adapter.GetUsersInSharePointGroup("Santander 24 SCM", false);
                var userIsScm = usersInScm.Any(user => user == username);

                if (!userIsScm)
                {
                    HandleUnauthorizedRequest(actionContext);
                }
            }

            base.OnAuthorization(actionContext);
        }


        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var sharepointSettings = DependencyResolver.Current.GetService<SharepointAuthenticationSettings>();

            return !sharepointSettings.IsAuthenticationEnabled || actionContext.RequestContext.Principal.Identity.IsAuthenticated;
        }


        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
            base.HandleUnauthorizedRequest(actionContext);
        }
    }
}