using ad_scanner;
using System;

namespace Menu
{
    class Menu
    {
        static void Greeter()
        {
            Console.WriteLine("=========================\n       AD Tarayıcı\n=========================");
            Console.WriteLine("\nTaramak istediğiniz Active Directory sunucu adresini girin:");
        }
        static void Main(string[] args)
        {
            Greeter();
            Config server = new Config();
            server.ServerIp = Console.ReadLine();
            Console.WriteLine(server.ServerIp);
        }
    }
}
