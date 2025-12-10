from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from neomodel import db

from .models import AdUser, AdComputer, AdGroup
from .serializers import AdUserSerializer, AdComputerSerializer, AdGroupSerializer

class UserListView(APIView):
    def get(self, request):
        users = AdUser.nodes.all()
        serializer = AdUserSerializer(users, many=True)
        return Response(serializer.data)

class UserDetailView(APIView):
    def get(self, request, dn):
        try:        
            user = AdUser.nodes.get(distinguished_name=dn)
            serializer = AdUserSerializer(user)
            return Response(serializer.data)
        except AdUser.DoesNotExist:
            return Response({"error":"User not found"}, status=status.HTTP_404_NOT_FOUND)
    
class ComputerListView(APIView):
    def get(self, request):
        computers = AdComputer.nodes.all()
        serializer = AdComputerSerializer(computers, many=True)
        return Response(serializer.data)

class ComputerDetailView(APIView):
    def get(self, request, dn):
        try:
            computer = AdComputer.nodes.get(distinguished_name=dn)
            serializer = AdComputerSerializer(computer)
            return Response(serializer.data)
        except AdComputer.DoesNotExist:
            return Response({"error":"Computer not found"}, status = status.HTTP_404_NOT_FOUND)
        
class GroupListView(APIView):
    def get(self, request):
        groups = AdGroup.nodes.all()
        serializer = AdGroupSerializer(groups, many=True)
        return Response(serializer.data)

class GroupDetailView(APIView):
    def get(self, request, dn):
        try:
            group = AdGroup.nodes.get(distinguished_name=dn)
            serializer = AdGroupSerializer(group)
            return Response(serializer.data)
        except AdGroup.DoesNotExist:
            return Response({"error":"Group not found"}, status = status.HTTP_404_NOT_FOUND)

class GraphRelationsView(APIView):
    def get(self, request):
        query = """
        MATCH (s)-[r:CAN_GENERICALL]->(t)
        RETURN s.DistinguishedName as source, t.DistinguishedName as target
        LIMIT 50
        """
        results, meta = db.cypher_query(query)
        
        formatted_results = [
            {'source': row[0], 'target': row[1], 'type': 'GenericAll'}
            for row in results
        ]
        return Response({'relations': formatted_results})
