export interface Room {
  _id: string;
  topic: string;
  speakers: Speaker[];
  roomType: string;
  ownerId: string;
  totalPeople: number;
}

export interface Speaker {
  _id: string;
  name: string;
  avatar: string;
  muted: boolean;
}
