from django.shortcuts import render
from django.http import JsonResponse
from .models import AdUser, AdGroup

def get_users(request):
    users = AdUser.nodes.all()
    
    data=[]
    for user in users:
        data.append({
            "sid": user.object_sid,
            "dn": user.distinguished_name,
            "spn": user.service_principal_name
        })
    return JsonResponse({'count':len(data), 'users':data})

def get_critical_relations(request):
    from neomodel import db
    query="""
    MATCH (s)-[r:CAN_GENERICALL]->(t)
    RETURN s.DistinguishedName as source, t.DistinguishedName as target
    LIMIT 50
    """
    results, meta = db.cypher_query(query)

    formatted_results=[{
        'source':row[0], 'target': row[1], 'type':'GenericAll'
    } for row in results]

    return JsonResponse({'relations':formatted_results})