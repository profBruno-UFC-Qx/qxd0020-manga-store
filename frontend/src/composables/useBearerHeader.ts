function bearerAuthorization(token: string) { 
    return { Authorization: `Bearer ${token}` }
}

export const useBearerAuthorization = (token: string) => bearerAuthorization(token)