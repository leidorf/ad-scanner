from rest_framework import serializers

class AdUserSerializer(serializers.Serializer):
    distinguished_name = serializers.CharField()
    object_sid = serializers.CharField()
    service_principal_name = serializers.CharField(required=False)
    when_created = serializers.DateTimeField(required=False)

class AdComputerSerializer(serializers.Serializer):
    distinguished_name = serializers.CharField()
    object_sid = serializers.CharField()
    operating_system = serializers.CharField(required=False)
    when_created = serializers.DateTimeField(required=False)

class AdGroupSerializer(serializers.Serializer):
    distinguished_name = serializers.CharField()
    object_sid = serializers.CharField()
    description = serializers.CharField(required=False)
    when_created = serializers.DateTimeField(required=False)