import Log from '@/models/Log';

export async function addLog({
  action,
  category,
  description,
  performedBy,
  metadata = {},
  req = null
}) {
  try {
    const logData = {
      action,
      category,
      description,
      performedBy,
      metadata
    };

    if (req) {
      logData.ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
      logData.userAgent = req.headers.get('user-agent');
    }

    const log = new Log(logData);
    await log.save();
    return log;
  } catch (error) {
    console.error('Error adding log:', error);
    throw error;
  }
}