import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Order {
  id: string;
  date: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    isCompany: boolean;
    inn?: string;
    companyName?: string;
  };
  delivery: {
    method: string;
    address?: string;
    cost: number;
  };
  payment: string;
  items: any[];
  total: number;
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  comment?: string;
}

const statusLabels = {
  new: 'Новый',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

const statusColors = {
  new: 'bg-blue-500',
  processing: 'bg-yellow-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const deleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Управление заказами</CardTitle>
          <CardDescription>Всего заказов: {orders.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 opacity-20" />
              <p>Заказов пока нет</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">Заказ #{order.id.slice(0, 8)}</h3>
                          <Badge className={statusColors[order.status]}>
                            {statusLabels[order.status]}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p className="flex items-center gap-2">
                            <Icon name="User" size={14} />
                            {order.customer.name}
                          </p>
                          <p className="flex items-center gap-2">
                            <Icon name="Phone" size={14} />
                            {order.customer.phone}
                          </p>
                          <p className="flex items-center gap-2">
                            <Icon name="Calendar" size={14} />
                            {new Date(order.date).toLocaleString('ru-RU')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <span className="text-sm font-medium">Товаров: {order.items.length}</span>
                          <Separator orientation="vertical" className="h-4" />
                          <span className="text-lg font-bold">{order.total.toLocaleString('ru-RU')} ₽</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                              <Icon name="Eye" size={16} className="mr-2" />
                              Подробнее
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Заказ #{order.id.slice(0, 8)}</DialogTitle>
                              <DialogDescription>
                                {new Date(order.date).toLocaleString('ru-RU')}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedOrder && (
                              <div className="space-y-6">
                                <div>
                                  <h4 className="font-semibold mb-3">Статус заказа</h4>
                                  <Select 
                                    value={selectedOrder.status} 
                                    onValueChange={(value) => updateOrderStatus(selectedOrder.id, value as Order['status'])}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(statusLabels).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                          {label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <Separator />

                                <div>
                                  <h4 className="font-semibold mb-3">Информация о клиенте</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Имя:</span> {selectedOrder.customer.name}</p>
                                    <p><span className="font-medium">Телефон:</span> {selectedOrder.customer.phone}</p>
                                    <p><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
                                    {selectedOrder.customer.isCompany && (
                                      <>
                                        <p><span className="font-medium">Компания:</span> {selectedOrder.customer.companyName}</p>
                                        <p><span className="font-medium">ИНН:</span> {selectedOrder.customer.inn}</p>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <Separator />

                                <div>
                                  <h4 className="font-semibold mb-3">Доставка</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Способ:</span> {selectedOrder.delivery.method}</p>
                                    {selectedOrder.delivery.address && (
                                      <p><span className="font-medium">Адрес:</span> {selectedOrder.delivery.address}</p>
                                    )}
                                    <p><span className="font-medium">Стоимость:</span> {selectedOrder.delivery.cost} ₽</p>
                                  </div>
                                </div>

                                <Separator />

                                <div>
                                  <h4 className="font-semibold mb-3">Оплата</h4>
                                  <p className="text-sm">{selectedOrder.payment}</p>
                                </div>

                                <Separator />

                                <div>
                                  <h4 className="font-semibold mb-3">Товары</h4>
                                  <div className="space-y-3">
                                    {selectedOrder.items.map((item, idx) => (
                                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                        <div className="flex-1">
                                          <p className="font-medium">{item.name}</p>
                                          <p className="text-sm text-muted-foreground">{item.manufacturer}</p>
                                        </div>
                                        <p className="font-bold">{item.price.toLocaleString('ru-RU')} ₽</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {selectedOrder.comment && (
                                  <>
                                    <Separator />
                                    <div>
                                      <h4 className="font-semibold mb-3">Комментарий</h4>
                                      <p className="text-sm">{selectedOrder.comment}</p>
                                    </div>
                                  </>
                                )}

                                <Separator />

                                <div className="flex justify-between items-center text-lg font-bold">
                                  <span>Итого:</span>
                                  <span>{selectedOrder.total.toLocaleString('ru-RU')} ₽</span>
                                </div>

                                <Button 
                                  variant="destructive" 
                                  className="w-full"
                                  onClick={() => deleteOrder(selectedOrder.id)}
                                >
                                  <Icon name="Trash2" size={18} className="mr-2" />
                                  Удалить заказ
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Select 
                          value={order.status} 
                          onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
