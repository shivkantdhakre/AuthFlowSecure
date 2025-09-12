import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { storage } from './storage';

interface ExtendedWebSocket extends WebSocket {
  userId?: string;
  classId?: string;
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ 
    server, 
    path: '/ws'
  });

  wss.on('connection', (ws: ExtendedWebSocket, request) => {
    console.log('WebSocket connection established');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'join_class':
            ws.userId = message.userId;
            ws.classId = message.classId;
            break;
            
          case 'chat_message':
            if (ws.userId && ws.classId) {
              // Save message to database
              await storage.createMessage({
                classId: ws.classId,
                senderId: ws.userId,
                message: message.content
              });
              
              // Broadcast to all clients in the same class
              wss.clients.forEach((client: ExtendedWebSocket) => {
                if (client !== ws && 
                    client.readyState === WebSocket.OPEN && 
                    client.classId === ws.classId) {
                  client.send(JSON.stringify({
                    type: 'chat_message',
                    userId: ws.userId,
                    content: message.content,
                    timestamp: new Date().toISOString()
                  }));
                }
              });
            }
            break;
            
          case 'raise_hand':
            if (ws.userId && ws.classId) {
              // Broadcast hand raise to teacher and other students
              wss.clients.forEach((client: ExtendedWebSocket) => {
                if (client !== ws && 
                    client.readyState === WebSocket.OPEN && 
                    client.classId === ws.classId) {
                  client.send(JSON.stringify({
                    type: 'hand_raised',
                    userId: ws.userId,
                    timestamp: new Date().toISOString()
                  }));
                }
              });
            }
            break;
            
          case 'accept_hand':
            // Teacher accepting a student's raised hand
            if (ws.userId && ws.classId) {
              wss.clients.forEach((client: ExtendedWebSocket) => {
                if (client.readyState === WebSocket.OPEN && 
                    client.classId === ws.classId &&
                    client.userId === message.studentId) {
                  client.send(JSON.stringify({
                    type: 'hand_accepted',
                    teacherId: ws.userId,
                    timestamp: new Date().toISOString()
                  }));
                }
              });
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return wss;
}
