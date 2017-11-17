/**
 * IResponse
 * 
 * @export
 * @interface IResponse
 */
export interface IResponse {
  status: string;
  message: string;
  data?: any[] | object;
}
