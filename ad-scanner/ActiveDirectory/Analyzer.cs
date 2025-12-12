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
        // acl properties
        private static readonly Dictionary<string, ActiveDirectoryRights> CriticalRights = new Dictionary<string, ActiveDirectoryRights>
        {
            {"GenericAll", ActiveDirectoryRights.GenericAll },
            {"WriteDacl", ActiveDirectoryRights.WriteDacl },
            {"ForceChangePassword", ActiveDirectoryRights.GenericWrite }
        };

        // scan relations between objects
        public List<SecurityRelation> Analyze(ScanResult result)
        {
            // list to store acl scan result
            var relations = new List<SecurityRelation>();

            // declare which objects to be in range
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
                    // declare security descriptor
                    var sd = new ActiveDirectorySecurity();
                    sd.SetSecurityDescriptorBinaryForm(targetEntity.NTSecurityDescriptor);

                    AuthorizationRuleCollection rules = sd.GetAccessRules(true, true, typeof(SecurityIdentifier));
                    if (rules == null) continue;

                    foreach (ActiveDirectoryAccessRule rule in rules)
                    {
                        // look for only allowed types
                        if (rule.AccessControlType != AccessControlType.Allow)
                            continue;

                        var accesRights = (ActiveDirectoryRights)rule.ActiveDirectoryRights;

                        // check if the rule is in CriticalRights
                        foreach (var right in CriticalRights)
                        {
                            if ((accesRights & right.Value) == right.Value)
                            {
                                string sourceSid = rule.IdentityReference.Translate(typeof(SecurityIdentifier)).Value;

                                // add to the relations list
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
