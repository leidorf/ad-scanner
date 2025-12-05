namespace ad_scanner
{
    public class Config
    {
        public string serverIp { get; set; } = "localhost";
        public int serverPort { get; set; } = 389;
        public string serverDomain { get; set; }
        public string username { get; set; }
        public string password { get; set; }
    }
}
