from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from neomodel import db

from .models import AdUser, AdComputer, AdGroup
from .serializers import AdUserSerializer, AdComputerSerializer, AdGroupSerializer

# get acls by object distinguished name
def get_incoming_acls(dn):
    query = """
    MATCH (source)-[r]->(target)
    WHERE target.DistinguishedName = $dn 
    AND type(r) IN ['CAN_GENERICALL', 'CAN_WRITEDACL', 'CAN_FORCECHANGEPASSWORD']
    RETURN source.DistinguishedName, labels(source), type(r)
    """
    results, _ = db.cypher_query(query, {'dn': dn})
    acls = []
    for row in results:
        acls.append({
            'source_dn': row[0],       
            'source_type': row[1][0] if row[1] else 'Unknown', 
            'permission': row[2]   
        })
    return acls

# get all user objects for list view
class UserListView(APIView):
    def get(self, request):
        users = AdUser.nodes.all()
        serializer = AdUserSerializer(users, many=True)
        return Response(serializer.data)

# get single user by distinguished name for user detail view
class UserDetailView(APIView):
    def get(self, request, dn):
        try:        
            user = AdUser.nodes.get(distinguished_name=dn)
            serializer = AdUserSerializer(user)
            data = serializer.data
            data['incoming_acls'] = get_incoming_acls(dn)
            return Response(data)
        except AdUser.DoesNotExist:
            return Response({"error":"User not found"}, status=status.HTTP_404_NOT_FOUND)
    
# get all computer objects for list view
class ComputerListView(APIView):
    def get(self, request):
        computers = AdComputer.nodes.all()
        serializer = AdComputerSerializer(computers, many=True)
        return Response(serializer.data)

# get single computer by distinguished name for computer detail view
class ComputerDetailView(APIView):
    def get(self, request, dn):
        try:
            computer = AdComputer.nodes.get(distinguished_name=dn)
            serializer = AdComputerSerializer(computer)
            data = serializer.data
            data['incoming_acls'] = get_incoming_acls(dn)
            return Response(data)
        except AdComputer.DoesNotExist:
            return Response({"error":"Computer not found"}, status = status.HTTP_404_NOT_FOUND)
        
# get all group objects for list view
class GroupListView(APIView):
    def get(self, request):
        groups = AdGroup.nodes.all()
        serializer = AdGroupSerializer(groups, many=True)
        return Response(serializer.data)

# get single group by distinguished name for group detail view
class GroupDetailView(APIView):
    def get(self, request, dn):
        try:
            group = AdGroup.nodes.get(distinguished_name=dn)
            serializer = AdGroupSerializer(group)
            data = serializer.data
            data['incoming_acls'] = get_incoming_acls(dn)   
            return Response(data)
        except AdGroup.DoesNotExist:
            return Response({"error":"Group not found"}, status = status.HTTP_404_NOT_FOUND)

# get all object counts for dashboard stat display
class DashboardStatsView(APIView):
    def get(self, request):
        results_user, _ = db.cypher_query("MATCH (n:User) RETURN count(n)")
        user_count = results_user[0][0]

        results_computer, _ = db.cypher_query("MATCH (n:Computer) RETURN count(n)")
        computer_count = results_computer[0][0]

        results_group, _ = db.cypher_query("MATCH (n:Group) RETURN count(n)")
        group_count = results_group[0][0]
        data = {
            "users": user_count,
            "computers": computer_count,
            "groups": group_count
        }
        
        return Response(data)