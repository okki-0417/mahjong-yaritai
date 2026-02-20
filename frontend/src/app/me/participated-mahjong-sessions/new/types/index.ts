export type GameSessionFormType = {
  participantUsers: ParticipantUserType[];
  games: GameType[];
  rate: number;
  chipAmount: number;
  createdDate: string;
};

export type GameType = {
  results: {
    resultPoints: number | null;
    ranking: number | null;
  }[];
};

export type ParticipantUserType = {
  userId: string | null;
  avatarUrl: string | null;
  name: string;
};
