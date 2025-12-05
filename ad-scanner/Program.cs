using ad_scanner;
using ad_scanner.ActiveDirectory;
using ad_scanner.Models;
using System;

namespace Menu
{
    class Menu
    {
        static void Main(string[] args)
        {
            // greeter message
            Console.WriteLine("=========================\n       AD Tarayıcı\n=========================");
            Console.WriteLine("\nTaramak istediğiniz Active Directory sunucu adresini girin:");

            // take credentials for connecting to ad
            Config appConfig = new Config();
            appConfig.serverIp = Console.ReadLine();
            Console.WriteLine("AD Domaini girin:");
            appConfig.serverDomain = Console.ReadLine();
            Console.WriteLine("Username girin:");
            appConfig.username = Console.ReadLine();
            Console.WriteLine("Password girin:");
            appConfig.password = Console.ReadLine();

            IDirectoryScanner scanner = new AdScannerService(appConfig);
            if (scanner.TestConnection())
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("\nAD sunucusuna başarıyla bağlanıldı!");
                Console.ResetColor();

                ScanResult results = scanner.ScanNetwork();

                Console.WriteLine("\n=== TARAMA SONUÇLARI ===");
                Console.WriteLine($"Users: {results.Users.Count}");
                Console.WriteLine($"Computers: {results.Computers.Count}");
                Console.WriteLine($"Groups: {results.Groups.Count}");

                foreach (var user in results.Users)
                {
                    Console.WriteLine($"DN: {user.DistinguishedName}");
                    Console.WriteLine($"SID: {user.ObjectSid}");
                    Console.WriteLine($"SPN: {user.ServicePrincipalName}");
                    Console.WriteLine("------------------");
                }
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("\nBağlantı başarısız. Lütfen bilgileri kontrol edin.");
                Console.ResetColor();
                return;
            }
        }
    }
}
