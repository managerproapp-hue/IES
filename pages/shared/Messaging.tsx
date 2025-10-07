import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { PlusIcon, DownloadIcon } from '../../components/icons';
import { Message, User, Profile } from '../../types';
import { downloadJson } from '../../utils/export';

interface ComposeMessageModalProps {
    users: User[];
    onClose: () => void;
    onSend: (msg: Omit<Message, 'id' | 'date' | 'senderId'>) => void;
    initialSubject?: string;
    initialBody?: string;
}

export const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({ users, onClose, onSend, initialSubject = '', initialBody = '' }) => {
    const { currentUser } = useAuth();
    const { classrooms } = useData();
    const [recipients, setRecipients] = useState<string[]>([]);
    const [subject, setSubject] = useState(initialSubject);
    const [body, setBody] = useState(initialBody);

    const isStudent = currentUser?.profiles.includes(Profile.STUDENT);

    const recipientOptions = useMemo(() => {
        if (isStudent && currentUser.classroomId) {
            const myClassroom = classrooms.find(c => c.id === currentUser.classroomId);
            if (myClassroom) {
                const tutor = users.find(u => u.id === myClassroom.tutorId);
                const classmates = users.filter(u => u.classroomId === currentUser.classroomId && u.id !== currentUser.id);
                return [tutor, ...classmates].filter((u): u is User => !!u);
            }
            return [];
        }
        return users.filter(u => u.id !== currentUser?.id);
    }, [users, currentUser, isStudent, classrooms]);
    
    const handleSelectGroup = (profile: Profile) => {
        const groupIds = users.filter(u => u.profiles.includes(profile) && u.id !== currentUser?.id).map(u => u.id);
        const newRecipients = Array.from(new Set([...recipients, ...groupIds]));
        setRecipients(newRecipients);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // FIX: Added the 'readBy' property, initialized as an empty object, to align with the Message type definition.
        onSend({ recipientIds: recipients, subject, body, readBy: {} });
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Redactar Mensaje">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Para:</label>
                    <select multiple value={recipients} // FIX: Explicitly type the `option` parameter in `Array.from` callback to `HTMLOptionElement` to resolve type inference issues.
onChange={e => setRecipients(Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value))} className="w-full h-24 p-2 border rounded dark:bg-gray-700">
                        {recipientOptions.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                    </select>
                    {!isStudent && (
                        <div className="flex space-x-2 mt-1">
                            <button type="button" onClick={() => handleSelectGroup(Profile.TEACHER)} className="text-xs bg-gray-200 px-2 py-1 rounded">Profesores</button>
                            <button type="button" onClick={() => handleSelectGroup(Profile.ALMACEN)} className="text-xs bg-gray-200 px-2 py-1 rounded">Almacén</button>
                             <button type="button" onClick={() => handleSelectGroup(Profile.ADMIN)} className="text-xs bg-gray-200 px-2 py-1 rounded">Admins</button>
                        </div>
                    )}
                </div>
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Asunto" required className="w-full p-2 border rounded dark:bg-gray-700"/>
                <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Mensaje..." rows={5} required className="w-full p-2 border rounded dark:bg-gray-700"/>
                <div className="flex justify-end pt-4"><button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-md">Enviar</button></div>
            </form>
        </Modal>
    );
};

