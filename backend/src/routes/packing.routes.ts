import { Router } from 'express';
import {
  getPackingItems, createPackingItem, updatePackingItem,
  deletePackingItem, bulkUpdatePackingItems
} from '../controllers/packing.controller';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true });

router.get('/', authenticate, getPackingItems);
router.post('/', authenticate, createPackingItem);
router.put('/bulk', authenticate, bulkUpdatePackingItems);
router.put('/:id', authenticate, updatePackingItem);
router.delete('/:id', authenticate, deletePackingItem);

export default router;
