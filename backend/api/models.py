from django.db import models
from neomodel import StructuredNode, StringProperty, JSONProperty, DateTimeProperty, RelationshipTo, RelationshipFrom

class AdEntity(StructuredNode):
    __abstract_node__ = True
    distinguished_name = StringProperty(name="DistinguishedName")
    object_sid = StringProperty(name="ObjectSid", unique_index=True)
    when_created = DateTimeProperty(name="WhenCreated")

class AdUser(AdEntity):
    __label__="User"
    service_principal_name = StringProperty(name="ServicePrincipalName")
    member_of = RelationshipTo("AdGroup", "MEMBER_OF")

class AdComputer(AdEntity):
    __label__="Computer"
    operating_system=StringProperty(name="OperatingSystem")

class AdGroup(AdEntity):
    __label__="Group"
    description=StringProperty(name="Description")
    members=RelationshipFrom("AdUser","MEMBER_OF")