import { useQuery } from "@tanstack/react-query";
import api from "~/api/axios";
import type { AdUser, AdComputer, AdGroup } from "~/types";
import type { DashboardStats } from "~/types";

const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const response = await api.get(`/dashboard/stats`);
    return response.data;
};

const fetchUsers = async (): Promise<AdUser[]> => {
    const response = await api.get("/users");
    return response.data;
};

const fetchUser = async (dn: string): Promise<AdUser> => {
    const encodedDN = encodeURIComponent(dn);
    const response = await api.get(`/users/${encodedDN}/`);
    return response.data;
};

const fetchComputers = async (): Promise<AdComputer[]> => {
    const response = await api.get("/computers");
    return response.data;
};

const fetchComputer = async (dn: string): Promise<AdComputer> => {
    const encodedDN = encodeURIComponent(dn);
    const response = await api.get(`/computers/${encodedDN}/`);
    return response.data;
};

const fetchGroups = async (): Promise<AdGroup[]> => {
    const response = await api.get("/groups");
    return response.data;
};

const fetchGroup = async (dn: string): Promise<AdGroup> => {
    const encodedDN = encodeURIComponent(dn);
    const response = await api.get(`/groups/${encodedDN}/`);
    return response.data;
};

// get dashboard stats
export function useDashboardStats() {
    return useQuery({
        queryKey: ['dashboardStats'],
        queryFn: fetchDashboardStats,
    });
}

// get all ad users
export function useUserList() {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });
}

// get single ad user by distinguished name
export function useUserDetail(dn: string | undefined) {
    return useQuery({
        queryKey: ['users', dn],
        queryFn: () => fetchUser(dn!),
        enabled: !!dn,
    });
}

// get all ad computers
export function useComputerList() {
    return useQuery({
        queryKey: ['computers'],
        queryFn: fetchComputers,
    });
}

// get single ad computer by distinguished name
export function useComputerDetail(dn: string | undefined) {
    return useQuery({
        queryKey: ['computers', dn],
        queryFn: () => fetchComputer(dn!),
        enabled: !!dn,
    });
}

// get all ad groups
export function useGroupList() {
    return useQuery({
        queryKey: ['groups'],
        queryFn: fetchGroups,
    });
}

// get single ad group by distinguished name
export function useGroupDetail(dn: string | undefined) {
    return useQuery({
        queryKey: ['groups', dn],
        queryFn: () => fetchGroup(dn!),
        enabled: !!dn,
    });
}