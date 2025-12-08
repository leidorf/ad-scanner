using ad_scanner.Models;
using Neo4j.Driver;
using Neo4jClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace ad_scanner.Database
{
    public class Neo4jService : INeo4jService, IDisposable
    {
        private readonly Config _config;
        private IGraphClient _client;
        private IDriver _driver;
        public Neo4jService(Config config)
        {
            _config = config;
        }

        public async Task ConnectAsync()
        {
            try
            {
                _driver = GraphDatabase.Driver(_config.Neo4jUri, AuthTokens.Basic(_config.Neo4jUser, _config.Neo4jPassword));

                _client = new BoltGraphClient(_driver);
                await _client.ConnectAsync();

                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("[BAŞARILI] Neo4j veri tabanına bağlanıldı.");
                Console.ResetColor();
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"[HATA] Neo4j bağlantı hatası: {ex.Message}");
                if (ex.InnerException != null) Console.WriteLine($"Detay: {ex.InnerException.Message}");
                Console.ResetColor();
                throw;
            }
        }

        public async Task WriteScanResultAsync(ScanResult result)
        {
            if (_client == null || !_client.IsConnected)
            {
                Console.WriteLine("Veri tabanı bağlantısı yok.");
                return;
            }

            Console.WriteLine("\nSonuçlar veri tabanına yazılıyor...");

            if (result.Users.Count > 0)
            {
                Console.Write($"-> {result.Users.Count} Kullanıcı yazılıyor...");
                await _client.Cypher
                    .Unwind(result.Users, "user")
                    .Merge("(u:User {ObjectSid: user.ObjectSid})")
                    .OnCreate()
                    .Set("u = user")
                    .OnMatch()
                    .Set("u = user")
                    .ExecuteWithoutResultsAsync();
                Console.WriteLine("OK.");
            }

            if (result.Computers.Count > 0)
            {
                Console.Write($"-> {result.Computers.Count} Bilgisayar yazılıyor...");
                await _client.Cypher
                    .Unwind(result.Computers, "comp")
                    .Merge("(c:Computer {ObjectSid: comp.ObjectSid})")
                    .OnCreate()
                    .Set("c = comp")
                    .OnMatch()
                    .Set("c = comp")
                    .ExecuteWithoutResultsAsync();
                Console.WriteLine("OK.");
            }

            if (result.Groups.Count > 0)
            {
                Console.Write($"-> {result.Groups.Count} Grup yazılıyor...");
                await _client.Cypher
                    .Unwind(result.Groups, "grp")
                    .Merge("(g:Group {ObjectSid: grp.ObjectSid})")
                    .OnCreate()
                    .Set("g = grp")
                    .OnMatch()
                    .Set("g = grp")
                    .ExecuteWithoutResultsAsync();
                Console.WriteLine("OK.");
            }

            Console.WriteLine("Veri tabanına yazma tamamlandı.");
        }

        public async Task WriteRelationsAsync(List<SecurityRelation> relations)
        {
            if (_client == null || !_client.IsConnected) return;
            Console.WriteLine($"\n-> {relations.Count} adet yetki ilişkisi işleniyor...");

            var groupedRelations = relations.GroupBy(r => r.RelationshipLabel);

            foreach (var group in groupedRelations)
            {
                string relationType = group.Key;
                var relationList = group.ToList();
                Console.Write($"   * {relationList.Count} adet '{relationType}' ilişkisi yazılıyor... ");

                try
                {
                    await _client.Cypher
                        .Unwind(relationList, "rel")
                        .Match("(source {ObjectSid: rel.SourceSid})")
                        .Match("(target {ObjectSid: rel.TargetSid})")
                        .Merge($"(source)-[r:{relationType}]->(target)")
                        .Set("r.PermissionType = rel.PermissionType")
                        .ExecuteWithoutResultsAsync();
                    Console.WriteLine("OK.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
            Console.WriteLine("İlişki yazma işlemi tamamlandı.");
        }
        public void Dispose()
        {
            _driver?.Dispose();
        }
    }
}
