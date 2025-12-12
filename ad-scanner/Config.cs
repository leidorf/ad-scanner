namespace ad_scanner
{
    public class Config
    {
        // active directory config variables
        public string serverIp { get; set; } = "localhost";
        public int serverPort { get; set; } = 389;
        public string serverDomain { get; set; }
        public string username { get; set; }
        public string password { get; set; }

        // predefined neo4j db config variables (change it according to your database)
        public string Neo4jUri { get; set; } = "neo4j://localhost:7687";
        public string Neo4jUser { get; set; } = "neo4j";
        public string Neo4jPassword { get; set; } = "123456789";
    }
}
