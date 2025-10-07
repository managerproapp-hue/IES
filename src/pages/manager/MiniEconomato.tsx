import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
// FIX: Imported StockItem type.
import { Product, User, Profile, Order, StockItem } from '../../types';
import { DownloadIcon } from '../../components/icons';
import { printPage } from '../../utils/export';

export const MiniEconomato: React.FC = () => {
    const { miniEconomatoStock, setMiniEconomatoStock, products, users, orders, setOrders } = useData();
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const productsMap = useMemo(() => new Map(products.map(p => [p.id, p])), [products]);
    const stockMap = useMemo(() => new Map(miniEconomatoStock.map(s => [s.id, s])), [miniEconomatoStock]);

    const economatoProducts = useMemo(() => 
        // FIX: Added explicit type to map parameter to resolve type inference issue.
        Array.from(stockMap.values()).map((stockItem: StockItem) => ({
            product: productsMap.get(stockItem.id)!,
            stock: stockItem
        })).filter(item => item.product)
    , [stockMap, productsMap]);

    const getStockLevelClass = (current: number, min: number) => {
        if (current === 0) return 'bg-red-200 dark:bg-red-900';
        if (current <= min) return 'bg-yellow-200 dark:bg-yellow-900';
        return 'bg-green-200 dark:bg-green-900';
    };

    const handleOpenAssignModal = (product: Product) => {
        setSelectedProduct(product);
        setIsAssignModalOpen(true);
    };

    const handleAssignExpense = (teacherId: string, quantity: number) => {
        if (!selectedProduct || !teacherId || !quantity || quantity <= 0) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const currentStock = stockMap.get(selectedProduct.id);
        if (!currentStock || currentStock.stock < quantity) {
            alert("No hay suficiente stock.");
            return;
        }

        const priceInfo = selectedProduct.suppliers[0];
        if (!priceInfo) {
            alert("El producto no tiene un proveedor/precio definido para calcular el coste.");
            return;
        }
        
        const newOrder: Order = {
            id: `ord-eco-${Date.now()}`,
            userId: teacherId,
            date: new Date().toISOString(),
            status: 'Completado',
            eventId: 'economato-internal',
            items: [{
                productId: selectedProduct.id,
                quantity,
                price: priceInfo.price,
                tax: selectedProduct.tax
            }],
            cost: (priceInfo.price * quantity) * (1 + selectedProduct.tax / 100),
            notes: `Asignado desde MiniEconomato por encargado.`
        };
        setOrders([...orders, newOrder]);

        const newStock = miniEconomatoStock.map(item => 
            item.id === selectedProduct.id ? { ...item, stock: item.stock - quantity } : item
        );
        setMiniEconomatoStock(newStock);

        alert(`Gasto de ${quantity} x ${selectedProduct.name} asignado a profesor.`);
        setIsAssignModalOpen(false);
        setSelectedProduct(null);
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Gestión de Mini-Economato</h1>
                <button onClick={printPage} className="no-print bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 flex items-center">
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Descargar PDF
                </button>
            </div>
            
            <Card title="Stock Interno">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {economatoProducts.map(({ product, stock }) => (
                        <div key={product.id} className={`p-4 rounded-lg ${getStockLevelClass(stock.stock, stock.minStock)}`}>
                            <h4 className="font-bold">{product.name}</h4>
                            <p>Stock: {stock.stock} / Mínimo: {stock.minStock}</p>
                            <button onClick={() => handleOpenAssignModal(product)} className="mt-2 text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-400 no-print" disabled={stock.stock === 0}>
                                Asignar Gasto
                            </button>
                        </div>
                    ))}
                </div>
            </Card>

            {isAssignModalOpen && selectedProduct && (
                <AssignExpenseModal 
                    product={selectedProduct}
                    onClose={() => setIsAssignModalOpen(false)}
                    onAssign={handleAssignExpense}
                    teachers={users.filter(u => u.profiles.includes(Profile.TEACHER) && u.activityStatus === 'Activo')}
                />
            )}
        </div>
    );
};

const AssignExpenseModal: React.FC<{product: Product; onClose: () => void; onAssign: (teacherId: string, quantity: number) => void; teachers: User[]}> = ({ product, onClose, onAssign, teachers }) => {
    const [teacherId, setTeacherId] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAssign(teacherId, quantity);
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title={`Asignar ${product.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Profesor</label>
                    <select value={teacherId} onChange={e => setTeacherId(e.target.value)} required className="w-full mt-1 p-2 border rounded dark:bg-gray-700">
                        <option value="">Selecciona un profesor...</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                <div>
                    <label>Cantidad</label>
                    <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} min="1" required className="w-full mt-1 p-2 border rounded dark:bg-gray-700" />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                     <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-md">Cancelar</button>
                    <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-md">Asignar Gasto</button>
                </div>
            </form>
        </Modal>
    );
};
