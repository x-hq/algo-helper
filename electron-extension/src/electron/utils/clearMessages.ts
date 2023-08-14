import { broadcast } from '../../server/utils/broadcast';
import { clearMessages as dbClearMessages } from '../../server/utils/getCompletion';
export const clearMessages = () => {
    dbClearMessages();
    broadcast('CLEAR_MESSAGES');
}