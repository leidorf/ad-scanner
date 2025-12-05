using System;
using System.Collections.Generic;
using System.Text;

namespace ad_scanner.Models
{
    internal class User
    {
        string distinguishedName;
        string objectSid;
        string servicePrincipalName;
        string nTSecurityDescriptor;
        string whenCreated;
    }
}
