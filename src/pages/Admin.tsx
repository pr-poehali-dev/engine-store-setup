import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/ui/icon';
import OrdersManagement from '@/components/admin/OrdersManagement';
import CatalogManagement from '@/components/admin/CatalogManagement';

export default function Admin() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Админ-панель</h1>
              <p className="text-sm text-muted-foreground">Управление магазином двигателей</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Icon name="ShoppingCart" size={18} />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <Icon name="Package" size={18} />
              Каталог
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <OrdersManagement />
          </TabsContent>

          <TabsContent value="catalog" className="space-y-4">
            <CatalogManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
