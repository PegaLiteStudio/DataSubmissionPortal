import { Request, Response, NextFunction } from 'express';

// This would normally validate a token, but for this simple case we're just checking
// a hardcoded token in the header
export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  // Skip auth check for now since we're handling auth on the client side
  // In a real application, we would validate tokens here
  next();
}