using System;
using System.Collections.Generic;
using System.Text;
using System.DirectoryServices;
using ad_scanner.Models;

namespace ad_scanner.ActiveDirectory
{
    internal interface IDirectoryScanner
    {
        DirectoryEntry CreateDirectoryEntry();
        bool TestConnection();

        ScanResult ScanNetwork();
    }
}
