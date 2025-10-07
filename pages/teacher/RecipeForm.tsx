import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';
import { Recipe, Product, RecipeIngredient } from '../../types';

const getServingsFromYield = (yieldStr: string): number => {
    if (!yieldStr) return 1;
    const match = yieldStr.match(/\d+/);
    const servings = match ? parseInt(match[0], 10) : 1;
    return servings > 0 ? servings : 1;
};

export const RecipeForm: React.FC = () => {
    const { recipeId } = useParams<{ recipeId?: string }>();
    const navigate = useNavigate();
    const { recipes, setRecipes, products } = useData();
    const { currentUser } = useAuth();

    const [formState, setFormState] = useState<Omit<Recipe, 'id' | 'authorId'>>({
        name: '', description: '', photo: '', yield: '', ingredients: [],
        preparationSteps: '', keyPoints: '', isPublic: false, cost: 0, price: 0
    });
    const [searchTerm, setSearchTerm] = useState('');

    const productsMap = useMemo(() => new Map(products.map(p => [p.id, p])), [products]);

    useEffect(() => {
        if (recipeId) {
            const existingRecipe = recipes.find(r => r.id === recipeId);
            if (existingRecipe) {
                setFormState(existingRecipe);
            }
        }
    }, [recipeId, recipes]);
    
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return [];
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, products]);
    
    const handleIngredientChange = (index: number, field: 'quantity' | 'unit', value: string | number) => {
        const newIngredients = [...formState.ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setFormState({...formState, ingredients: newIngredients});
    };
    
    const addIngredient = (product: Product) => {
        if (!formState.ingredients.some(i => i.productId === product.id)) {
            const newIngredient: RecipeIngredient = { productId: product.id, quantity: 1, unit: product.unit || 'Uds' };
            setFormState({...formState, ingredients: [...formState.ingredients, newIngredient]});
        }
        setSearchTerm('');
    };
    
    const removeIngredient = (index: number) => {
        setFormState({...formState, ingredients: formState.ingredients.filter((_, i) => i !== index)});
    };
    
    const calculatedTotalCost = useMemo(() => {
        return formState.ingredients.reduce((total, ing) => {
            const product = productsMap.get(ing.productId);
            // Simplified cost calculation, uses first supplier price
            const price = product?.suppliers[0]?.price || 0;
            return total + (price * ing.quantity);
        }, 0);
    }, [formState.ingredients, productsMap]);

    const servings = useMemo(() => getServingsFromYield(formState.yield), [formState.yield]);

    const calculatedCostPerServing = useMemo(() => {
        return servings > 0 ? calculatedTotalCost / servings : 0;
    }, [calculatedTotalCost, servings]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormState(prev => ({...prev, photo: reader.result as string}));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!currentUser) return;
        
        const recipeToSave: Recipe = {
            id: recipeId || `rec-${Date.now()}`,
            authorId: currentUser.id,
            ...formState,
            cost: calculatedCostPerServing,
            price: formState.price
        };
        
        const newRecipes = recipeId 
            ? recipes.map(r => r.id === recipeId ? recipeToSave : r)
            : [...recipes, recipeToSave];
        
        setRecipes(newRecipes);
        navigate('/teacher/recipes');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">{recipeId ? 'Editar' : 'Nueva'} Receta</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card title="Información General y Elaboración">
                            <div className="space-y-4">
                                <input type="text" placeholder="Nombre de la Receta" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} required className="w-full p-2 border rounded dark:bg-gray-700" />
                                <textarea placeholder="Descripción corta" value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} rows={2} className="w-full p-2 border rounded dark:bg-gray-700" />
                                <input type="text" placeholder="Rendimiento (ej: 4 raciones)" value={formState.yield} onChange={e => setFormState({...formState, yield: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700" required />
                                <textarea placeholder="Pasos de la preparación..." value={formState.preparationSteps} onChange={e => setFormState({...formState, preparationSteps: e.target.value})} rows={8} required className="w-full p-2 border rounded dark:bg-gray-700" />
                            </div>
                        </Card>
                        <Card title="Ingredientes">
                            <div className="relative mb-4">
                                <input type="text" placeholder="Buscar producto para añadir..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700"/>
                                {searchTerm && (
                                    <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border rounded-b-md shadow-lg max-h-40 overflow-y-auto">
                                        {filteredProducts.map(p => <li key={p.id} onClick={() => addIngredient(p)} className="p-2 hover:bg-primary-100 cursor-pointer">{p.name}</li>)}
                                    </ul>
                                )}
                            </div>
                            <div className="space-y-2">
                                {formState.ingredients.map((ing, index) => (
                                    <div key={ing.productId} className="flex items-center gap-2">
                                        <span className="flex-grow">{productsMap.get(ing.productId)?.name}</span>
                                        <input type="number" value={ing.quantity} onChange={e => handleIngredientChange(index, 'quantity', parseFloat(e.target.value))} className="w-20 p-1 border rounded dark:bg-gray-700"/>
                                        <input type="text" value={ing.unit} onChange={e => handleIngredientChange(index, 'unit', e.target.value)} className="w-20 p-1 border rounded dark:bg-gray-700"/>
                                        <button type="button" onClick={() => removeIngredient(index)} className="text-red-500 p-1">✖</button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card title="Detalles y Visibilidad">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Foto de la Receta</label>
                                    <div className="mt-1 flex flex-col items-center space-y-2">
                                        {formState.photo ? 
                                            <img src={formState.photo} alt="Previsualización de la receta" className="h-40 w-full object-cover rounded-md"/>
                                            : <div className="h-40 w-full bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-400">Sin foto</div>
                                        }
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handlePhotoChange} 
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label>Coste Total Receta (para {servings} {servings === 1 ? 'ración' : 'raciones'})</label>
                                    <p className="font-bold text-lg">{calculatedTotalCost.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'})}</p>
                                </div>
                                <div>
                                    <label>Coste por Ración</label>
                                    <p className="font-bold text-lg text-primary-600">{calculatedCostPerServing.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'})}</p>
                                </div>
                                 <div>
                                    <label>Precio de Venta</label>
                                    <input type="number" step="0.01" placeholder="Precio" value={formState.price} onChange={e => setFormState({...formState, price: parseFloat(e.target.value) || 0})} required className="w-full mt-1 p-2 border rounded dark:bg-gray-700"/>
                                </div>
                                <div>
                                    <label className="flex items-center">
                                        <input type="checkbox" checked={formState.isPublic} onChange={e => setFormState({...formState, isPublic: e.target.checked})} className="h-4 w-4 rounded" />
                                        <span className="ml-2">Hacer receta pública</span>
                                    </label>
                                </div>
                                 <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700">Guardar Receta</button>
                                <button type="button" onClick={() => navigate('/teacher/recipes')} className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600">Cancelar</button>
                            </div>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};