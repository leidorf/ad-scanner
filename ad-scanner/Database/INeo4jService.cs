using ad_scanner.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ad_scanner.Database
{
    public interface INeo4jService
    {
        Task ConnectAsync();
        Task WriteScanResultAsync(ScanResult result);
        Task WriteRelationsAsync(List<SecurityRelation> relations);
    }
}
