const isDevelopment = import.meta.env.MODE === 'development';
console.log('Current environment:', import.meta.env.MODE);

export const config = {
    apiBaseUrl: isDevelopment 
        ? 'http://localhost:3000/api'
        : '/api'
};