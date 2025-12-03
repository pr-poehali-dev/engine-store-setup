import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUserAuth } from '@/contexts/UserAuthContext';
import Icon from '@/components/ui/icon';
import Footer from '@/components/Footer';

interface Order {
  id: string;
  date: string;
  items: any[];
  total: number;
  status: string;
  delivery: {
    method: string;
    address?: string;
  };
}

const statusLabels: Record<string, string> = {
  new: 'Новый',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

const statusColors: Record<string, string> = {
  new: 'bg-blue-500',
  processing: 'bg-yellow-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

export default function Account() {
  const navigate = useNavigate();
  const { user, login, logout } = useUserAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = allOrders.filter((order: Order) => 
      order.customer?.phone === user.phone
    );
    setOrders(userOrders);
  }, [user, navigate]);

  const handleSave = () => {
    if (user) {
      login(formData.phone, formData.name, formData.email);
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <Icon name="Settings" size={32} className="text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary font-['Montserrat']">ПромДвигатель</h1>
              <p className="text-sm text-muted-foreground">Профессиональные решения</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            На главную
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 font-['Montserrat']">Личный кабинет</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Профиль</CardTitle>
                  <CardDescription>Ваши личные данные</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Имя</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSave} className="flex-1">
                          Сохранить
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Отмена
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Имя</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Телефон</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
                        <Icon name="Pencil" size={16} className="mr-2" />
                        Редактировать
                      </Button>
                    </>
                  )}
                  
                  <Separator />
                  
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Выйти
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>История заказов</CardTitle>
                  <CardDescription>Всего заказов: {orders.length}</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 opacity-20" />
                      <p>У вас пока нет заказов</p>
                      <Button className="mt-4" onClick={() => navigate('/')}>
                        Перейти в каталог
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold">Заказ #{order.id.slice(0, 8)}</h3>
                                  <Badge className={statusColors[order.status]}>
                                    {statusLabels[order.status]}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.date).toLocaleString('ru-RU')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold">{order.total.toLocaleString('ru-RU')} ₽</p>
                              </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Доставка</p>
                                <p className="font-medium">{order.delivery.method}</p>
                                {order.delivery.address && (
                                  <p className="text-sm text-muted-foreground">{order.delivery.address}</p>
                                )}
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Товары ({order.items.length} шт.)</p>
                                <div className="space-y-2">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm">
                                      <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-12 h-12 object-cover rounded"
                                      />
                                      <div className="flex-1">
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-muted-foreground">{item.manufacturer}</p>
                                      </div>
                                      <p className="font-semibold">{item.price.toLocaleString('ru-RU')} ₽</p>
                                    </div>
                                  ))}
                                </div>
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}