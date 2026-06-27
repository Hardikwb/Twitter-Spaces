export interface Room {
  _id: string;
  topic: string;
  speakers: Speaker[];
  roomType: string;
  ownerId: string;
  totalPeople: number;
}

export interface Speaker {
  id: string;
  name: string;
  avatar: string;
}

export type SocketUser = {
  _id: string;
};
