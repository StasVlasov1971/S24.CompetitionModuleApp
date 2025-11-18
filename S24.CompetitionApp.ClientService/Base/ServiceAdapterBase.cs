


using NLog;

using NLog;
using System;
using System.ServiceModel;
using System.ServiceModel.Description;

namespace S24.CompetitionApp.ClientService.Base
{
    /// <summary>
    ///     Abstract class for common behaviour with client services
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public abstract class ServiceAdapterBase<T> where T : ICommunicationObject
    {
        protected readonly T Client;

        private static readonly ILogger Logger = LogManager.GetLogger(nameof(ServiceAdapterBase<T>));
        protected ServiceAdapterBase(string endpointName, string userName, string password)
        {
            if (string.IsNullOrEmpty(endpointName))
                throw new ArgumentNullException(nameof(endpointName));
            Logger.Debug($"{nameof(ServiceAdapterBase<T>)} - endpointName:'{endpointName}', username: '{userName}'" );
            
            if (string.IsNullOrEmpty(userName))
                throw new ArgumentNullException(nameof(userName));
            if (string.IsNullOrEmpty(password))
                throw new ArgumentNullException(nameof(password));

            var factory = new ChannelFactory<T>(endpointName);
            
            var defaultCredentials = factory.Endpoint.Behaviors.Find<ClientCredentials>();
            factory.Endpoint.Behaviors.Remove(defaultCredentials);

            var loginCredentials = new ClientCredentials();
            loginCredentials.UserName.UserName = userName;
            loginCredentials.UserName.Password = password;
            factory.Endpoint.Behaviors.Add(loginCredentials);
            Logger.Debug($"{nameof(ServiceAdapterBase<T>)} - loginCredentials were added");
            
            // ReSharper disable once VirtualMemberCallInConstructor
            OnBeforeChannelCreated();
            
            Client = factory.CreateChannel();
            
        }

        private static void OnBeforeChannelCreated()
        {
        }
    }
}

// step one - find and remove default endpoint behavior 



