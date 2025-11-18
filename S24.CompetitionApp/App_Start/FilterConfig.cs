using S24.CompetitionApp.Security.Authentication.Sharepoint;
using System.Web.Http;
using System.Web.Mvc;
using S24.CompetitionApp.HttpFilters;

namespace S24.CompetitionApp
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterHttpFilters(HttpConfiguration configuration)
        {
            var sharepointSettings = DependencyResolver.Current.GetService<SharepointAuthenticationSettings>();

            if (sharepointSettings.IsAuthenticationEnabled)
            {
                configuration.Filters.Add(DependencyResolver.Current.GetService<SharepointCookieAuthenticationFilter>());
            }
        }
    }
}
