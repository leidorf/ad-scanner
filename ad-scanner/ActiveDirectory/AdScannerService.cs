using ad_scanner.Models;
using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.Security.Principal;
using System.Text;

namespace ad_scanner.ActiveDirectory
{
    internal class AdScannerService : IDirectoryScanner
    {
        private readonly Config _config;
        public AdScannerService(Config config)
        {
            _config = config;
        }

        // ad connection parameters
        public DirectoryEntry CreateDirectoryEntry()
        {
            string path = $"LDAP://{_config.serverIp}:{_config.serverPort}";

            DirectoryEntry directoryEntry = new DirectoryEntry(
                path,
                _config.username + "@" + _config.serverDomain,
                _config.password,
                AuthenticationTypes.Secure
                );
            return directoryEntry;
        }

        // testing ad connection
        public bool TestConnection()
        {
            try
            {
                using (DirectoryEntry de = CreateDirectoryEntry())
                {
                    string guid = de.Guid.ToString();
                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.WriteLine("\n[BAŞARILI] AD sunucusuna başarıyla bağlanıldı!");
                    Console.ResetColor();
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"\n[HATA] Bağlantı başarısız: {ex.Message}");
                Console.ResetColor();
                return false;
            }
        }

        public ScanResult ScanNetwork()
        {
            var result = new ScanResult();
            Console.WriteLine("Tarama başlatılıyor.");

            using (DirectoryEntry rootEntry = CreateDirectoryEntry())
            {
                Console.WriteLine("Kullanıcılar taranıyor.");
                result.Users = ScanGeneric<AdUser>(rootEntry, "(&(objectClass=user)(objectCategory=person)(!objectClass=computer))", FillUser);

                Console.WriteLine("Bilgisayarlar taranıyor.");
                result.Computers = ScanGeneric<AdComputer>(rootEntry, "(&(objectClass=computer))", FillComputer);

                Console.WriteLine("Gruplar taranıyor.");
                result.Groups = ScanGeneric<AdGroup>(rootEntry, "(&(objectClass=group))", FillGroup);
            }

            return result;
        }

        private List<T> ScanGeneric<T>(DirectoryEntry rootEntry, string ldapFilter, Func<SearchResult, T> mapFunction)
        {
            List<T> list = new List<T>();
            using (DirectorySearcher searcher = new DirectorySearcher(rootEntry))
            {
                searcher.Filter = ldapFilter;
                searcher.PageSize = 1000;
                searcher.SearchScope = SearchScope.Subtree;

                searcher.PropertiesToLoad.AddRange(new[]
                {
                    "DistinguishedName", "ObjectSid", "NTSecurityDescriptor","WhenCreated","ServicePrincipalName","OperatingSystem","Description"
                });

                searcher.SecurityMasks = SecurityMasks.Dacl | SecurityMasks.Owner;

                using (SearchResultCollection results = searcher.FindAll())
                {
                    foreach (SearchResult sr in results)
                    {
                        try
                        {
                            list.Add(mapFunction(sr));
                        }
                        catch (Exception ex)
                        {

                            Console.WriteLine(ex.Message);
                        }
                    }
                }
            }
            Console.WriteLine($"-> {list.Count} adet adet kayıt bulundu");
            return list;
        }

        private void FillBase(AdEntity entity, SearchResult sr)
        {
            entity.DistinguishedName = GetProperty<string>(sr, "DistinguishedName");
            entity.WhenCreated = GetProperty<DateTime?>(sr, "WhenCreated");

            var sidBytes = GetProperty<byte[]>(sr, "ObjectSid");
            if (sidBytes != null)
            {
                entity.ObjectSid = new SecurityIdentifier(sidBytes, 0).ToString();
            }

            entity.NTSecurityDescriptor = GetProperty<byte[]>(sr, "NTSecurityDescriptor");
        }

        private AdUser FillUser(SearchResult sr)
        {
            var user = new AdUser();
            FillBase(user, sr);

            var spnList = sr.Properties["ServicePrincipalName"];
            if (spnList != null && spnList.Count > 0)
            {
                user.ServicePrincipalName = spnList[0].ToString();
            }
            return user;
        }

        private AdComputer FillComputer(SearchResult sr)
        {
            var comp = new AdComputer();
            FillBase(comp, sr);
            comp.OperatingSystem = GetProperty<string>(sr, "operatingSystem");
            return comp;
        }

        private AdGroup FillGroup(SearchResult sr)
        {
            var group = new AdGroup();
            FillBase(group, sr);
            group.Description = GetProperty<string>(sr, "description");
            return group;
        }

        private T GetProperty<T>(SearchResult sr, string propName)
        {
            if (sr.Properties.Contains(propName) && sr.Properties[propName].Count > 0)
            {
                return (T)sr.Properties[propName][0];
            }
            return default(T);
        }
    }
}
