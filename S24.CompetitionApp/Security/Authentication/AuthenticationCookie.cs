namespace S24.CompetitionApp.Security.Authentication
{
    public class AuthenticationCookie
    {
        public static AuthenticationCookie InvalidAuthenticationCookie => new AuthenticationCookie();

        public bool IsValid { get; }

        public string UserName { get; }

        public AuthenticationCookie(string userName, bool isValid)
        {
            UserName = userName;
            IsValid = isValid;
        }

        private AuthenticationCookie()
        {
        }
    }
}