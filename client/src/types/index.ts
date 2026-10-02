export interface VoteHistory { date:string; votes:number; }
export interface Candidate { _id:string; id?:string; name:string; image:string; category:string; department:string; votes:number; slug:string; bio?:string; votingCode:string; voteHistory:VoteHistory[]; awardSpace?:string; createdAt?:string; updatedAt?:string; }
export interface VotePackage { votes:number; amount_minor:number; }
export interface Settings { _id?:string; votingStart:string|null; votingEnd:string|null; candidateCanViewVotes:boolean; votePriceMinor?:number; currency?:string; votePackages?:VotePackage[]; }
export type EventRole="owner"|"admin"|"finance"|"viewer"|"returning_officer"|"election_officer"|"observer";
export interface User { name:string; email:string; id:string; awardSpace:string; awardName?:string; eventType?:"award"|"election"; eventRole?:EventRole; }
