from django.db import models
from neomodel import StructuredNode, StringProperty, JSONProperty, DateTimeProperty, RelationshipTo, RelationshipFrom

# abstract object model
class AdEntity(StructuredNode):
    __abstract_node__ = True
    distinguished_name = StringProperty(db_property="DistinguishedName")
    object_sid = StringProperty(db_property="ObjectSid", unique_index=True)
    when_created = StringProperty(db_property="WhenCreated") 

# user model with its properties
class AdUser(AdEntity):
    __label__ = "User"

    service_principal_name = StringProperty(db_property="ServicePrincipalName")
    member_of = RelationshipTo("AdGroup", "MEMBER_OF")

# computer model with its properties
class AdComputer(AdEntity):
    __label__ = "Computer"

    operating_system = StringProperty(db_property="OperatingSystem")

# group model with its properties
class AdGroup(AdEntity):
    __label__ = "Group"

    description = StringProperty(db_property="Description")
    members = RelationshipFrom("AdUser", "MEMBER_OF")