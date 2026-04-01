/**
 * 格式化相对时间
 * @param date 日期
 * @returns 相对时间字符串
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  return `${days}天前`;
};

/**
 * 生成随机 memoryId
 * @returns 随机数字字符串
 */
export const generateMemoryId = (): string => {
  return Math.floor(Math.random() * 100000000).toString();
};

/**
 * 生成唯一 ID
 * @returns 时间戳字符串
 */
export const generateId = (): string => {
  return Date.now().toString();
};
