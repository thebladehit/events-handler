export const STREAM_NAME = 'events';

export enum SubjectName {
  TIKTOK = `${STREAM_NAME}.tiktok`,
  FACEBOOK = `${STREAM_NAME}.facebook`,
}

export enum DurableName {
  TIKTOK = 'tiktok_durable',
  FACEBOOK = 'facebook_durable',
}
