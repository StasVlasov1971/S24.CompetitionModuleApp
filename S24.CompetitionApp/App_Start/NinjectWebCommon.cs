using System;
using System.Configuration;
using System.Web;
using System.Web.Http;
using Microsoft.Web.Infrastructure.DynamicModuleHelper;
using Ninject;
using Ninject.Web.Common;
using Ninject.Web.Common.WebHost;
using Ninject.Web.WebApi;
using S24.CompetitionApp;
using S24.CompetitionApp.ClientService;
using S24.CompetitionApp.HttpFilters;
using S24.CompetitionApp.Security.Authentication;
using S24.CompetitionApp.Security.Authentication.Sharepoint;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(NinjectWebCommon), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethod(typeof(NinjectWebCommon), "Stop")]

namespace S24.CompetitionApp
{
    public static class NinjectWebCommon
    {
        private static readonly Bootstrapper Bootstrapper = new Bootstrapper();

        /// <summary>
        /// Starts the application
        /// </summary>
        public static void Start()
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            Bootstrapper.Initialize(CreateKernel);
        }

        /// <summary>
        /// Stops the application.
        /// </summary>
        public static void Stop()
        {
            Bootstrapper.ShutDown();
        }

        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
            kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();

            RegisterServices(kernel);
            GlobalConfiguration.Configuration.DependencyResolver = new NinjectDependencyResolver(kernel);
            
            return kernel;
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
            kernel.Bind<IScmServiceAdapter>().To<ScmServiceAdapter>()
                .WithConstructorArgument("endpointName", "CustomBinding_ISCMService2")
                .WithConstructorArgument("userName", ConfigurationManager.AppSettings["SCMService2.Service.Username"])
                .WithConstructorArgument("password", ConfigurationManager.AppSettings["SCMService2.Service.Password"])
                .WithConstructorArgument("cacheDurationMinutes", int.Parse(ConfigurationManager.AppSettings["CacheDurationInMinutes"]));


            kernel.Bind<SharepointAuthenticationSettings>().ToSelf().WithConstructorArgument(ConfigurationManager.AppSettings);
            kernel.Bind<ISharepointAuthenticationCookieValidator>().To<SharepointAuthenticationCookieValidator>();
            kernel.Bind<ISharepointCookieExtractingService>().To<SharepointCookieExtractingService>();
            kernel.Bind<ISharepointCookieParsingService>().To<SharepointCookieParsingService>();
            kernel.Bind<IAuthenticationCookieProvider>().To<SharepointAuthenticationCookieProvider>();
            kernel.Bind<SharepointCookieAuthenticationFilter>().ToSelf();
        }
    }
}