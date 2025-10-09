import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { PlusIcon, DownloadIcon, WarningIcon, TrashIcon } from '../../components/icons';
import { Product, Supplier, ProductState, WarehouseStatus } from '../../types';
import { exportToCsv } from '../../utils/export';

const ALLERGENS_LIST = [
    "Gluten", "Crustáceos", "Huevos", "Pescado", "Cacahuetes", 
    "Soja", "Lácteos", "Frutos de cáscara", "Apio", "Mostaza", 
    "Sésamo", "Sulfitos", "Altramuces", "Moluscos"
];

const PREDEFINED_FAMILIES = [
    "ACEITES Y GRASAS", "AGUAS, REFRESCOS Y CERVEZAS", "ARROCES, PASTAS Y LEGUMBRES", "CAFÉS E INFUSIONES",
    "Carnes", "CONSERVAS", "DESTILADOS Y COCTELERÍA", "EMBUTIDOS", "ESPECIAS Y CONDIMENTOS",
    "FRUTOS SECOS", "HARINAS, SEMILLAS Y GRANOS", "LÁCTEOS Y HUEVOS", "LICORES Y APERITIVOS",
    "Marisco", "PASTELERÍA Y PANADERÍA", "Pato", "Pescados", "QUESOS", "SALSAS Y CREMAS", "VARIOS",
    "Vegetales", "VINOS", "NO ESTÁN EN LA LISTA/NUEVOS", "OTROS"
];

const PREDEFINED_CATEGORIES = [
    "ACEITES", "AGUAS", "ALGAS", "ARROCES", "AVES Y CAZA", "AZÚCARES", "CABRITO", "CACAO/CHOCOLATES",
    "CAFÉS", "CERDO", "CERVEZAS", "CONDIMENTOS", "CONSERVAS", "CORDERO", "CREMAS", "DESHIDRATADOS",
    "DESTILADOS Y COCTELERÍA", "EMBUTIDOS", "ESPECIAS", "FLORES", "FRUTAS", "FRUTAS CONFITADAS",
    "FRUTAS DESHIDRATADAS", "FRUTAS PROCESADAS", "FRUTOS SECOS", "GRANOS", "GRASAS", "HARINAS",
    "HIERBAS", "HUEVOS", "INFUSIONES", "LÁCTEOS", "LEGUMBRES", "LICORES Y APERITIVOS", "LIOFILIZADOS",
    "MARISCO", "MERMELADAS", "OTROS", "PASTAS", "PATO", "PESCADO", "PREPARADOS", "QUESOS", "REFRESCOS",
    "SALSAS", "SEMILLAS", "SETAS", "SIROPES", "VACUNO", "VERDURAS", "VINOS", "ZUMOS"
].sort();

const PRODUCT_STATES: ProductState[] = [
    'Fresco', 'Congelado', 'Otros', 'Conservas', 'Ahumado', 'Desalado', 'UHT', 'Esterilizado', 'Enlatado', 'Deshidratado'
];

const WAREHOUSE_STATUSES: WarehouseStatus[] = ['Disponible', 'Bajo Pedido', 'Descontinuado'];

