
import express from 'express';
const router = express.Router();




router.get('/getTasks/:id', (req, res) => {
    const { id } = req.params;
    req.options = req.query;
    res.redirect(`/tasks/${id}?${new URLSearchParams(req.query).toString()}`);
});

export default router;
