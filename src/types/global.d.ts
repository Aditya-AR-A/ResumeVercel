declare module "*.json" {
    const value: Record<string, unknown>;
    export default value;
}

declare module "*.css" {
    const content: Record<string, string>;
    export default content;
}
