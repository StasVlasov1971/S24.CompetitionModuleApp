using System;
using System.Collections.Generic;
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
    public class AuthorizeKamOrScm : AuthorizeAttribute
    {
        private static readonly ILogger Logger = LogManager.GetLogger("HomeController");

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var sharepointSettings = DependencyResolver.Current.GetService<SharepointAuthenticationSettings>();
            
            if (sharepointSettings.IsAuthenticationEnabled)
            {
                var username = actionContext.RequestContext.Principal.Identity.Name;
                Logger.Info($"OnAuthorization - username is '{username}'");
                if (!username.StartsWith("i:"))
                {
                    username = "i:" + username;
                    Logger.Info($"OnAuthorization - username turn into '{username}'");
                }

                try
                {
                    // get user roles and information
                    Logger.Info($"OnAuthorization - getting user roles and information");
                    bool userIsKam;
                    try
                    {
                        var usersInScm = GetUsersInSharePointGroup("Santander 24 SCM");
                        Logger.Info($"OnAuthorization - usersInKam is '{usersInScm}'");

                        var usersInKam = GetUsersInSharePointGroup("Santander 24 KAM");
                        Logger.Info($"OnAuthorization - usersInKam is '{usersInKam}'");

                        userIsKam = usersInKam.Any(user => user == username) ||
                                    usersInScm.Any(user => user == username);
                        Logger.Info($"OnAuthorization - userIsKam is '{userIsKam}'");

                    }
                    catch (Exception e)
                    {
                        Logger.Info($"OnAuthorization - userIsKam was set in 'true' ");
                        userIsKam = true;
                    }
                    
                    if (!userIsKam)
                    {
                        Logger.Info($"OnAuthorization - HandleUnauthorizedRequest(actionContext) - is starting");
                        HandleUnauthorizedRequest(actionContext);
                        Logger.Info($"OnAuthorization - HandleUnauthorizedRequest(actionContext) - finished");
                    }
                }
                catch (Exception e)
                {
                    Logger.Error(e, "Error when checking sharepoint userGroup for KAM or SCM ('Santander 24 KAM' and 'Santander 24 SCM'");
                    throw;
                }
            }
            base.OnAuthorization(actionContext);
        }

        private static List<string> GetUsersInSharePointGroup(string groupName)
        {
            var scmService2Adapter = DependencyResolver.Current.GetService<IScmServiceAdapter>();
            try
            {
                var usersInKam = scmService2Adapter.GetUsersInSharePointGroup(groupName, false);
                return usersInKam;
            }
            catch (Exception e)
            {
                Logger.Error(e, $"Error when checking sharepoint group '{groupName}'");
                throw;
            }
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