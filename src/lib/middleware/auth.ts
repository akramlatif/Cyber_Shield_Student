import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JwtPayload } from '@/lib/jwt';

export type AuthenticatedRequest = NextRequest & { user: JwtPayload };

type Handler = (req: AuthenticatedRequest) => Promise<NextResponse>;

/**
 * Higher-order function that wraps a route handler with JWT authentication.
 * Usage: export const GET = withAuth(async (req) => { ... req.user ... });
 */
export function withAuth(handler: Handler) {
    return async (req: NextRequest): Promise<NextResponse> => {
        const authHeader = req.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized: Missing or malformed token' },
                { status: 401 }
            );
        }

        const token = authHeader.slice(7);

        try {
            const payload = verifyToken(token);
            (req as AuthenticatedRequest).user = payload;
            return handler(req as AuthenticatedRequest);
        } catch {
            return NextResponse.json(
                { error: 'Unauthorized: Invalid or expired token' },
                { status: 401 }
            );
        }
    };
}
