export const canFollow = (
  currentUserId: string | null | undefined,
  targetUserId: string,
): boolean => {
  return currentUserId !== targetUserId;
};
