/**
 * IMoistureData
 * 
 * @export
 * @interface IMoistureData
 */
export interface IMoistureData {
  moisture: number;
  moisturePct: number;
  updateDate: string;
  lastWateredDate?: string;
}