export interface SuccessResponseApi<T> {
  message: string;
  status: number;
  metadata: T;
}
