// import { Request, Response } from "express";
// // import VotingControl from "../models/VotingControl";
// import Candidate from "../models/Candidate";
// import Transaction from "../models/Settings";

// export async function getVotingStatus(req: Request, res: Response) {
//   try {
//     let control = await VotingControl.findOne();

//     if (!control) {
//       control = await VotingControl.create({
//         isVotingOpen: false,
//         startsAt: null,
//         endsAt: null,
//       });
//     }

//     return res.status(200).json(control);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Failed to fetch voting status", error });
//   }
// }

// export async function updateVotingStatus(req: Request, res: Response) {
//   try {
//     const { isVotingOpen, startsAt, endsAt } = req.body;

//     let control = await VotingControl.findOne();

//     if (!control) {
//       control = await VotingControl.create({
//         isVotingOpen: false,
//         startsAt: null,
//         endsAt: null,
//       });
//     }

//     if (typeof isVotingOpen === "boolean") {
//       control.isVotingOpen = isVotingOpen;
//     }

//     if (startsAt !== undefined) {
//       control.startsAt = startsAt ? new Date(startsAt) : null;
//     }

//     if (endsAt !== undefined) {
//       control.endsAt = endsAt ? new Date(endsAt) : null;
//     }

//     await control.save();

//     return res.status(200).json({
//       message: "Voting status updated successfully",
//       control,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Failed to update voting status", error });
//   }
// }

// export async function getDashboardSummary(req: Request, res: Response) {
//   try {
//     const candidates = await Candidate.find().sort({ totalVotes: -1 });
//     const transactions = await Transaction.find().sort({ createdAt: -1 });

//     const totalVotes = candidates.reduce(
//       (sum, candidate) => sum + candidate.totalVotes,
//       0,
//     );
//     const totalRevenuePesewa = transactions
//       .filter((tx) => tx.status === "success")
//       .reduce((sum, tx) => sum + tx.amount, 0);

//     return res.status(200).json({
//       totalCandidates: candidates.length,
//       totalVotes,
//       totalRevenueGHS: totalRevenuePesewa / 100,
//       candidates,
//       transactions,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Failed to load dashboard", error });
//   }
// }
