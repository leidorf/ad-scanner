using System;
using System.Collections.Generic;
using System.Text;

namespace ad_scanner.Models
{
    // abstract entity for ad objects
    public abstract class AdEntity
    {
        public string DistinguishedName { get; set; }
        public string ObjectSid { get; set; }
        public byte[] NTSecurityDescriptor { get; set; }
        public DateTime? WhenCreated { get; set; }
    }

    // ad object entities
    public class AdUser : AdEntity
    {
        public string ServicePrincipalName { get; set; }
    }
    public class AdComputer : AdEntity
    {
        public string OperatingSystem { get; set; }
    }
    public class AdGroup : AdEntity
    {
        public string Description { get; set; }
    }

    // ad scan result entity
    public class ScanResult
    {
        public List<AdUser> Users { get; set; } = new List<AdUser>();
        public List<AdComputer> Computers { get; set; } = new List<AdComputer>();
        public List<AdGroup> Groups { get; set; } = new List<AdGroup>();
    }

    // ad acl entity
    public class SecurityRelation
    {
        public string SourceSid { get; set; }
        public string SourceDn { get; set; }
        public string TargetSid { get; set; }
        public string TargetDn { get; set; }
        public string PermissionType { get; set; }
        public string RelationshipLabel { get; set; }
    }
}
