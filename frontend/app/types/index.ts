export interface AclEntry {
  source_dn: string;
  source_type: string;
  permission: string;
}

export interface AdEntity {
  distinguished_name: string;
  object_sid: string;
  when_created?: string;
  incoming_acls?: AclEntry[];
}

export interface AdUser extends AdEntity {
  service_principal_name?: string;
}

export interface AdComputer extends AdEntity {
  operating_system?: string;
}

export interface AdGroup extends AdEntity {
  description?: string;
}

export interface DashboardStats {
  users: number;
  computers: number;
  groups: number;
}
