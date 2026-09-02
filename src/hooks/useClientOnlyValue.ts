export function useClientOnlyValue<T>(value: T, fallback: T): T {
  return typeof window !== 'undefined' ? value : fallback;
}
