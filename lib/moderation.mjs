export const ADMIN_EMAIL = 'asadbek1981uz@gmail.com';
export function banInput(body) {
  const reason = typeof body.reason === 'string' ? body.reason.trim() : '';
  if (!reason || reason.length > 500 || !(body.minutes === null || (Number.isInteger(body.minutes) && body.minutes >= 20 && body.minutes <= 1440))) {
    throw Object.assign(new Error('Укажите причину (до 500 символов) и срок от 20 минут до 24 часов либо навсегда.'), {status:400});
  }
  return {reason, minutes:body.minutes};
}
export function absenceStage(milliseconds) { return milliseconds >= 180000 ? 'reported' : milliseconds >= 120000 ? 'warning' : 'away'; }
export async function isAdmin(c, id) {return !!(await c.query('SELECT user_id FROM developers WHERE user_id=$1',[id])).rows[0];}
export async function checkBan(c,id) {
  const b=(await c.query('SELECT reason,expires_at FROM bans WHERE user_id=$1 AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at>now()) ORDER BY created_at DESC LIMIT 1',[id])).rows[0];
  if(b) throw Object.assign(new Error(`Аккаунт заблокирован ${b.expires_at ? 'до '+new Date(b.expires_at).toLocaleString('ru-RU',{timeZone:'Asia/Tashkent'})+' (Ташкент)' : 'навсегда'}. Причина: ${b.reason}`),{status:403});
}
