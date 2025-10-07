import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { PlusIcon, DownloadIcon, PencilIcon, TrashIcon, ShareIcon } from '../../components/icons';
import { printPage, generateRecipePdf } from '../../utils/export';
import { Recipe, Message } from '../../types';
import { ComposeMessageModal } from '../shared/Messaging';
import { useAuth } from '../../contexts/AuthContext';
import { useCreator } from '../../contexts/CreatorContext';

export const RecipeManager: React.FC = () => {
    const { recipes, setRecipes, users, products, setMessages } = useData();
    const { currentUser } = useAuth();
    const { creatorInfo } = useCreator();
    const [searchTerm, setSearchTerm] = useState('');

    const [recipeToShare, setRecipeToShare] = useState<Recipe | null>(null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    
    const productsMap = useMemo(() => new Map(products.map(p => [p.id, p])), [products]);

    const filteredRecipes = useMemo(() => {
        if (!searchTerm) return recipes;
        return recipes.filter(r => 
            r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [recipes, searchTerm]);

    const handleDelete = (recipeId: string, recipeName: string) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la receta "${recipeName}"?`)) {
            setRecipes(prev => prev.filter(r => r.id !== recipeId));
        }
    };
    
    const handleShareClick = (recipe: Recipe) => {
        setRecipeToShare(recipe);
    };

    const handleCloseShareModal = () => {
        setRecipeToShare(null);
        setIsComposeOpen(false);
    };

    const handleDownloadPdf = () => {
        if (!recipeToShare) return;
        const author = users.find(u => u.id === recipeToShare.authorId);
        generateRecipePdf(recipeToShare, author?.name || 'Desconocido', productsMap, creatorInfo.appName);
        handleCloseShareModal();
    };

    const getRecipeAsText = () => {
        if (!recipeToShare) return '';
        const ingredientsText = recipeToShare.ingredients.map(ing => {
            const product = productsMap.get(ing.productId);
            return `- ${product?.name || 'Ingrediente desconocido'}: ${ing.quantity} ${ing.unit}`;
        }).join('\n');

        return `
Hola,

Quería compartir esta receta contigo:

*${recipeToShare.name}*
_${recipeToShare.description}_

*Rendimiento:* ${recipeToShare.yield}
*Coste/ración:* ${recipeToShare.cost.toFixed(2)}€

*Ingredientes:*
${ingredientsText}

*Elaboración:*
${recipeToShare.preparationSteps}

${recipeToShare.keyPoints ? `*Puntos Clave:*\n${recipeToShare.keyPoints}` : ''}

Enviado por: ${currentUser?.name}
        `.trim();
    };

    const handleSendMessage = (newMessage: Omit<Message, 'id' | 'date' | 'senderId'>) => {
        if (!currentUser) return;
        const message: Message = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            date: new Date().toISOString(),
            readBy: {},
            ...newMessage
        };
        setMessages(prev => [...prev, message]);
        handleCloseShareModal();
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Mis Recetas</h1>
                <div className="no-print flex items-center space-x-2">
                    <button onClick={printPage} className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 flex items-center">
                        <DownloadIcon className="w-5 h-5 mr-1" /> Descargar PDF
                    </button>
                    <Link to="/teacher/recipes/new" className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 flex items-center">
                        <PlusIcon className="w-5 h-5 mr-1" /> Nueva Receta
                    </Link>
                </div>
            </div>

            <Card>
                <div className="mb-4">
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o descripción..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-700"
                    />
                </div>
                {recipes.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Visibilidad</th>
                                    <th className="px-4 py-3">Coste / ración</th>
                                    <th className="px-4 py-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecipes.map(recipe => (
                                    <tr key={recipe.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-4 py-2">
                                            <div className="font-bold">{recipe.name}</div>
                                            <div className="text-xs text-gray-500 truncate" style={{maxWidth: '30ch'}}>{recipe.description}</div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${recipe.isPublic ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                                {recipe.isPublic ? 'Pública' : 'Privada'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 font-mono">
                                            {recipe.cost.toFixed(2)}€
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button onClick={() => handleShareClick(recipe)} className="p-1 text-gray-500 hover:text-blue-600" title="Compartir">
                                                    <ShareIcon className="w-5 h-5" />
                                                </button>
                                                <Link to={`/teacher/recipes/edit/${recipe.id}`} className="p-1 text-gray-500 hover:text-primary-600" title="Editar">
                                                    <PencilIcon className="w-5 h-5" />
                                                </Link>
                                                <button onClick={() => handleDelete(recipe.id, recipe.name)} className="p-1 text-gray-500 hover:text-red-600" title="Eliminar">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-4">Todavía no has creado ninguna receta. <Link to="/teacher/recipes/new" className="text-primary-600 hover:underline">¡Crea la primera!</Link></p>
                )}
            </Card>

            {recipeToShare && (
                <>
                    <Modal isOpen={!isComposeOpen} onClose={handleCloseShareModal} title={`Compartir Receta: ${recipeToShare.name}`}>
                        <div className="space-y-4">
                            <p>Elige cómo quieres compartir la receta.</p>
                            <div className="flex flex-col space-y-3">
                                <button onClick={() => setIsComposeOpen(true)} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                    Enviar por Mensaje Interno
                                </button>
                                <button onClick={handleDownloadPdf} className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                                    Descargar como PDF
                                </button>
                            </div>
                        </div>
                    </Modal>

                    {isComposeOpen && (
                        <ComposeMessageModal
                            users={users}
                            onClose={() => setIsComposeOpen(false)}
                            onSend={handleSendMessage}
                            initialSubject={`Receta compartida: ${recipeToShare.name}`}
                            initialBody={getRecipeAsText()}
                        />
                    )}
                </>
            )}
        </div>
    );
};