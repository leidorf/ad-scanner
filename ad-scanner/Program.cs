using ad_scanner;
using ad_scanner.ActiveDirectory;
using ad_scanner.Database;
using ad_scanner.Models;
using System;
using System.Threading.Tasks;

namespace Menu
{
    class Menu
    {
        static async Task Main(string[] args)
        {
            // greeter message
            Console.WriteLine("=========================\n       AD Tarayıcı\n=========================");
            Console.WriteLine("\nTaramak istediğiniz Active Directory sunucu adresini girin (localhost):");

            // take credentials for connecting to ad
            Config appConfig = new Config();
            appConfig.serverIp = Console.ReadLine();
            Console.WriteLine("AD Domaini girin (corp.test.local):");
            appConfig.serverDomain = Console.ReadLine();
            Console.WriteLine("Username girin (Administrator):");
            appConfig.username = Console.ReadLine();
            Console.WriteLine("Password girin (Password123!):");
            appConfig.password = Console.ReadLine();

            Console.WriteLine("Neo4j Bilgileri");
            Console.WriteLine($"URI {appConfig.Neo4jUri}");
            Console.Write($"{appConfig.Neo4jUser}:{appConfig.Neo4jPassword}");

            IDirectoryScanner scanner = new AdScannerService(appConfig);
            if (scanner.TestConnection())
            {
                ScanResult results = scanner.ScanNetwork();

                Console.WriteLine("\n=== TARAMA SONUÇLARI ===");
                Console.WriteLine($"Users: {results.Users.Count}");
                Console.WriteLine($"Computers: {results.Computers.Count}");
                Console.WriteLine($"Groups: {results.Groups.Count}");

                INeo4jService dbService = new Neo4jService(appConfig);
                IAclAnalyzer analyzer = new AclAnalyzerService();

                await dbService.ConnectAsync();
                await dbService.WriteScanResultAsync(results);

                List<SecurityRelation> relations = analyzer.Analyze(results);
                if (relations != null && relations.Count > 0)
                {
                    await dbService.WriteRelationsAsync(relations);
                }
                else
                {
                    Console.WriteLine("Kritik yetki ilişkisi bulunamadı.");
                }
            }
            else
            {
                Console.WriteLine("AD Bağlantısı sağlanamadığı için işlem iptal edildi.");
            }

            Console.WriteLine("\nİşlem tamamlandı. Çıkış yapmak için bir tuşa basın...");
            Console.ReadKey();
        }
    }
}
