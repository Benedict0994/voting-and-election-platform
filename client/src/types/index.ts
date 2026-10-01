export interface VoteHistory {
  date: string;
  votes: number;
}

export interface Candidate {
  _id: string;
  name: string;
  image: string;
  category: string;
  department: string;
  votes: number;
  slug: string;
  bio?: string;
  voteHistory: VoteHistory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Settings {
  _id?: string;
  votingStart: string | null;
  votingEnd: string | null;
  candidateCanViewVotes: boolean;
}

export interface User {
  name: string;
  email: string;
  id: string;
  awardSpace: string;
}
