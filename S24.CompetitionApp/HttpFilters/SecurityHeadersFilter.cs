using System;
using System.Collections.Specialized;
using System.Security.Cryptography;
using System.Web.Mvc;

public sealed class SecurityHeadersFilter : ActionFilterAttribute
{
    public override void OnResultExecuting(ResultExecutingContext context)
    {
        NameValueCollection headers = context.HttpContext.Response.Headers;

        string nonce = GenerateNonce();
        context.HttpContext.Items["CSPNonce"] = nonce;

        headers["X-Frame-Options"] = "SAMEORIGIN";

        // Обновленная CSP политика с разрешением для iframe
        headers["Content-Security-Policy"] =
            "default-src 'self'; " +
            $"script-src 'self' 'nonce-{nonce}'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: blob:; " + // Добавлен blob:
            "font-src 'self' data:; " + 
            "frame-src 'self' blob: ; " + // Добавлено для iframe
            "child-src 'self' blob:; " + // Добавлено для iframe
            "frame-ancestors 'self'; " +
            "object-src 'none'; " +
            "base-uri 'self'; " +
            "form-action 'self'";

        headers["X-Content-Type-Options"] = "nosniff";
        headers["Referrer-Policy"] = "strict-origin-when-cross-origin";

        headers["Permissions-Policy"] =
            "geolocation=(), camera=(), microphone=(), payment=(), usb=(), accelerometer=(), " +
            "gyroscope=(), magnetometer=()";

        headers["Cross-origin-Embedder-Policy"] = "require-corp";
        headers["Cross-origin-Resource-Policy"] = "same-origin";
        headers["Cross-origin-Opener-Policy"] = "same-origin-allow-popups";

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