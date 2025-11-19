import { Router } from 'express';
import { MensagemController } from '../controllers/MensagemController';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const mensagemController = new MensagemController();

// All message routes require authentication
router.use(authenticate);

// POST /api/mensagens - Send new message
router.post('/', mensagemController.sendMessage.bind(mensagemController));

// GET /api/mensagens/sent - Get sent messages (must be before /:id route)
router.get('/sent', mensagemController.getSentMessages.bind(mensagemController));

// GET /api/mensagens/received - Get received messages
router.get('/received', mensagemController.getReceivedMessages.bind(mensagemController));

// GET /api/mensagens/conversation/:userId - Get conversation with specific user
router.get('/conversation/:userId', mensagemController.getConversation.bind(mensagemController));

// GET /api/mensagens/:id - Get message by ID
router.get('/:id', mensagemController.getMessageById.bind(mensagemController));

// DELETE /api/mensagens/:id - Delete message
router.delete('/:id', mensagemController.deleteMessage.bind(mensagemController));

export default router;


