using System;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace S24.CompetitionApp.Security.Authentication.Sharepoint
{
    /// <summary>
    /// Validates SharePointSecurity cookie. Not thread safe.
    /// </summary>
    public class SharepointAuthenticationCookieValidator : ISharepointAuthenticationCookieValidator
    {
        private static X509Certificate2 _signingCertificate;
        private readonly string _certificateThumbprint;
        private readonly string _hashAlghoritmName = "SHA256";

        public SharepointAuthenticationCookieValidator(SharepointAuthenticationSettings settings)
        {
            _certificateThumbprint = settings.CertificateThumbprint;
        }

        public bool IsValid(SharepointAuthenticationCookie cookie)
        {
            return cookie != null && TryLoadCertificate() ? cookie.Expires > DateTime.Now && ParseAndValidateSignature(cookie) : false;
        }

        private bool TryLoadCertificate()
        {
            if (_signingCertificate == null)
            {
                try
                {
                    _signingCertificate = GetCertificateFromStore(_certificateThumbprint);
                }
                catch (Exception ex)
                {
                    // Log exception ex
                }
            }

            return _signingCertificate == null ? false : true;
        }

        private X509Certificate2 GetCertificateFromStore(string certificateThumbprint)
        {
            var certStore = new X509Store(StoreLocation.LocalMachine);

            // Try to open the store.

            certStore.Open(OpenFlags.ReadOnly);
            // Find the certificate that matches the thumbprint.

            var certCollection = certStore.Certificates.Find(X509FindType.FindByThumbprint, certificateThumbprint, false);

            certStore.Close();

            var source = certCollection.OfType<X509Certificate2>().ToArray();

            return source.FirstOrDefault();
        }

        private bool ParseAndValidateSignature(SharepointAuthenticationCookie cookie)
        {

            try
            {
                var key = (RSACryptoServiceProvider)_signingCertificate.PublicKey.Key;
                var keyNumber = (int)key.CspKeyContainerInfo.KeyNumber;

                var cspParameters = new CspParameters
                {
                    ProviderType = 24,
                    KeyNumber = keyNumber
                };

                var parameters = cspParameters;

                if (key.CspKeyContainerInfo.MachineKeyStore)
                {
                    parameters.Flags = CspProviderFlags.UseMachineKeyStore;
                }
                using (var cryptoServiceProvider = new RSACryptoServiceProvider(2048, parameters))
                {
                    cryptoServiceProvider.ImportCspBlob(key.ExportCspBlob(false));
                    var sign = BuildValueToSign(cookie);
                    var signature1 = Convert.FromBase64String(cookie.Signature);
                    return cryptoServiceProvider.VerifyData(Encoding.UTF8.GetBytes(sign), HashAlgorithm.Create(_hashAlghoritmName), signature1);
                }
            }
            catch (Exception ex)
            {
                //_logger.LogException("Failed to validate signature.", $"{nameof(SharePointFedAuthCookie)}.{nameof(ValidateSignature)}", ex);
                return false;
            }
        }

        private string BuildValueToSign(SharepointAuthenticationCookie cookie)
        {
            return $"{cookie.UserKey},{cookie.UserName},{cookie.AudienceUrl},{cookie.Expires.ToFileTime().ToString(CultureInfo.InvariantCulture)},{(cookie.IsPersisted ? bool.TrueString : bool.FalseString)}";
        }
    }
}