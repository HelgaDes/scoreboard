export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string | undefined,
  USE_MOCK: (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true',
};
