import jwt from 'jsonwebtoken';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
    userId: string;
    email: string;
    name: string;
    plan: string;
}

/**
 * JWT secret is resolved lazily (at sign/verify time) rather than at module
 * load, so the app builds and serves non-auth routes even when JWT_SECRET
 * is not configured.
 */
function getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not set. Please define it inside .env.local to use authentication features.');
    }
    return secret;
}

export function signToken(payload: JwtPayload): string {
    return jwt.sign(payload, getSecret(), { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, getSecret()) as JwtPayload;
}
