/**
 * IBanyanStatus
 * 
 * @export
 * @interface IBanyanStatus
 */
export interface IBanyanStatus {
  moisturePct: number;
  status: number;
  updateDate: string;
  lastWateredDate?: string;
}