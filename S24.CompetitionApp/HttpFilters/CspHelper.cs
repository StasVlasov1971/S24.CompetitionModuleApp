using System.Web;
using System.Web.Mvc;
 
namespace S24.CompetitionApp.Helpers
{
    public static class CspHelper
    {
        public static IHtmlString Nonce(this HtmlHelper htmlHelper)
        {
            var nonce = HttpContext.Current.Items["CSPNonce"] as string;
            return new HtmlString(nonce ?? string.Empty);
        }
        
        public static IHtmlString ScriptWithNonce(this HtmlHelper htmlHelper, string script)
        {
            var nonce = HttpContext.Current.Items["CSPNonce"] as string;
            return new HtmlString($"<script nonce=\"{nonce}\">{script}</script>");
        }
    }
}