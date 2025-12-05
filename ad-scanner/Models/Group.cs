using System;
using System.Collections.Generic;
using System.Text;

namespace ad_scanner.Models
{
    internal class Group
    {
        string distinguishedName;
        string objectSid;
        string description;
        string nTSecurityDescriptor;
        string whenCreated;
    }
}
