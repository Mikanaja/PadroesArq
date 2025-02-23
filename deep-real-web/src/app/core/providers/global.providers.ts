const globalProviders = new Map<any, any>();

export const setProvider = (provider: any, value: any): void => {
    globalProviders.set(provider, value);
}

export const getProvider = (provider: any): any => {
    return globalProviders.get(provider);
}