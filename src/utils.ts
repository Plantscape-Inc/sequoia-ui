// export function enforceType<T>(obj: unknown): T {
//   const result = {} as T;
//   for (const key in obj) {
//     if (key in ({} as T)) {
//       (result as unknown)[key] = obj[key];
//     }
//   }
//   return result;
// }
export const formatLargeNumber = (num: number) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(3) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};