const ProductFormModal: React.FC<{ product: Product | null; onClose: () => void; onSave: (product: Product) => void; allProducts: Product[]; allSuppliers: Supplier[] }> = ({ product, onClose, onSave, allProducts, allSuppliers }) => {
    const [formState, setFormState] = useState<Product>(product || { 
        id: '', name: '', description: '', reference: `REF-${Date.now().toString().slice(-6)}`, unit: 'Uds', suppliers: [], tax: 21, category: '', family: '', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible'
    });
    
    const [families, setFamilies] = useState<string[]>(() => [...new Set([...PREDEFINED_FAMILIES, ...allProducts.map(p => p.family).filter(f => f)])].sort());
    const [categories, setCategories] = useState<string[]>(() => [...new Set([...PREDEFINED_CATEGORIES, ...allProducts.map(p => p.category).filter(c => c)])].sort());

    const [addModalType, setAddModalType] = useState<'family' | 'category' | null>(null);
    const [removeModalType, setRemoveModalType] = useState<'family' | 'category' | null>(null);
    const [newListItemName, setNewListItemName] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormState({ ...formState, [name]: type === 'number' ? parseFloat(value) || 0 : value });
    };

    const handleSupplierChange = (index: number, field: 'supplierId' | 'price', value: string) => {
        const newSuppliers = [...formState.suppliers];
        newSuppliers[index] = {...newSuppliers[index], [field]: field === 'price' ? parseFloat(value) || 0 : value};
        setFormState({...formState, suppliers: newSuppliers});
    }

    const handleAllergenChange = (allergen: string) => {
        const newAllergens = formState.allergens.includes(allergen)
            ? formState.allergens.filter(a => a !== allergen)
            : [...formState.allergens, allergen];
        setFormState({ ...formState, allergens: newAllergens });
    };

    const handleAddNew = (type: 'family' | 'category') => {
        setNewListItemName('');
        setAddModalType(type);
    };

    const handleSaveNew = (e: React.FormEvent) => {
        e.preventDefault();
        const newValue = newListItemName;
        if (addModalType && newValue && newValue.trim() !== '') {
            if (addModalType === 'family' && !families.includes(newValue)) {
                setFamilies(prev => [...prev, newValue].sort());
                setFormState(prev => ({...prev, family: newValue}));
            }
            if (addModalType === 'category' && !categories.includes(newValue)) {
                setCategories(prev => [...prev, newValue].sort());
                setFormState(prev => ({...prev, category: newValue}));
            }
        }
        setAddModalType(null);
    };

    const handleRemoveNew = (type: 'family' | 'category') => {
        setRemoveModalType(type);
    };

    const handleConfirmRemove = (valueToRemove: string) => {
        if (!removeModalType) return;
        
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${valueToRemove}" de la lista de sugerencias? Esta acción no se puede deshacer.`)) {
            if (removeModalType === 'family') {
                setFamilies(prev => prev.filter(f => f !== valueToRemove));
                if (formState.family === valueToRemove) {
                    setFormState(prev => ({ ...prev, family: '' }));
                }
            }
            if (removeModalType === 'category') {
                setCategories(prev => prev.filter(c => c !== valueToRemove));
                 if (formState.category === valueToRemove) {
                    setFormState(prev => ({ ...prev, category: '' }));
                }
            }
        }
    };
    
    const addSupplier = () => setFormState({...formState, suppliers: [...formState.suppliers, {supplierId: '', price: 0}]});
    const removeSupplier = (index: number) => setFormState({...formState, suppliers: formState.suppliers.filter((_, i) => i !== index)});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState);
    };

    const handleClose = () => {
        if (addModalType || removeModalType) {
            setAddModalType(null);
            setRemoveModalType(null);
        } else {
            onClose();
        }
    };
    
    const renderMainForm = () => {
        const units = ["Uds", "kg", "g", "L", "ml", "Pack", "Docena"];
        return (
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-1">
                <input type="text" name="name" value={formState.name} onChange={handleChange} placeholder="Nombre del Producto" required className="mt-1 block w-full rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
                <textarea name="description" value={formState.description} onChange={handleChange} placeholder="Descripción" rows={2} className="mt-1 block w-full rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm">Referencia (Automática)</label>
                        <input type="text" name="reference" value={formState.reference} readOnly className="mt-1 block w-full rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 bg-gray-100 cursor-not-allowed"/>
                    </div>
                    <input type="number" name="tax" value={formState.tax} onChange={handleChange} placeholder="IVA %" className="mt-1 block w-full rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
                     <div>
                        <label className="text-sm">Unidad de Medida</label>
                        <select name="unit" value={formState.unit} onChange={handleChange} className="mt-1 block w-full rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600">
                           {units.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                     </div>
                      <div>
                        <label className="text-sm">Estado (Catálogo)</label>
                        <select name="status" value={formState.status} onChange={handleChange} className="mt-1 block w-full rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600">
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                     </div>
                      <div>
                        <label className="text-sm">Condición del Producto</label>
                        <select name="productState" value={formState.productState} onChange={handleChange} className="mt-1 block w-full rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600">
                            {PRODUCT_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="text-sm">Estado (Almacén)</label>
                        <select name="warehouseStatus" value={formState.warehouseStatus} onChange={handleChange} className="mt-1 block w-full rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600">
                            {WAREHOUSE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                     </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm flex justify-between items-center">Familia 
                            <span className="space-x-2">
                                <button type="button" onClick={() => handleAddNew('family')} className="text-xs text-primary-600 hover:underline">Añadir</button>
                                <button type="button" onClick={() => handleRemoveNew('family')} className="text-xs text-red-500 hover:underline">Eliminar</button>
                            </span>
                        </label>
                        <input list="families" name="family" value={formState.family} onChange={handleChange} className="mt-1 block w-full rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
                        <datalist id="families">{families.map(f => <option key={f} value={f}/>)}</datalist>
                    </div>
                     <div>
                        <label className="text-sm flex justify-between items-center">Categoría 
                            <span className="space-x-2">
                                <button type="button" onClick={() => handleAddNew('category')} className="text-xs text-primary-600 hover:underline">Añadir</button>
                                <button type="button" onClick={() => handleRemoveNew('category')} className="text-xs text-red-500 hover:underline">Eliminar</button>
                            </span>
                        </label>
                        <input list="categories" name="category" value={formState.category} onChange={handleChange} className="mt-1 block w-full rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
                        <datalist id="categories">{categories.map(c => <option key={c} value={c}/>)}</datalist>
                    </div>
                </div>

                <div className="pt-2">
                    <h4 className="font-semibold">Alérgenos</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                        {ALLERGENS_LIST.map(allergen => (
                            <label key={allergen} className="flex items-center space-x-2 text-sm p-1">
                                <input type="checkbox" checked={formState.allergens.includes(allergen)} onChange={() => handleAllergenChange(allergen)} />
                                <span>{allergen}</span>
                            </label>
                        ))}
                    </div>
                </div>
                
                <div className="pt-2">
                     <h4 className="font-semibold">Proveedores y Precios</h4>
                     {formState.suppliers.map((s, index) => (
                         <div key={index} className="flex items-center space-x-2 mt-2">
                            <select value={s.supplierId} onChange={(e) => handleSupplierChange(index, 'supplierId', e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                                <option value="">-- Selecciona --</option>
                                {allSuppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                            </select>
                            <input type="number" step="0.01" value={s.price} onChange={(e) => handleSupplierChange(index, 'price', e.target.value)} placeholder="Precio" className="w-32 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                            <button type="button" onClick={() => removeSupplier(index)} className="text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                         </div>
                     ))}
                     <button type="button" onClick={addSupplier} className="text-sm text-primary-600 mt-2">Añadir Proveedor</button>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-md">Cancelar</button>
                    <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-md">Guardar</button>
                </div>
            </form>
        );
    };

    const renderAddForm = () => {
        const type = addModalType!;
        const placeholder = type === 'family' ? 'Ej: LACTEOS Y DERIVADOS' : 'Ej: VERDURAS';
        const buttonText = type === 'family' ? 'Guardar Familia' : 'Guardar Categoría';
        return (
            <form onSubmit={handleSaveNew}>
                <label>Nombre de la {type === 'family' ? 'Familia' : 'Categoría'}</label>
                <input
                    type="text"
                    value={newListItemName}
                    onChange={e => setNewListItemName(e.target.value)}
                    placeholder={placeholder}
                    className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700"
                    required autoFocus
                />
                <div className="flex justify-end mt-4 space-x-2">
                    <button type="button" onClick={() => setAddModalType(null)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">{buttonText}</button>
                </div>
            </form>
        );
    };

    const renderRemoveList = () => {
        const type = removeModalType!;
        const items = type === 'family' ? families : categories;
        const predefinedItems = type === 'family' ? PREDEFINED_FAMILIES : PREDEFINED_CATEGORIES;
        const removableItems = items.filter(item => !predefinedItems.includes(item));

        return (
            <div>
                <div className="space-y-2 max-h-60 overflow-y-auto p-1">
                    {removableItems.length > 0 ? (
                        removableItems.map(item => (
                            <div key={item} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                <span>{item}</span>
                                <button onClick={() => handleConfirmRemove(item)} className="text-red-500 hover:text-red-700">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No hay elementos personalizados para eliminar.</p>
                    )}
                </div>
                 <div className="flex justify-end mt-4">
                    <button type="button" onClick={() => setRemoveModalType(null)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cerrar</button>
                </div>
            </div>
        );
    };

    let content, title;
    let modalSize: 'sm' | 'xl' = 'xl';

    if (addModalType) {
        title = addModalType === 'family' ? 'Añadir Nueva Familia' : 'Añadir Nueva Categoría';
        content = renderAddForm();
        modalSize = 'sm';
    } else if (removeModalType) {
        title = removeModalType === 'family' ? 'Eliminar Familia de la Lista' : 'Eliminar Categoría de la Lista';
        content = renderRemoveList();
        modalSize = 'sm';
    } else {
        title = product ? 'Editar Producto' : 'Añadir Nuevo Producto';
        content = renderMainForm();
        modalSize = 'xl';
    }

    return (
        <Modal isOpen={true} onClose={handleClose} title={title} size={modalSize}>
            {content}
        </Modal>
    );
};


export const ProductManager: React.FC = () => {
    const { products, setProducts, suppliers } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [filter, setFilter] = useState('');
    const [familyFilter, setFamilyFilter] = useState('');
    const [deleteStep, setDeleteStep] = useState(1);

    const suppliersMap = useMemo(() => new Map(suppliers.map(s => [s.id, s])), [suppliers]);
    const activeSuppliers = useMemo(() => new Set(suppliers.filter(s => s.status === 'Activo').map(s => s.id)), [suppliers]);

    const getBestPriceInfo = (product: Product) => {
        if (!product.suppliers || product.suppliers.length === 0) {
            return { price: null, supplierName: 'N/A', otherSupplierCount: 0 };
        }

        const activeProductSuppliers = product.suppliers.filter(ps => activeSuppliers.has(ps.supplierId));

        if (activeProductSuppliers.length === 0) {
            return { price: null, supplierName: 'Ninguno Activo', otherSupplierCount: product.suppliers.length };
        }

        const sortedByPrice = [...activeProductSuppliers].sort((a, b) => a.price - b.price);
        const best = sortedByPrice[0];
        const supplier = suppliersMap.get(best.supplierId);

        return {
            price: best.price,
            supplierName: supplier?.name || 'Desconocido',
            otherSupplierCount: activeProductSuppliers.length - 1
        };
    };
    
    const uniqueFamilies = useMemo(() => [...new Set(products.map(p => p.family).filter(Boolean))].sort(), [products]);

    const filteredProducts = useMemo(() => {
        return products
            .filter(p => filter ? p.name.toLowerCase().includes(filter.toLowerCase()) : true)
            .filter(p => familyFilter ? p.family === familyFilter : true);
    }, [products, filter, familyFilter]);

    const handleOpenModal = (product: Product | null = null) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleSaveProduct = (productData: Product) => {
        if (selectedProduct) {
            setProducts(products.map(p => (p.id === productData.id ? productData : p)));
        } else {
            setProducts([...products, { ...productData, id: `prod-${Date.now()}` }]);
        }
        setIsModalOpen(false);
    };

    const handleOpenDeleteModal = (product: Product) => {
        setSelectedProduct(product);
        setDeleteStep(1);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteProduct = () => {
        if (selectedProduct) {
            setProducts(products.filter(p => p.id !== selectedProduct.id));
        }
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
    };

    const handleExport = () => {
        exportToCsv('productos.csv', products);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Gestión de Productos</h1>
                <div className="flex items-center space-x-2 no-print">
                    <button onClick={handleExport} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center">
                        <DownloadIcon className="w-5 h-5 mr-1" /> Exportar CSV
                    </button>
                    <button onClick={() => handleOpenModal()} className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 flex items-center">
                        <PlusIcon className="w-5 h-5 mr-1" /> Nuevo Producto
                    </button>
                </div>
            </div>

            <Card>
                <div className="flex space-x-4 mb-4 no-print">
                    <input type="text" placeholder="Buscar producto por nombre..." value={filter} onChange={e => setFilter(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700"/>
                    <select value={familyFilter} onChange={e => setFamilyFilter(e.target.value)} className="p-2 border rounded-md dark:bg-gray-700">
                        <option value="">Todas las Familias</option>
                        {uniqueFamilies.map(family => <option key={family} value={family}>{family}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-2 text-left">Nombre</th>
                                <th className="px-4 py-2 text-left">Mejor Precio</th>
                                <th className="px-4 py-2 text-left">Proveedor Principal</th>
                                <th className="px-4 py-2 text-left">Estado</th>
                                <th className="px-4 py-2 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => {
                                const bestPriceInfo = getBestPriceInfo(product);
                                return (
                                <tr key={product.id} className="border-b dark:border-gray-700">
                                    <td className="px-4 py-2 font-medium">{product.name}</td>
                                    <td className="px-4 py-2 font-mono">
                                        {bestPriceInfo.price !== null ? `${bestPriceInfo.price.toFixed(2)}€` : 'N/A'}
                                    </td>
                                    <td className="px-4 py-2">
                                        {bestPriceInfo.supplierName}
                                        {bestPriceInfo.otherSupplierCount > 0 && (
                                            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 rounded-full px-2 py-0.5">
                                                +{bestPriceInfo.otherSupplierCount}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 space-x-2 no-print">
                                        <button onClick={() => handleOpenModal(product)} className="text-primary-600 hover:underline">Editar</button>
                                        <button onClick={() => handleOpenDeleteModal(product)} className="text-red-600 hover:underline">Eliminar</button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isModalOpen && <ProductFormModal product={selectedProduct} onClose={() => setIsModalOpen(false)} onSave={handleSaveProduct} allProducts={products} allSuppliers={suppliers} />}
            
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Eliminación">
                {deleteStep === 1 ? (
                    <div>
                        <div className="text-center">
                            <WarningIcon className="w-16 h-16 text-red-500 mx-auto"/>
                            <p className="text-lg font-semibold my-4">¿Seguro que quieres eliminar {selectedProduct?.name}?</p>
                            <p className="text-gray-500">Esta acción no se puede deshacer.</p>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300">Cancelar</button>
                            <button onClick={() => setDeleteStep(2)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Sí, eliminar</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="mb-4 text-center">Para confirmar, haz clic de nuevo en el botón de eliminar.</p>
                        <div className="mt-6 flex justify-end">
                             <button onClick={handleDeleteProduct} className="w-full px-4 py-2 bg-red-600 text-white rounded-md">Confirmar Eliminación Permanente</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};