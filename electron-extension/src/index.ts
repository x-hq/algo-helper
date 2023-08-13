import { startServer } from './electron/utils/startServer';

// Build the electron app
import './electron/main'

// Start the express server
startServer();