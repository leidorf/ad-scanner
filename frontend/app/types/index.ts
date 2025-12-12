// ad acl interface
export interface AclEntry {
  source_dn: string;
  source_type: string;
  permission: string;
}

// ad interface for ad objects based on common properties
export interface AdEntity {
  distinguished_name: string;
  object_sid: string;
  when_created?: string;
  incoming_acls?: AclEntry[];
}

// ad user object interface
export interface AdUser extends AdEntity {
  service_principal_name?: string;
}

// ad computer object interface
export interface AdComputer extends AdEntity {
  operating_system?: string;
}

// ad group object interface
export interface AdGroup extends AdEntity {
  description?: string;
}

// dashboard stat interface
export interface DashboardStats {
  users: number;
  computers: number;
  groups: number;
}
