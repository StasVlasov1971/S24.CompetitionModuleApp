using System;
using System.Collections.Specialized;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Web.Mvc;

namespace S24.CompetitionApp.HttpFilters
{
    public sealed class SecurityHeadersFilter : ActionFilterAttribute
    {
        // referance to sequrity check: https://dev.azure.com/scbnordic/Auto%20ART/_workitems/edit/315875
        public override void OnResultExecuting(ResultExecutingContext context)
        {
            NameValueCollection headers = context.HttpContext.Response.Headers;

            string nonce = GenerateNonce();
            context.HttpContext.Items["CSPNonce"] = nonce;

            headers["X-Frame-Options"] = "SAMEORIGIN";

            headers["Content-Security-Policy"] =
                "default-src 'self'; " + 
                $"script-src 'self' 'nonce-{nonce}'; " +
                "style-src 'unsafe-inline'; " +
                "img-src 'self' data:; " +
                "font-src 'self'; " +
                "frame-ancestors 'self'; " +
                "object-src 'none'; " +
                "base-uri 'self'; " +
                "form-action 'self'";

            // to prevent the browser from MIME sniffing
            headers["X-Content-Type-Options"] = "nosniff";

            //save url paramteres + analytics
            headers["Referrer-Policy"] = "strict-origin-when-cross-origin";

            //"close" specific browser functions
            headers["Permissions-Policy"] =
                "geolocation=(), camera=(), microphone=(), payment=(), usb=(), accelerometer=(), " +
                "gyroscope=(), magnetometer=()";

            // use only CORP/CORS resources
            headers["Cross-origin-Embedder-Policy"] = "require-corp";

            // to prevent data leak and Spectre atacks
            headers["Cross-origin-Resource-Policy"] = "same-origin";

            // defence from Specttre attacs and side-channels
            headers["Cross-origin-Opener-Policy"] = "same-origin-allow-popus";

            base.OnResultExecuting(context);
        }

        private string GenerateNonce()
        {
            using (var rng = new RNGCryptoServiceProvider())
            {
                var nonceBytes = new byte[32];
                rng.GetBytes(nonceBytes);
                return Convert.ToBase64String(nonceBytes)
                    .Replace("+", "-")
                    .Replace("/", "_")
                    .Replace("=", "");
            }
        }
    }
}