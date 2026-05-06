export interface Notification {
  _id: string;
  type: string;
  message: string;
  time: string;
  isRead?: boolean;
}
