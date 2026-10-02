import{Router}from"express";import{getPublicResults}from"../controllers/resultsController";const router=Router();router.get("/public/:slug",getPublicResults);export default router;
