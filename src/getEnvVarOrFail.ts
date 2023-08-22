export function getEnvVarOrFail(key: string) {
    const found = process.env[key];
    if (found) {
        console.log("key found")
        return found

    } else {
        throw new Error("Missing required env var: " + key)
    }
}