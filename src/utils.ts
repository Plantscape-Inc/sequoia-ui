// export function enforceType<T>(obj: unknown): T {
//   const result = {} as T;
//   for (const key in obj) {
//     if (key in ({} as T)) {
//       (result as unknown)[key] = obj[key];
//     }
//   }
//   return result;
// }
