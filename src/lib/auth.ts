import { db } from './db';

export async function verifyAdmin(request: Request): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.split(' ')[1];
  const settings = await db.settings.get();
  return token === `session-${settings.adminEmail}`;
}
