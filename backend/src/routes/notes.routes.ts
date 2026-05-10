import { Router } from 'express';
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/notes.controller';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true });

router.get('/', authenticate, getNotes);
router.post('/', authenticate, createNote);
router.put('/:id', authenticate, updateNote);
router.delete('/:id', authenticate, deleteNote);

export default router;
