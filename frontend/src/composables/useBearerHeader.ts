export const bearerAuthorization = (token: string) => { 
    return { Authorization: `Bearer ${token}` }
}