export const Messaging: React.FC = () => {
    const { messages, setMessages, users } = useData();
    const { currentUser } = useAuth();
    const [view, setView] = useState<'inbox' | 'sent'>('inbox');
    const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    const usersMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

    const myInbox = useMemo(() => 
        messages
            .filter(m => m.recipientIds.includes(currentUser?.id || ''))
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    , [messages, currentUser]);

    const mySentBox = useMemo(() =>
        messages
            .filter(m => m.senderId === currentUser?.id)
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    , [messages, currentUser]);

    const handleSendMessage = (newMessage: Omit<Message, 'id' | 'date' | 'senderId'>) => {
        const message: Message = {
            id: `msg-${Date.now()}`,
            senderId: currentUser!.id,
            date: new Date().toISOString(),
            readBy: {},
            ...newMessage
        };
        setMessages([...messages, message]);
        setIsComposeModalOpen(false);
    };

    const handleMessageClick = (message: Message) => {
        setSelectedMessage(message);
        if (view === 'inbox' && currentUser && !message.readBy[currentUser.id]) {
            const updatedMessage = { ...message, readBy: { ...message.readBy, [currentUser.id]: true } };
            setMessages(messages.map(m => m.id === message.id ? updatedMessage : m));
        }
    };

    const handleDownloadAll = () => {
        const messagesToDownload = view === 'inbox' ? myInbox : mySentBox;
        if (messagesToDownload.length > 0) {
            downloadJson(`${view}_messages_${new Date().toISOString().slice(0,10)}.json`, messagesToDownload);
        } else {
            alert('No hay mensajes para descargar.');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Mensajería Interna</h1>
                <div className="no-print flex space-x-2">
                    <button onClick={handleDownloadAll} className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 flex items-center">
                        <DownloadIcon className="w-5 h-5 mr-1" /> Descargar Todos
                    </button>
                    <button onClick={() => setIsComposeModalOpen(true)} className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 flex items-center">
                        <PlusIcon className="w-5 h-5 mr-1" /> Redactar Mensaje
                    </button>
                </div>
            </div>
            
            <div className="mb-4 flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg no-print">
                <button onClick={() => setView('inbox')} className={`w-full py-2 rounded-md ${view === 'inbox' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>Bandeja de Entrada ({myInbox.filter(m => currentUser && !m.readBy[currentUser.id]).length})</button>
                <button onClick={() => setView('sent')} className={`w-full py-2 rounded-md ${view === 'sent' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>Enviados</button>
            </div>

            <Card title={view === 'inbox' ? 'Bandeja de Entrada' : 'Mensajes Enviados'}>
                <div className="space-y-2">
                    {(view === 'inbox' ? myInbox : mySentBox).map(message => (
                        <div key={message.id} onClick={() => handleMessageClick(message)} className={`p-3 border-l-4 rounded-r-md cursor-pointer ${ (view === 'sent' || (currentUser && message.readBy[currentUser.id])) ? 'bg-gray-50 dark:bg-gray-700 border-gray-300' : 'bg-blue-50 dark:bg-blue-900/50 border-primary-500'}`}>
                            <div className="flex justify-between text-sm">
                                <p className="font-bold">
                                    {view === 'inbox' 
                                        ? usersMap.get(message.senderId)?.name || 'Sistema'
                                        : message.recipientIds.map(id => usersMap.get(id)?.name).join(', ')
                                    }
                                </p>
                                <div className="flex items-center space-x-3">
                                   <p>{new Date(message.date).toLocaleString()}</p>
                                   <button onClick={(e) => { e.stopPropagation(); downloadJson(`mensaje_${message.id}.json`, message); }} className="no-print text-gray-400 hover:text-primary-500">
                                       <DownloadIcon className="w-4 h-4"/>
                                   </button>
                                </div>
                            </div>
                            <p className="font-semibold">{message.subject}</p>
                        </div>
                    ))}
                     {((view === 'inbox' && myInbox.length === 0) || (view === 'sent' && mySentBox.length === 0)) && (
                        <p className="text-center text-gray-500 p-4">No hay mensajes.</p>
                     )}
                </div>
            </Card>
            
            {isComposeModalOpen && <ComposeMessageModal users={users} onClose={() => setIsComposeModalOpen(false)} onSend={handleSendMessage} />}
            {selectedMessage && <MessageDetailModal message={selectedMessage} usersMap={usersMap} onClose={() => setSelectedMessage(null)} />}
        </div>
    );
};

const MessageDetailModal: React.FC<{ message: Message, usersMap: Map<string, User>, onClose: () => void }> = ({ message, usersMap, onClose }) => (
    <Modal isOpen={true} onClose={onClose} title={message.subject}>
        <div className="space-y-2 text-sm">
            <p><strong>De:</strong> {usersMap.get(message.senderId)?.name || 'Sistema'}</p>
            <p><strong>Para:</strong> {message.recipientIds.map(id => usersMap.get(id)?.name).join(', ')}</p>
            <p><strong>Fecha:</strong> {new Date(message.date).toLocaleString()}</p>
        </div>
        <div className="mt-4 pt-4 border-t dark:border-gray-600 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded-md max-h-60 overflow-y-auto">
            {message.body}
        </div>
         <div className="flex justify-end space-x-2 mt-6">
            <button onClick={() => downloadJson(`mensaje_${message.id}.json`, message)} className="bg-blue-600 text-white px-4 py-2 rounded-md">Descargar</button>
            <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cerrar</button>
        </div>
    </Modal>
);