using System;
using System.Collections.Generic;
using System.Text;

namespace ad_scanner.Models
{
    public abstract class AdEntity
    {
        public string DistinguishedName { get; set; }
        public string ObjectSid { get; set; }
        public byte[] NTSecurityDescriptor { get; set; }
        public DateTime? WhenCreated { get; set; }
    }

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

    public class ScanResult
    {
        public List<AdUser> Users { get; set; } = new List<AdUser>();
        public List<AdComputer> Computers { get; set; } = new List<AdComputer>();
        public List<AdGroup> Groups { get; set; } = new List<AdGroup>();
    }
}
