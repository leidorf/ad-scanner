using ad_scanner.Models;
using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.Text;
using System.Collections.Generic;
using System.DirectoryServices;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Linq;

namespace ad_scanner.ActiveDirectory
{
    public interface IAclAnalyzer
    {
        List<SecurityRelation> Analyze(ScanResult result);
    }
    public class AclAnalyzerService : IAclAnalyzer
    {
        private static readonly Dictionary<string, ActiveDirectoryRights> CriticalRights = new Dictionary<string, ActiveDirectoryRights>
        {
            {"GenericAll", ActiveDirectoryRights.GenericAll },
            {"WriteDacl", ActiveDirectoryRights.WriteDacl },
            {"ForceChangePassword", ActiveDirectoryRights.GenericWrite }
        };

        public List<SecurityRelation> Analyze(ScanResult result)
        {
            var relations = new List<SecurityRelation>();
            var allEntities = new List<AdEntity>();
            allEntities.AddRange(result.Users);
            allEntities.AddRange(result.Computers);
            allEntities.AddRange(result.Groups);

            Console.WriteLine("\nACL Analizi Başlatılıyor...");
            int analyzedCount = 0;

            foreach (var targetEntity in allEntities)
            {
                if (targetEntity.NTSecurityDescriptor == null)
                {
                    continue;
                }
                try
                {
                    var sd = new ActiveDirectorySecurity();
                    sd.SetSecurityDescriptorBinaryForm(targetEntity.NTSecurityDescriptor);

                    AuthorizationRuleCollection rules = sd.GetAccessRules(true, true, typeof(SecurityIdentifier));
                    if (rules == null) continue;

                    foreach (ActiveDirectoryAccessRule rule in rules)
                    {
                        if (rule.AccessControlType != AccessControlType.Allow)
                            continue;

                        var accesRights = (ActiveDirectoryRights)rule.ActiveDirectoryRights;

                        foreach (var right in CriticalRights)
                        {
                            if ((accesRights & right.Value) == right.Value)
                            {
                                string sourceSid = rule.IdentityReference.Translate(typeof(SecurityIdentifier)).Value;

                                relations.Add(new SecurityRelation
                                {
                                    SourceSid = sourceSid,
                                    TargetSid = targetEntity.ObjectSid,
                                    TargetDn = targetEntity.DistinguishedName,
                                    PermissionType = right.Key,
                                    RelationshipLabel = $"CAN_{right.Key.ToUpperInvariant()}"
                                });
                            }
                        }
                    }

                    analyzedCount++;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[ANALİZ HATA] {targetEntity.DistinguishedName}: {ex.Message}");
                }

                Console.WriteLine($"Analiz tamamlandı. Toplam {analyzedCount} nesne işlendi. {relations.Count} adet kritik ilişki bulundu.");
            }
                return relations;
        }
    }
}
